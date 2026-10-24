"""Unit tests for the resume data generator.

Run with:
    python -m unittest discover -s resume/scripts -p "test_*.py"
"""

from __future__ import annotations

import sys
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import build_resume_data as resume  # noqa: E402


class RichTextTests(unittest.TestCase):
    def test_markdown_links_become_href(self) -> None:
        result = resume.rich_text(
            "Uses [PaddlePaddle](https://www.paddlepaddle.org.cn/) and "
            "[PyTorch](https://pytorch.org/)."
        )
        self.assertIn(r"\resumeLinkText{\detokenize{https://www.paddlepaddle.org.cn/}}{PaddlePaddle}", result)
        self.assertIn(r"\resumeLinkText{\detokenize{https://pytorch.org/}}{PyTorch}", result)

    def test_html_links_and_emphasis(self) -> None:
        result = resume.rich_text('<a href="https://example.com">Example</a> uses <strong>bold</strong>.')
        self.assertIn(r"\resumeLinkText{\detokenize{https://example.com}}{Example}", result)
        self.assertIn(r"\textbf{bold}", result)

    def test_special_characters_are_escaped(self) -> None:
        result = resume.rich_text("100% safe & sound.")
        self.assertEqual(result, r"100\% safe \& sound.")

    def test_truncation_keeps_space_after_link(self) -> None:
        result = resume.rich_text(
            "[long label here](https://example.com/path) plus trailing words that should be cut.",
            max_len=40,
        )
        self.assertIn(" plus ", result)
        self.assertTrue(result.endswith("..."))

    def test_short_text_is_not_truncated(self) -> None:
        result = resume.rich_text("Short [link](https://example.com) text.", max_len=60)
        self.assertNotIn("...", result)

    def test_url_with_parentheses_is_parsed(self) -> None:
        result = resume.rich_text(
            "[Foo](https://en.wikipedia.org/wiki/Foo_(bar)) and more text."
        )
        self.assertIn(
            r"\resumeLinkText{\detokenize{https://en.wikipedia.org/wiki/Foo_(bar)}}{Foo}",
            result,
        )
        self.assertTrue(result.endswith("and more text."))


class LinkTargetTests(unittest.TestCase):
    def setUp(self) -> None:
        self._previous_base = resume.PUBLIC_BASE_URL

    def tearDown(self) -> None:
        resume.PUBLIC_BASE_URL = self._previous_base

    def test_relative_asset_uses_public_url(self) -> None:
        resume.PUBLIC_BASE_URL = "https://example.com"
        result = resume.href("./assets/files/report.pdf", "Report")
        self.assertIn(
            r"\detokenize{https://example.com/assets/files/report.pdf}",
            result,
        )

    def test_relative_asset_without_base_does_not_leak_local_path(self) -> None:
        resume.PUBLIC_BASE_URL = ""
        result = resume.href("./assets/files/report.pdf", "Report")
        self.assertIn(r"\detokenize{run:assets/files/report.pdf}", result)
        self.assertNotIn(str(resume.ROOT), result)


class ProjectSelectionTests(unittest.TestCase):
    def test_ranked_projects_are_selected_and_ordered(self) -> None:
        projects = [
            {"title": "recent", "date": date(2026, 10, 1)},
            {"title": "second", "date": date(2025, 1, 1), "resume_rank": 2},
            {"title": "first", "date": date(2024, 1, 1), "resume_rank": 1},
        ]
        selected = resume.select_projects(projects, limit=5)
        self.assertEqual([item["title"] for item in selected], ["first", "second"])

    def test_hidden_project_is_excluded(self) -> None:
        projects = [
            {"title": "keep", "date": date(2026, 1, 1), "resume_rank": 1},
            {"title": "hide", "date": date(2026, 2, 1), "resume_rank": 2, "resume_hidden": True},
        ]
        selected = resume.select_projects(projects, limit=5)
        self.assertEqual([item["title"] for item in selected], ["keep"])

    def test_falls_back_to_recent_projects_without_ranks(self) -> None:
        projects = [
            {"title": "older", "date": date(2025, 1, 1)},
            {"title": "newer", "date": date(2026, 1, 1)},
        ]
        selected = resume.select_projects(projects, limit=1)
        self.assertEqual([item["title"] for item in selected], ["newer"])

    def test_invalid_rank_raises_error(self) -> None:
        projects = [{"title": "bad", "date": date(2026, 1, 1), "resume_rank": "high"}]
        with self.assertRaisesRegex(ValueError, "resume_rank"):
            resume.select_projects(projects, limit=5)

    def test_string_bullets_raise_error(self) -> None:
        with self.assertRaisesRegex(ValueError, "resume_bullets"):
            resume.project_bullets({"title": "bad", "resume_bullets": "one bullet"})


class AwardSelectionTests(unittest.TestCase):
    def test_hidden_award_is_excluded(self) -> None:
        awards = [
            {"title": "hidden", "date": date(2026, 5, 1), "resume_hidden": True},
            {"title": "visible", "date": date(2025, 5, 1)},
        ]

        rendered = resume.render_awards(awards, limit=1)

        self.assertIn("visible", rendered)
        self.assertNotIn("hidden", rendered)

    def test_recent_awards_fill_the_limit(self) -> None:
        awards = [
            {"title": "older", "date": date(2025, 1, 1)},
            {"title": "newer", "date": date(2026, 1, 1)},
        ]

        rendered = resume.render_awards(awards, limit=1)

        self.assertIn("newer", rendered)
        self.assertNotIn("older", rendered)


class DateFormattingTests(unittest.TestCase):
    def test_may_does_not_get_a_double_period(self) -> None:
        year = date.today().year
        self.assertEqual(resume.format_date_label(date(year, 5, 1)), f"May {year}")

    def test_abbreviated_month_gets_a_period(self) -> None:
        year = date.today().year
        self.assertEqual(resume.format_date_label(date(year, 10, 1)), f"Oct. {year}")

    def test_previous_years_show_only_the_year(self) -> None:
        self.assertEqual(resume.format_date_label(date(2024, 10, 1)), "2024")


if __name__ == "__main__":
    unittest.main()
