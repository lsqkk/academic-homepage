<h2 id="projects" style="margin: 2px 0px -15px;">Project Experience</h2>

<div class="projects">
<ol class="bibliography">

{% for link in site.data.project.main %}

<li>
<div class="pub-row">
  <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
    {% if link.image %} 
    <div style="width: 100%; max-height: 120px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
      <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="object-fit: contain; max-height: 120px;">
    </div>
    {% if link.year %} 
    <abbr class="badge" style="position: absolute; top: 0; right: 15px;">{{ link.year }}</abbr>
    {% endif %}
    {% elsif link.year %}
    <abbr class="badge" style="width: 100%; text-align: center; margin-bottom: 10px;">{{ link.year }}</abbr>
    {% endif %}
  </div>
  <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
      <div class="title">{{ link.title }}</div>
      {% if link.attribute %}
      <div class="attribute" style="color: #666; font-style: italic; margin-bottom: 5px;">{{ link.attribute }}</div>
      {% endif %}
      <div class="description" style="margin-bottom: 10px;">{{ link.description }}</div>
      {% if link.tech_stack %}
      <div class="tech-stack" style="margin-bottom: 5px;"><strong>Tech Stack:</strong> {{ link.tech_stack }}</div>
      {% endif %}
      {% if link.outcome %}
      <div class="outcome" style="margin-bottom: 10px;"><strong>Outcome:</strong> {{ link.outcome }}</div>
      {% endif %}
    <div class="links">
      {% if link.link %} 
      <a href="{{ link.link }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Link</a>
      {% endif %}
      {% if link.year and link.image == null and link.attribute == null %}
      <span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px; font-size: 12px; margin-left: 5px;">{{ link.year }}</span>
      {% endif %}
    </div>
  </div>
</div>
</li>
<br>

{% endfor %}

</ol>
</div>