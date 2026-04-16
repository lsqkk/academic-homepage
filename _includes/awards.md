<section class="homepage-block" id="awards">
  <div class="section-heading">
    <span class="section-kicker">Recognition</span>
    <h2>Competitions & Awards</h2>
    <p>Selected competition results, scholarships, and distinctions.</p>
  </div>

  <div class="feature-list" data-collapsible="awards">
    {% assign sorted_awards = site.data.awards.main | sort: "date" | reverse %}
    {% assign visible_count = site.list_preview_count.awards | default: 3 %}
    {% for link in sorted_awards %}
    <article class="feature-card {% if forloop.index > visible_count %}is-collapsed{% endif %}">
      <div class="feature-media">
        {% if link.image %}
        <img src="{{ link.image }}" alt="{{ link.title }} image" class="feature-thumb">
        {% else %}
        <div class="feature-thumb feature-thumb-placeholder">{{ link.date | date: "%Y" }}</div>
        {% endif %}
      </div>

      <div class="feature-body">
        <div class="feature-date">{{ link.date | date: "%b. %Y" }}</div>
        <h3>{{ link.title }}</h3>
        {% if link.award_description %}
        <p class="feature-highlight">{{ link.award_description }}</p>
        {% endif %}
        {% if link.reason %}
        <p>{{ link.reason }}</p>
        {% endif %}
      </div>
    </article>
    {% endfor %}
  </div>

  {% if sorted_awards.size > visible_count %}
  <button
    type="button"
    class="timeline-toggle"
    data-toggle-target="awards"
    data-expand-label="Show all awards"
    data-collapse-label="Show fewer awards"
    aria-expanded="false">
    Show all awards
  </button>
  {% endif %}
</section>
