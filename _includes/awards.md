<section class="homepage-block" id="awards">
  <div class="section-heading section-heading--tabbed">
    <span class="section-kicker">Recognition</span>
    <h2>Competitions &amp; Awards</h2>
  </div>

  {% assign sorted_awards = site.data.awards.main | sort: "date" | reverse %}
  <div class="tab-shell" data-tab-group="awards">
    <div class="tab-bar" role="tablist" aria-label="Award categories">
      {% for category in site.data.awards.categories %}
      {% assign category_awards = sorted_awards | where: "category", category.key %}
      <button
        type="button"
        class="tab-button{% if forloop.first %} is-active{% endif %}"
        id="awards-tab-{{ category.key }}"
        role="tab"
        aria-selected="{% if forloop.first %}true{% else %}false{% endif %}"
        aria-controls="awards-panel-{{ category.key }}"
        tabindex="{% if forloop.first %}0{% else %}-1{% endif %}">
        <span>{{ category.label }}</span>
        <span class="tab-count" aria-hidden="true">{{ category_awards.size }}</span>
      </button>
      {% endfor %}
    </div>

    {% for category in site.data.awards.categories %}
    {% assign category_awards = sorted_awards | where: "category", category.key %}
    <div
      class="tab-panel{% if forloop.first %} is-active{% endif %}"
      id="awards-panel-{{ category.key }}"
      role="tabpanel"
      tabindex="0"
      aria-labelledby="awards-tab-{{ category.key }}">
      <h3 class="tab-panel-label">{{ category.label }}</h3>
      <div class="award-list">
        {% for link in category_awards %}
        <article class="award-item">
          <div class="award-media">
            {% if link.image %}
            <img src="{{ link.image }}" alt="{{ link.title }} certificate" class="award-thumb" loading="lazy">
            {% else %}
            <div class="award-thumb award-thumb-placeholder" aria-hidden="true">
              <i class="fas fa-award"></i>
              <span>{{ link.date | date: "%Y" }}</span>
            </div>
            {% endif %}
          </div>

          <div class="award-body">
            <time class="award-date" datetime="{{ link.date | date: '%Y-%m-%d' }}">{{ link.date | date: "%b. %Y" }}</time>
            <h3>
              {%- if link.link and link.title contains '](' -%}
                {% include rich-text.html text=link.title %}
              {%- elsif link.link -%}
                <a href="{{ link.link }}" target="_blank" rel="noopener">{% include rich-text.html text=link.title %}</a>
              {%- else -%}
                {% include rich-text.html text=link.title %}
              {%- endif -%}
            </h3>
            {% if link.award_description %}
            <p class="award-highlight">{% include rich-text.html text=link.award_description %}</p>
            {% endif %}
            {% if link.reason %}
            <p>{% include rich-text.html text=link.reason %}</p>
            {% endif %}
          </div>
        </article>
        {% endfor %}
      </div>
    </div>
    {% endfor %}
  </div>
</section>
