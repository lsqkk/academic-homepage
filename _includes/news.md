<section class="homepage-block" id="news">
  <div class="section-heading">
    <span class="section-kicker">Updates</span>
    <h2>News</h2>
  </div>

  {% assign sorted_news = site.data.news.main | sort: "date" | reverse %}
  {% assign visible_count = site.list_preview_count.news | default: 5 %}
  <div class="news-stream" id="news-list" data-collapsible="news">
    {% for item in sorted_news %}
    <article class="news-item {% if forloop.index > visible_count %}is-collapsed{% endif %}">
      <time class="news-date" datetime="{{ item.date | date: '%Y-%m-%d' }}">{{ item.date | date: "%b. %Y" }}</time>
      <div class="news-rail" aria-hidden="true">
        <span class="news-dot"></span>
      </div>
      <div class="news-body">
        <h3>{% include rich-text.html text=item.title %}</h3>
        {% if item.description %}
        <p>{% include rich-text.html text=item.description %}</p>
        {% endif %}
      </div>
    </article>
    {% endfor %}
  </div>

  {% if sorted_news.size > visible_count %}
  <button
    type="button"
    class="timeline-toggle"
    data-toggle-target="news"
    aria-controls="news-list"
    data-expand-label="Show all news"
    data-collapse-label="Show fewer news items"
    aria-expanded="false">
    Show all news
  </button>
  {% endif %}
</section>
