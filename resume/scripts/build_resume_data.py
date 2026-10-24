"""Generate ``resume/main.tex`` from the homepage configuration.

The academic homepage is the single source of truth:

* ``_config.yml``      -> identity, resume theme and contact links
* ``_data/profile.yml`` -> summary, focus areas and skills
* ``_data/education.yml``
* ``_data/project.yml``
* ``_data/awards.yml``
* ``_data/publications.yml``

Only ``PyYAML`` is required.  Run ``python resume/scripts/build_resume_data.py``
from anywhere; paths are resolved relative to this file.
"""

from __future__ import annotations

import html
import os
import re
import shutil
import textwrap
import urllib.parse
import urllib.request
from datetime import date, datetime
from pathlib import Path
from typing import Any, Iterable, Sequence

import yaml


ROOT = Path(__file__).resolve().parents[2]
RESUME_DIR = ROOT / "resume"
DATA_DIR = ROOT / "_data"
CONFIG_FILE = ROOT / "_config.yml"
MAIN_TEX = RESUME_DIR / "main.tex"
CACHE_DIR = RESUME_DIR / ".cache"

DEFAULT_AVATAR_INITIALS = "ZE"
PUBLIC_BASE_URL = ""


# ---------------------------------------------------------------------------
# YAML loading
# ---------------------------------------------------------------------------


