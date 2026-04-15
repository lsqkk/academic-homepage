<section class="homepage-block" id="skills">
  <div class="section-heading">
    <span class="section-kicker">Capabilities</span>
    <h2>Technical Skills</h2>
    <p>Core tools and strengths across software, machine learning, and embedded practice.</p>
  </div>

  <div class="skills-grid">
    {% for group in site.data.profile.skills %}
    <article class="skill-card">
      <h3>{{ group.title }}</h3>
      <ul class="skill-list">
        {% for item in group.items %}
        <li>{{ item }}</li>
        {% endfor %}
      </ul>
    </article>
    {% endfor %}
  </div>
</section>
