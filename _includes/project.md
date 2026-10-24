<section class="homepage-block" id="projects">
  <div class="section-heading section-heading--tabbed">
    <span class="section-kicker">Selected Work</span>
    <h2>Project Experience</h2>
  </div>

  {% assign sorted_projects = site.data.project.main | sort: "date" | reverse %}
  <div class="tab-shell" data-tab-group="projects">
    <div class="tab-bar" role="tablist" aria-label="Project categories">
      {% for category in site.data.project.categories %}
      {% assign category_projects = sorted_projects | where: "category", category.key %}
      <button
        type="button"
        class="tab-button{% if forloop.first %} is-active{% endif %}"
        id="projects-tab-{{ category.key }}"
        role="tab"
        aria-selected="{% if forloop.first %}true{% else %}false{% endif %}"
        aria-controls="projects-panel-{{ category.key }}"
        tabindex="{% if forloop.first %}0{% else %}-1{% endif %}">
        <span>{{ category.label }}</span>
        <span class="tab-count" aria-hidden="true">{{ category_projects.size }}</span>
      </button>
      {% endfor %}
    </div>

    {% for category in site.data.project.categories %}
    {% assign category_projects = sorted_projects | where: "category", category.key %}
    <div
      class="tab-panel{% if forloop.first %} is-active{% endif %}"
      id="projects-panel-{{ category.key }}"
      role="tabpanel"
      tabindex="0"
      aria-labelledby="projects-tab-{{ category.key }}">
      <h3 class="tab-panel-label">{{ category.label }}</h3>
      <div class="project-list">
        {% for link in category_projects %}
        <article class="project-item {% unless link.image %}project-item--text{% endunless %}">
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
    </div>
    {% endfor %}
  </div>
</section>
