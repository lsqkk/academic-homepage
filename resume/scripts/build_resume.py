"""Build the resume locally: YAML -> LaTeX -> PDF -> published asset.

Usage:
    python resume/scripts/build_resume.py
    python resume/scripts/build_resume.py --no-publish
    python resume/scripts/build_resume.py --no-compile

Requires Python 3.9+, PyYAML, and a XeLaTeX installation (MiKTeX or TeX Live).
The generated PDF replaces ``assets/files/Zhu_Enze_s_Resume_en_.pdf`` unless
``--no-publish`` is passed.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
RESUME_DIR = SCRIPT_DIR.parent
REPO_ROOT = RESUME_DIR.parent
BUILD_DIR = RESUME_DIR / ".output"
BUILT_PDF = BUILD_DIR / "main.pdf"
PUBLISHED_PDF = REPO_ROOT / "assets" / "files" / "Zhu_Enze_s_Resume_en_.pdf"

sys.path.insert(0, str(SCRIPT_DIR))
import build_resume_data  # noqa: E402


def find_command(*names: str) -> str | None:
    for name in names:
        found = shutil.which(name)
        if found:
            return found
    return None


def compile_pdf() -> None:
    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    latexmk = find_command("latexmk")
    if latexmk:
        command = [
            latexmk,
            "-xelatex",
            "-interaction=nonstopmode",
            "-halt-on-error",
            "-file-line-error",
            f"-output-directory={BUILD_DIR.name}",
            "main.tex",
        ]
        passes = 1
    else:
        xelatex = find_command("xelatex")
        if not xelatex:
            raise SystemExit(
                "XeLaTeX was not found. Install MiKTeX or TeX Live and make sure "
                "latexmk/xelatex is on PATH."
            )
        command = [
            xelatex,
            "-interaction=nonstopmode",
            "-halt-on-error",
            "-file-line-error",
            f"-output-directory={BUILD_DIR.name}",
            "main.tex",
        ]
        # Two passes settle hyperref bookmarks even without latexmk.
        passes = 2

    print("Compiling:", " ".join(command))
    for _ in range(passes):
        result = subprocess.run(command, cwd=RESUME_DIR)
        if result.returncode != 0:
            raise SystemExit(f"LaTeX compilation failed (exit code {result.returncode}).")
    if not BUILT_PDF.exists():
        raise SystemExit(f"Expected output was not produced: {BUILT_PDF}")


def publish_pdf() -> None:
    PUBLISHED_PDF.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(BUILT_PDF, PUBLISHED_PDF)
    print(f"Published {PUBLISHED_PDF.relative_to(REPO_ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the resume from the homepage data.")
    parser.add_argument("--no-compile", action="store_true", help="only regenerate main.tex")
    parser.add_argument("--no-publish", action="store_true", help="do not copy the PDF into assets/files")
    args = parser.parse_args()

    build_resume_data.main()
    if args.no_compile:
        return

    compile_pdf()
    if not args.no_publish:
        publish_pdf()


if __name__ == "__main__":
    main()
