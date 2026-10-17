<section class="homepage-block" id="awards">
  <div class="section-heading">
    <span class="section-kicker">Recognition</span>
    <h2>Competitions &amp; Awards</h2>
    <p>Selected competition results, scholarships, and distinctions.</p>
  </div>

  <div class="award-list" id="awards-list" data-collapsible="awards">
    {% assign sorted_awards = site.data.awards.main | sort: "date" | reverse %}
    {% assign visible_count = site.list_preview_count.awards | default: 3 %}
    {% for link in sorted_awards %}
    <article class="award-item {% if forloop.index > visible_count %}is-collapsed{% endif %}">
      <div class="award-media">
        {% if link.image %}
        <img src="{{ link.image }}" alt="{{ link.title }} certificate" class="award-thumb" loading="lazy">
        {% else %}
        <div class="award-thumb award-thumb-placeholder" aria-hidden="true">
          <span>{{ link.date | date: "%Y" }}</span>
        </div>
        {% endif %}
      </div>

      <div class="award-body">
        <time class="award-date" datetime="{{ link.date | date: '%Y-%m-%d' }}">{{ link.date | date: "%b. %Y" }}</time>
        <h3>{{ link.title }}</h3>
        {% if link.award_description %}
        <p class="award-highlight">{{ link.award_description }}</p>
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
    aria-controls="awards-list"
    data-expand-label="Show all awards"
    data-collapse-label="Show fewer awards"
    aria-expanded="false">
    Show all awards
  </button>
  {% endif %}
</section>
