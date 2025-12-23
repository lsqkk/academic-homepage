<h2 id="projects" style="margin: 2px 0px -15px;">Project Experience</h2>

<div class="projects">
<ol class="bibliography">

{% for link in site.data.project.main %}

<li>
<div class="pub-row" style="display: flex; align-items: flex-start;">
  <div class="col-sm-3 abbr" style="position: relative; padding-right: 15px; padding-left: 15px; min-height: 120px;">
    {% if link.image %} 
    <div style="width: 100%; height: 120px; overflow: hidden; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #eee;">
      <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    {% if link.year %} 
    <abbr class="badge" style="position: absolute; top: 5px; right: 20px; background-color: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">{{ link.year }}</abbr>
    {% endif %}
    {% elsif link.year %}
    <div style="width: 100%; height: 120px; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa; border-radius: 4px; border: 1px solid #eee;">
      <abbr class="badge" style="background-color: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 3px; font-size: 12px;">{{ link.year }}</abbr>
    </div>
    {% endif %}
  </div>
  <div class="col-sm-9" style="position: relative; padding-right: 15px; padding-left: 20px;">
      <div class="title" style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">{{ link.title }}</div>
      {% if link.attribute %}
      <div class="attribute" style="color: #666; font-style: italic; margin-bottom: 6px; font-size: 14px;">{{ link.attribute }}</div>
      {% endif %}
      <div class="description" style="margin-bottom: 8px; font-size: 14px; line-height: 1.4;">{{ link.description }}</div>
      {% if link.tech_stack %}
      <div class="tech-stack" style="margin-bottom: 4px; font-size: 13px;"><strong>Tech Stack:</strong> {{ link.tech_stack }}</div>
      {% endif %}
      {% if link.outcome %}
      <div class="outcome" style="margin-bottom: 8px; font-size: 13px;"><strong>Outcome:</strong> {{ link.outcome }}</div>
      {% endif %}
    <div class="links" style="margin-top: 8px;">
      {% if link.link %} 
      <a href="{{ link.link }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px; padding: 2px 8px;">Link</a>
      {% endif %}
    </div>
  </div>
</div>
</li>
<br>

{% endfor %}

</ol>
</div>