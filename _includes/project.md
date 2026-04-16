<section class="homepage-block" id="projects">
  <div class="section-heading">
    <span class="section-kicker">Selected Work</span>
    <h2>Project Experience</h2>
    <p>A reverse-chronological timeline of research, engineering, and independent builds.</p>
  </div>

  {% assign sorted_projects = site.data.project.main | sort: "date" | reverse %}
  {% assign visible_count = site.list_preview_count.projects | default: 5 %}

  <div class="timeline timeline-projects" data-collapsible="projects">
    {% for link in sorted_projects %}
    <article class="timeline-item timeline-project {% if forloop.index > visible_count %}is-collapsed{% endif %}">
      <div class="timeline-marker">
        <span class="timeline-dot"></span>
        <span class="timeline-line"></span>
      </div>

      <div class="timeline-content">
        <div class="timeline-date">{{ link.date | date: "%b. %Y" }}</div>
        <div class="timeline-card">
          <div class="timeline-card-media">
            {% if link.image %}
            <img src="{{ link.image }}" alt="{{ link.title }} preview" class="timeline-thumb">
            {% else %}
            <div class="timeline-thumb timeline-thumb-placeholder">{{ link.date | date: "%Y" }}</div>
            {% endif %}
          </div>

          <div class="timeline-card-body">
            <h3>{{ link.title }}</h3>
            {% if link.attribute %}
            <p class="timeline-meta">{{ link.attribute }}</p>
            {% endif %}
            <p>{{ link.description }}</p>
            {% if link.tech_stack %}
            <p class="timeline-detail"><strong>Tech Stack:</strong> {{ link.tech_stack }}</p>
            {% endif %}
            {% if link.outcome %}
            <p class="timeline-detail"><strong>Outcome:</strong> {{ link.outcome }}</p>
            {% endif %}
            {% if link.link %}
            <div class="timeline-actions">
              <a href="{{ link.link }}" class="timeline-link" target="_blank" rel="noopener">View Project</a>
            </div>
            {% endif %}
          </div>
        </div>
      </div>
    </article>
    {% endfor %}
  </div>

  {% if sorted_projects.size > visible_count %}
  <button
    type="button"
    class="timeline-toggle"
    data-toggle-target="projects"
    data-expand-label="Show all projects"
    data-collapse-label="Show fewer projects"
    aria-expanded="false">
    Show all projects
  </button>
  {% endif %}
</section>