def load_yaml(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


def load_site_config() -> dict[str, Any]:
    config = load_yaml(CONFIG_FILE)
    resume = config.get("resume") or {}
    # Resume-specific values override site-wide values where the names overlap.
    merged = dict(config)
    merged.update(resume)
    merged["resume"] = resume
    if not merged.get("name"):
        merged["name"] = config.get("title", "")
    return merged


# ---------------------------------------------------------------------------
# Text and link helpers
# ---------------------------------------------------------------------------


HTML_LINK_RE = re.compile(
    r"<a\s+[^>]*?href=[\"'](?P<url>[^\"']+)[\"'][^>]*>(?P<label>.*?)</a>",
    re.IGNORECASE | re.DOTALL,
)

_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")


def _find_markdown_links(text: str) -> list[tuple[int, int, str, str]]:
    """Find ``[label](url)`` pairs, allowing balanced parentheses in the URL."""
    results: list[tuple[int, int, str, str]] = []
    cursor = 0
    while True:
        start = text.find("[", cursor)
        if start < 0:
            break
        label_end = text.find("]", start + 1)
        if label_end < 0:
            break
        if label_end + 1 >= len(text) or text[label_end + 1] != "(":
            cursor = start + 1
            continue

        depth = 1
        index = label_end + 2
        while index < len(text) and depth:
            char = text[index]
            if char == "(":
                depth += 1
            elif char == ")":
                depth -= 1
            index += 1
        if depth:
            cursor = start + 1
            continue

        label = text[start + 1:label_end]
        url = text[label_end + 2:index - 1].strip()
        if url and not re.search(r"\s", url):
            results.append((start, index, label, url))
            cursor = index
        else:
            cursor = start + 1
    return results


def has_link(value: Any) -> bool:
    text = "" if value is None else str(value)
    return bool(_find_markdown_links(text) or HTML_LINK_RE.search(text))


def plain_text(value: Any) -> str:
    """Return the human-visible text of a Markdown/HTML string."""
    text = html.unescape("" if value is None else str(value))
    text = _TAG_RE.sub("", text)
    return _WS_RE.sub(" ", text).strip()


def list_field(container: dict[str, Any], key: str, context: str) -> list[Any] | None:
    """Return a YAML list field, raising a clear error for scalar typos."""
    value = container.get(key)
    if value is None:
        return None
    if isinstance(value, (list, tuple)):
        return list(value)
    raise ValueError(f"{context}: '{key}' must be a YAML list, got {type(value).__name__}")


def latex_escape(value: Any) -> str:
    text = "" if value is None else str(value)
    replacements = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    return "".join(replacements.get(ch, ch) for ch in text)


def _latex_fragment(fragment: str, depth: int = 0) -> str:
    """Escape one non-link fragment, preserving a little inline HTML."""
    fragment = html.unescape(fragment)
    fragment = re.sub(r"<br\s*/?>", " ", fragment, flags=re.IGNORECASE)

    protected: list[str] = []

    def protect(pattern: str, command: str) -> None:
        nonlocal fragment

        def replace(match: re.Match[str]) -> str:
            inner = _TAG_RE.sub("", match.group(1))
            inner = _WS_RE.sub(" ", html.unescape(inner)).strip()
            protected.append(rf"\{command}{{{latex_escape(inner)}}}")
            return f"\x00{len(protected) - 1}\x00"

        fragment = re.sub(pattern, replace, fragment, flags=re.IGNORECASE | re.DOTALL)

    if depth == 0:
        protect(r"<(?:strong|b)>(.*?)</(?:strong|b)>", "textbf")
        protect(r"<(?:em|i)>(.*?)</(?:em|i)>", "emph")

    text = _TAG_RE.sub("", fragment)
    text = _WS_RE.sub(" ", text)
    escaped = latex_escape(text)
    for index, replacement in enumerate(protected):
        escaped = escaped.replace(f"\x00{index}\x00", replacement)
    return escaped


def _link_target(url: str) -> str:
    """Return a hyperref-safe target for an absolute or repository-relative URL.

    Repository-relative paths are published site assets, so they become absolute
    public URLs when ``canonical`` is configured.  This keeps the generated PDF
    portable instead of embedding the build machine's filesystem paths.
    """
    url = (url or "").strip()
    if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", url) or url.startswith(("mailto:", "tel:")):
        return url
    if url.startswith("run:"):
        return url
    normalized = url.replace("\\", "/")
    if normalized.startswith("./"):
        normalized = normalized[2:]
    normalized = normalized.lstrip("/")
    quoted = urllib.parse.quote(normalized, safe="/:._-()")
    if PUBLIC_BASE_URL:
        return f"{PUBLIC_BASE_URL}/{quoted}"
    return "run:" + quoted


def href(url: str, label_latex: str) -> str:
    """Wrap an already-LaTeX-escaped label in a clickable link."""
    if not url:
        return label_latex
    target = _link_target(url)
    return rf"\resumeLinkText{{\detokenize{{{target}}}}}{{{label_latex}}}"


def _tokenize_links(raw: str) -> list[tuple[str, Any]]:
    matches: list[tuple[int, int, str, str]] = list(_find_markdown_links(raw))
    for match in HTML_LINK_RE.finditer(raw):
        matches.append((match.start(), match.end(), match.group("label"), match.group("url")))
    matches.sort(key=lambda item: (item[0], item[1]))

    segments: list[tuple[str, Any]] = []
    position = 0
    for start, end, label, url in matches:
        if start < position:
            continue
        if start > position:
            segments.append(("text", raw[position:start]))
        segments.append(("link", (label, url)))
        position = end
    if position < len(raw):
        segments.append(("text", raw[position:]))
    return segments


def rich_text(value: Any, max_len: int | None = None) -> str:
    """Convert Markdown/HTML links and basic emphasis to LaTeX.

    Supports ``[label](https://example.com)`` and ``<a href=...>label</a>``
    inside every description-like YAML field.
    """
    raw = "" if value is None else str(value)
    raw = raw.replace("\r", " ").replace("\n", " ")
    out: list[str] = []
    used = 0
    truncated = False

    for kind, payload in _tokenize_links(raw):
        if kind == "text":
            visible = plain_text(payload)
            if not visible:
                continue
            if max_len is not None and used + len(visible) > max_len:
                remaining = max(0, max_len - used)
                cut = visible[:remaining]
                punctuation = max(
                    cut.rfind(". "),
                    cut.rfind("; "),
                    cut.rfind(": "),
                )
                boundary = punctuation if punctuation > int(remaining * 0.55) else cut.rfind(" ")
                if boundary > 0:
                    cut = cut[:boundary]
                prefix = " " if payload[:1].isspace() else ""
                out.append(prefix + latex_escape(cut.rstrip(",;:- ")))
                truncated = True
                break
            out.append(_latex_fragment(payload))
            used += len(visible)
        else:
            label, url = payload
            label_visible = plain_text(label)
            if max_len is not None and used + len(label_visible) > max_len:
                truncated = True
                break
            out.append(href(url, _latex_fragment(label)))
            used += len(label_visible)

    if truncated:
        out.append("...")
    return "".join(out)


def sort_by_start_date(items: Iterable[dict[str, Any]], field: str) -> list[dict[str, Any]]:
    def key(item: dict[str, Any]) -> str:
        value = item.get(field, "")
        if isinstance(value, datetime):
            return value.date().isoformat()
        if isinstance(value, date):
            return value.isoformat()
        return str(value)

    return sorted(items, key=key, reverse=True)


def format_date_label(raw: str | date | datetime | None) -> str:
    if not raw:
        return ""
    if isinstance(raw, datetime):
        parsed = raw.date()
    elif isinstance(raw, date):
        parsed = raw
    else:
        try:
            parsed = datetime.strptime(str(raw), "%Y-%m-%d").date()
        except ValueError:
            return str(raw)
    month = parsed.strftime("%b")
    if month != "May" and not month.endswith("."):
        month = f"{month}."
    if parsed.year == date.today().year:
        return f"{month} {parsed.year}"
    return parsed.strftime("%Y")


def wrap_command(command: str) -> str:
    lines = textwrap.wrap(command, width=96, break_long_words=False, break_on_hyphens=False)
    return "\n".join(lines) if lines else command


def join_links(links: Sequence[str]) -> str:
    return r" \textcolor{ResumeTextMuted}{|} ".join(link for link in links if link)


# ---------------------------------------------------------------------------
# Avatar handling
# ---------------------------------------------------------------------------


def prepare_avatar(avatar_ref: str | None) -> tuple[str | None, str]:
    """Return an avatar path relative to ``resume/`` and fallback initials."""
    initials = DEFAULT_AVATAR_INITIALS
    if not avatar_ref:
        return None, initials

    parsed = urllib.parse.urlparse(avatar_ref)
    if parsed.scheme in {"http", "https"}:
        extension = Path(parsed.path).suffix or ".jpg"
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        target = CACHE_DIR / f"resume-avatar{extension}"
        try:
            with urllib.request.urlopen(avatar_ref, timeout=15) as response, target.open("wb") as handle:
                shutil.copyfileobj(response, handle)
            return target.relative_to(RESUME_DIR).as_posix(), initials
        except Exception:
            return None, initials

    candidate = Path(avatar_ref)
    if not candidate.is_absolute():
        candidate = (ROOT / avatar_ref).resolve()
    if candidate.exists():
        relative = os.path.relpath(candidate, RESUME_DIR).replace("\\", "/")
        return relative, initials
    return None, initials


# ---------------------------------------------------------------------------
# Section renderers
# ---------------------------------------------------------------------------


def render_header(config: dict[str, Any], profile: dict[str, Any]) -> str:
    avatar_path, initials = prepare_avatar(config.get("avatar"))
    avatar = (
        rf"\resumeAvatarAuto{{{avatar_path}}}{{{initials}}}"
        if avatar_path
        else rf"\resumeAvatarPlaceholder{{{initials}}}"
    )

    name = latex_escape(config.get("name", ""))
    title = latex_escape(config.get("title") or config.get("position") or "")
    tagline = rich_text(config.get("tagline") or profile.get("about", {}).get("summary", ""))

    affiliation = rich_text(config.get("affiliation", ""))
    affiliation_link = config.get("affiliation_link")
    if affiliation_link and not has_link(config.get("affiliation", "")):
        affiliation = href(affiliation_link, affiliation)

    contact_bits = [
        affiliation,
        rich_text(config.get("location", "")),
        href(f"mailto:{config.get('email', '')}", latex_escape(config.get("email", "")))
        if config.get("email")
        else "",
        href(f"tel:{str(config.get('phone', '')).replace(' ', '')}", latex_escape(config.get("phone", "")))
        if config.get("phone")
        else "",
    ]

    links_data = config.get("contact_links") or []
    if not links_data:
        fallback_map = {
            "Homepage": config.get("homepage_link"),
            "GitHub": config.get("github_link"),
            "Google Scholar": config.get("google_scholar"),
            "CV": config.get("cv_link"),
        }
        links_data = [{"label": label, "url": url} for label, url in fallback_map.items() if url]

    header_links = [
        href(item.get("url", ""), latex_escape(item.get("label", ""))) for item in links_data
    ]
    contact_line = join_links([bit for bit in contact_bits if bit])
    links_line = join_links(header_links)
    return wrap_command(
        rf"\resumeHeader{{{avatar}}}{{{name}}}{{{title}}}{{{tagline}}}{{{contact_line}}}{{{links_line}}}"
    )


def render_about(profile: dict[str, Any]) -> str:
    about = profile.get("about") or {}
    summary_source = about.get("resume_summary") or about.get("lead") or about.get("summary", "")
    focus = list_field(about, "resume_focus", "profile.about") or list_field(
        about, "focus_areas", "profile.about"
    ) or []
    content = [rf"\resumeSummary{{{rich_text(summary_source)}}}"]
    if focus:
        focus_line = r" \textcolor{ResumeTextMuted}{\textbullet} ".join(
            rich_text(item) for item in focus[:5]
        )
        content.append(rf"\resumeFocusLine{{{focus_line}}}")
    return "\n".join(content)


def render_education(entries: list[dict[str, Any]]) -> str:
    blocks: list[str] = []
    for item in sort_by_start_date(entries, "start_date"):
        school_source = str(item.get("school", ""))
        school = rich_text(school_source)
        if item.get("link") and not has_link(school_source):
            school = href(item.get("link", ""), school)
        program = rich_text(item.get("program", ""))
        period = latex_escape(item.get("period", ""))
        summary = rich_text(item.get("resume_summary") or "")
        context = f"education entry {item.get('school', '')!r}"
        highlights = list_field(item, "resume_highlights", context) or list_field(
            item, "highlights", context
        ) or []
        if highlights:
            inline_highlights = r" \textcolor{ResumeTextMuted}{|} ".join(
                rich_text(bullet) for bullet in highlights[:4]
            )
            detail = (
                summary + r" \textcolor{ResumeTextMuted}{|} " + inline_highlights
                if summary
                else inline_highlights
            )
        else:
            detail = summary
        blocks.append(rf"\resumeEntry{{{school}}}{{{program}}}{{{period}}}{{{detail}}}")
        blocks.append(r"\vspace{0.4em}")
    return "\n".join(blocks[:-1] if blocks else blocks)


def _project_rank(item: dict[str, Any]) -> int:
    raw = item.get("resume_rank")
    if isinstance(raw, bool):
        raise ValueError(f"project {item.get('title', '')!r}: resume_rank must be an integer")
    if isinstance(raw, int):
        return raw
    if isinstance(raw, str) and raw.strip().lstrip("-").isdigit():
        return int(raw)
    raise ValueError(
        f"project {item.get('title', '')!r}: resume_rank must be an integer, got {raw!r}"
    )


def select_projects(entries: list[dict[str, Any]], limit: int) -> list[dict[str, Any]]:
    """Return the projects marked for the resume, ordered by ``resume_rank``.

    A project with ``resume_hidden: true`` is always skipped.  If at least one
    entry has ``resume_rank``, only ranked entries are used; otherwise the most
    recent entries are used so older configurations keep working.
    """
    allowed = [item for item in entries if not item.get("resume_hidden")]
    ranked = [item for item in allowed if item.get("resume_rank") is not None]
    if ranked:
        ordered = sorted(
            ranked,
            key=lambda item: (
                _project_rank(item),
                -_date_sort_key(item.get("date")),
            ),
        )
        return ordered[:limit]
    return sort_by_start_date(allowed, "date")[:limit]


def _date_sort_key(raw: Any) -> int:
    value = str(raw or "")
    try:
        return int(datetime.strptime(value, "%Y-%m-%d").timestamp())
    except ValueError:
        return 0


def project_bullets(item: dict[str, Any]) -> list[Any]:
    context = f"project {item.get('title', '')!r}"
    explicit = list_field(item, "resume_bullets", context)
    if explicit:
        return explicit[:3]

    bullets: list[Any] = []
    description = item.get("resume_summary") or item.get("description")
    if description:
        bullets.append(description)
    outcome = item.get("outcome", "")
    if outcome:
        bullets.append(outcome if plain_text(outcome).endswith(".") else f"{outcome}.")
    return bullets[:2]


def render_projects(entries: list[dict[str, Any]], limit: int) -> str:
    blocks: list[str] = []
    for item in select_projects(entries, limit):
        title_source = str(item.get("resume_title") or item.get("title", ""))
        title = rich_text(title_source)
        if item.get("link") and not has_link(title_source):
            title = href(item.get("link", ""), title)

        subtitle_parts = [rich_text(item.get("attribute", ""))]
        tech = rich_text(item.get("resume_tech") or item.get("tech_stack", ""))
        if tech:
            subtitle_parts.append(tech)
        subtitle = r" \textcolor{ResumeTextMuted}{|} ".join(part for part in subtitle_parts if part)
        period = format_date_label(item.get("date"))

        blocks.append(rf"\resumeEntry{{{title}}}{{{subtitle}}}{{{latex_escape(period)}}}{{}}")
        blocks.append(r"\resumeBulletsStart")
        for bullet in project_bullets(item):
            blocks.append(rf"\resumeBullet{{{rich_text(bullet)}}}")
        blocks.append(r"\resumeBulletsEnd")
        blocks.append(r"\vspace{0.18em}")
    return "\n".join(blocks[:-1] if blocks else blocks)


def render_awards(entries: list[dict[str, Any]], limit: int) -> str:
    blocks: list[str] = []
    visible = [item for item in entries if not item.get("resume_hidden")]
    for item in sort_by_start_date(visible, "date")[:limit]:
        award = rich_text(item.get("resume_award_description") or item.get("award_description", ""))
        contest_source = str(item.get("resume_title") or item.get("title", ""))
        contest = rich_text(contest_source)
        if item.get("link") and not has_link(contest_source):
            contest = href(item.get("link", ""), contest)
        detail = rich_text(item.get("resume_reason") or item.get("reason", ""), max_len=110)
        year = format_date_label(item.get("date"))
        sentence = rf"\textbf{{{award}}}, {contest}"
        blocks.append(rf"\resumeAwardItem{{{sentence}}}{{{latex_escape(year)}}}{{{detail}}}")
        blocks.append(r"\vspace{0.26em}")
    return "\n".join(blocks[:-1] if blocks else blocks)


def render_publications(entries: list[dict[str, Any]], limit: int) -> str:
    lines = [r"\resumeCompactListStart"]
    for item in entries[:limit]:
        title_source = str(item.get("title", ""))
        title = rich_text(title_source)
        if not has_link(title_source):
            title = href(item.get("pdf", "") or item.get("page", ""), title)
        conference = rich_text(item.get("conference", ""))
        notes = rich_text(item.get("notes", ""))
        bits = [rf"\textbf{{{title}}}", conference]
        if notes:
            bits.append(rf"\textcolor{{ResumeTextMuted}}{{{notes}}}")
        lines.append(rf"\resumeCompactItem{{{' '.join(bit for bit in bits if bit)}}}")
    lines.append(r"\resumeCompactListEnd")
    return "\n".join(lines)


def render_skills(profile: dict[str, Any]) -> str:
    skill_groups = profile.get("skills") or []
    lines = [r"\resumeCompactListStart"]
    for group in skill_groups:
        title = rich_text(group.get("title", ""))
        group_items = list_field(group, "items", f"skills group {group.get('title', '')!r}") or []
        items = ", ".join(rich_text(item) for item in group_items)
        lines.append(rf"\resumeCompactItem{{\textbf{{{title}}}: {items}}}")
    lines.append(r"\resumeCompactListEnd")
    return "\n".join(lines)


def render_section(title: str, body: str) -> str:
    return wrap_command(
        rf"\resumeSectionBlock{{\resumeSectionTitle{{{latex_escape(title)}}}}}{{{body}}}"
    )


# ---------------------------------------------------------------------------
# Document assembly
# ---------------------------------------------------------------------------


def build_body(config: dict[str, Any]) -> str:
    profile = load_yaml(DATA_DIR / "profile.yml")
    education = load_yaml(DATA_DIR / "education.yml").get("main") or []
    projects = load_yaml(DATA_DIR / "project.yml").get("main") or []
    awards = load_yaml(DATA_DIR / "awards.yml").get("main") or []
    publications = load_yaml(DATA_DIR / "publications.yml").get("main") or []

    visibility = config.get("section_visibility") or {}
    preview = config.get("list_preview_count") or {}
    theme = config.get("theme") or {}

    author = latex_escape(config.get("name", ""))
    subtitle = latex_escape(config.get("title") or "Resume")

    parts = [
        rf"\resumeSetAccent{{{theme.get('accent_color', '245C73')}}}"
        rf"{{{theme.get('accent_soft_color', 'EDF5F4')}}}",
        rf"\hypersetup{{pdftitle={{{author} - Resume}},pdfauthor={{{author}}},pdfsubject={{{subtitle}}}}}",
        render_header(config, profile),
    ]

    if visibility.get("about", True):
        parts.append(render_section("Profile", render_about(profile)))
    if visibility.get("education", True) and education:
        parts.append(render_section("Education", render_education(education)))
    if visibility.get("projects", True) and projects:
        parts.append(
            render_section(
                "Selected Projects",
                render_projects(projects, int(preview.get("projects", 5))),
            )
        )
    if visibility.get("awards", True) and awards:
        parts.append(
            render_section("Awards", render_awards(awards, int(preview.get("awards", 3))))
        )
    if visibility.get("publications", False) and publications:
        parts.append(
            render_section(
                "Publications",
                render_publications(publications, int(preview.get("publications", 3))),
            )
        )
    if visibility.get("skills", True):
        parts.append(render_section("Skills", render_skills(profile)))

    return "\n\n".join(parts) + "\n"


def build_document(config: dict[str, Any] | None = None) -> str:
    config = config or load_site_config()
    global PUBLIC_BASE_URL
    PUBLIC_BASE_URL = str(config.get("canonical") or "").rstrip("/")
    body = build_body(config).rstrip()
    return (
        "% This file is auto-generated by resume/scripts/build_resume_data.py.\n"
        "% Do not edit main.tex directly; update _config.yml and _data/*.yml instead.\n"
        "\\documentclass[a4paper,10pt]{article}\n"
        "\\usepackage{myresume}\n\n"
        "\\begin{document}\n"
        f"{body}\n"
        "\\end{document}\n"
    )


def main() -> None:
    config = load_site_config()
    MAIN_TEX.parent.mkdir(parents=True, exist_ok=True)
    MAIN_TEX.write_text(build_document(config), encoding="utf-8")
    print(f"Wrote {MAIN_TEX.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
