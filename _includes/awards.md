<section class="homepage-block" id="awards">
  <div class="section-heading">
    <span class="section-kicker">Recognition</span>
    <h2>Competitions & Awards</h2>
    <p>Selected competition results, scholarships, and distinctions.</p>
  </div>

  <div class="feature-list">
    {% assign sorted_awards = site.data.awards.main | sort: "date" | reverse %}
    {% for link in sorted_awards %}
    <article class="feature-card">
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
</section>
