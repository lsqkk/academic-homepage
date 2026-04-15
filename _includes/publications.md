<section class="homepage-block" id="publications">
  <div class="section-heading">
    <span class="section-kicker">Research Output</span>
    <h2>Publications</h2>
    <p>Preprints, conference papers, and related materials can be presented here in a cleaner card layout.</p>
  </div>

  {% assign publications = site.data.publications.main %}
  {% if publications and publications.size > 0 %}
  <div class="publication-list">
    {% for link in publications %}
    <article class="publication-card">
      <div class="publication-media">
        {% if link.image %}
        <img src="{{ link.image }}" alt="{{ link.title }} teaser" class="publication-thumb">
        {% else %}
        <div class="publication-thumb publication-thumb-placeholder">{{ link.conference_short | default: "Paper" }}</div>
        {% endif %}
        {% if link.conference_short %}
        <span class="publication-badge">{{ link.conference_short }}</span>
        {% endif %}
      </div>

      <div class="publication-body">
        <h3>{% if link.pdf %}<a href="{{ link.pdf }}" target="_blank" rel="noopener">{{ link.title }}</a>{% else %}{{ link.title }}{% endif %}</h3>
        <p class="publication-authors">{{ link.authors }}</p>
        <p class="publication-venue">{{ link.conference }}</p>
        <div class="publication-actions">
          {% if link.pdf %}
          <a href="{{ link.pdf }}" class="timeline-link" target="_blank" rel="noopener">PDF</a>
          {% endif %}
          {% if link.code %}
          <a href="{{ link.code }}" class="timeline-link" target="_blank" rel="noopener">Code</a>
          {% endif %}
          {% if link.page %}
          <a href="{{ link.page }}" class="timeline-link" target="_blank" rel="noopener">Project Page</a>
          {% endif %}
          {% if link.bibtex %}
          <a href="{{ link.bibtex }}" class="timeline-link" target="_blank" rel="noopener">BibTex</a>
          {% endif %}
        </div>
        {% if link.notes %}
        <p class="publication-note">{{ link.notes }}</p>
        {% endif %}
        {% if link.others %}
        <p class="publication-extra">{{ link.others }}</p>
        {% endif %}
      </div>
    </article>
    {% endfor %}
  </div>
  {% else %}
  <div class="empty-state-card">
    <p>Publications can be added later without changing page structure. This section is ready when you are.</p>
  </div>
  {% endif %}
</section>
