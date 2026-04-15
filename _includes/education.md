<section class="homepage-block" id="education">
  <div class="section-heading">
    <span class="section-kicker">Academic Path</span>
    <h2>Education</h2>
    <p>Each card highlights one stage of training, from foundational preparation to formal degree study.</p>
  </div>

  <div class="education-grid">
    {% assign education_items = site.data.education.main | sort: "start_date" | reverse %}
    {% for item in education_items %}
    <article class="education-card">
      {% if item.link %}
      <a class="education-card-link" href="{{ item.link }}" target="_blank" rel="noopener" aria-label="Open {{ item.school }} details"></a>
      {% endif %}
      <div class="education-card-top">
        <div>
          <h3>{{ item.school }}</h3>
          <p class="education-degree">{{ item.program }}</p>
        </div>
        <span class="education-period">{{ item.period }}</span>
      </div>

      {% if item.focus %}
      <p class="education-focus">{{ item.focus }}</p>
      {% endif %}

      {% if item.summary %}
      <p class="education-summary">{{ item.summary }}</p>
      {% endif %}

      {% if item.highlights %}
      <div class="education-tags">
        {% for tag in item.highlights %}
        <span>{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}
    </article>
    {% endfor %}
  </div>
</section>
