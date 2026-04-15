---
layout: homepage
---
{% if site.section_visibility.about != false %}
{% include about.md %}
{% endif %}

{% if site.section_visibility.education != false %}
{% include education.md %}
{% endif %}

{% if site.section_visibility.projects != false %}
{% include project.md %}
{% endif %}

{% if site.section_visibility.awards != false %}
{% include awards.md %}
{% endif %}

{% if site.section_visibility.publications %}
{% include publications.md %}
{% endif %}

{% if site.section_visibility.services %}
{% include services.md %}
{% endif %}

{% if site.section_visibility.skills != false %}
{% include skills.md %}
{% endif %}

{% if site.section_visibility.news != false %}
{% include news.md %}
{% endif %}

{% if site.section_visibility.repo_board != false %}
{% include repo-board.md %}
{% endif %}
