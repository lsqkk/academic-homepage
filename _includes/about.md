<section class="homepage-block" id="about">
  <div class="section-heading">
    <span class="section-kicker">Profile</span>
    <h2>About Me</h2>
  </div>

  <div class="about-panel">
    <p class="about-lead">{{ site.data.profile.about.lead }}</p>
    <p class="about-summary">{{ site.data.profile.about.summary }}</p>

    {% if site.data.profile.about.focus_areas %}
    <div class="education-tags about-tags">
      {% for item in site.data.profile.about.focus_areas %}
      <span>{{ item }}</span>
      {% endfor %}
    </div>
    {% endif %}
  </div>
</section>
