<section class="homepage-block" id="about">
  <div class="section-heading">
    <span class="section-kicker">Profile</span>
    <h2>About Me</h2>
  </div>

  <div class="about-panel">
    <p class="about-lead">{% include rich-text.html text=site.data.profile.about.lead %}</p>
    <p class="about-summary">{% include rich-text.html text=site.data.profile.about.summary %}</p>

    {% if site.data.profile.about.focus_areas %}
    <div class="education-tags about-tags">
      {% for item in site.data.profile.about.focus_areas %}
      <span>{% include rich-text.html text=item %}</span>
      {% endfor %}
    </div>
    {% endif %}
  </div>
</section>
