<section class="homepage-block" id="projects">
  <div class="section-heading">
    <span class="section-kicker">Selected Work</span>
    <h2>Project Experience</h2>
    <p>Research, engineering, and independent builds, in reverse chronological order.</p>
  </div>

  {% assign sorted_projects = site.data.project.main | sort: "date" | reverse %}
  {% assign visible_count = site.list_preview_count.projects | default: 5 %}

  <div class="project-list" id="projects-list" data-collapsible="projects">
    {% for link in sorted_projects %}
    <article class="project-item {% unless link.image %}project-item--text{% endunless %} {% if forloop.index > visible_count %}is-collapsed{% endif %}">
      {% if link.image %}
      <div class="project-media">
        <img src="{{ link.image }}" alt="{{ link.title }} preview" class="project-thumb" loading="lazy">
      </div>
      {% endif %}

      <div class="project-body">
        <div class="project-meta-line">
          <time class="project-date" datetime="{{ link.date | date: '%Y-%m-%d' }}">{{ link.date | date: "%b. %Y" }}</time>
          {% if link.attribute %}
          <span class="project-attribute">{{ link.attribute }}</span>
          {% endif %}
        </div>

        <h3>{% include rich-text.html text=link.title %}</h3>
        <p>{% include rich-text.html text=link.description %}</p>

        {% if link.tech_stack %}
        <p class="project-detail"><span class="detail-label">Tech Stack</span>{% include rich-text.html text=link.tech_stack %}</p>
        {% endif %}
        {% if link.outcome %}
        <p class="project-detail"><span class="detail-label">Outcome</span>{% include rich-text.html text=link.outcome %}</p>
        {% endif %}

        {% if link.link %}
        <p class="project-actions">
          <a href="{{ link.link }}" class="text-link" target="_blank" rel="noopener">View project <span aria-hidden="true">&rarr;</span></a>
        </p>
        {% endif %}
      </div>
    </article>
    {% endfor %}
  </div>

  {% if sorted_projects.size > visible_count %}
  <button
    type="button"
    class="timeline-toggle"
    data-toggle-target="projects"
    aria-controls="projects-list"
    data-expand-label="Show all projects"
    data-collapse-label="Show fewer projects"
    aria-expanded="false">
    Show all projects
  </button>
  {% endif %}
</section>
