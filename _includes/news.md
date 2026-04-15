<section class="homepage-block" id="news">
  <div class="section-heading">
    <span class="section-kicker">Updates</span>
    <h2>News</h2>
    <p>A compact milestone stream with recent academic, project, and competition updates.</p>
  </div>

  {% assign sorted_news = site.data.news.main | sort: "date" | reverse %}
  <div class="timeline timeline-news">
    {% for item in sorted_news %}
    <article class="news-item">
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
</section>
