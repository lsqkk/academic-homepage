<section class="homepage-block" id="services">
  <div class="section-heading">
    <span class="section-kicker">Academic Service</span>
    <h2>Services</h2>
    <p>Review work, mentoring, and community contributions can be listed here when needed.</p>
  </div>

  {% assign service_groups = site.data.services.main %}
  {% if service_groups and service_groups.size > 0 %}
  <div class="service-groups">
    {% for group in service_groups %}
    <article class="service-card">
      <h3>{{ group.category }}</h3>
      <ul class="service-list">
        {% for item in group.items %}
        <li>
          {% if item.link %}
          <a href="{{ item.link }}" target="_blank" rel="noopener">{{ item.name }}</a>
          {% else %}
          <span>{{ item.name }}</span>
          {% endif %}
          {% if item.note %}
          <span class="service-note">{{ item.note }}</span>
          {% endif %}
        </li>
        {% endfor %}
      </ul>
    </article>
    {% endfor %}
  </div>
  {% else %}
  <div class="empty-state-card">
    <p>Academic service entries will appear here as review, mentoring, or organizing experience grows.</p>
  </div>
  {% endif %}
</section>
