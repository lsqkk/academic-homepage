<section class="homepage-block" id="news">
  <div class="section-heading">
    <span class="section-kicker">Updates</span>
    <h2>News</h2>
    <p>A compact milestone stream with recent academic, project, and competition updates.</p>
  </div>

  {% assign sorted_news = site.data.news.main | sort: "date" | reverse %}
  {% assign visible_count = site.list_preview_count.news | default: 5 %}
  <div class="timeline timeline-news" data-collapsible="news">
    {% for item in sorted_news %}
    <article class="news-item {% if forloop.index > visible_count %}is-collapsed{% endif %}">
      <div class="news-date">{{ item.date | date: "%b. %Y" }}</div>
      <div class="news-body">
        <span class="news-dot"></span>
        <div class="news-card">
          <h3>{{ item.title }}</h3>
          {% if item.description %}
          <p>{{ item.description }}</p>
          {% endif %}
        </div>
      </div>
    </article>
    {% endfor %}
  </div>

  {% if sorted_news.size > visible_count %}
  <button
    type="button"
    class="timeline-toggle"
    data-toggle-target="news"
    data-expand-label="Show all news"
    data-collapse-label="Show fewer news items"
    aria-expanded="false">
    Show all news
  </button>
  {% endif %}
</section>
