<section class="homepage-block" id="skills">
  <div class="section-heading">
    <span class="section-kicker">Capabilities</span>
    <h2>Technical Skills</h2>
  </div>

  <div class="skills-grid">
    {% for group in site.data.profile.skills %}
    <article class="skill-card">
      <h3>{{ group.title }}</h3>
      <ul class="skill-list">
        {% for item in group.items %}
        <li>{% include rich-text.html text=item %}</li>
        {% endfor %}
      </ul>
    </article>
    {% endfor %}
  </div>
</section>
