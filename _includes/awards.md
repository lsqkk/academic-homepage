<h2 id="awards" style="margin: 2px 0px -15px;">Competitions & Awards</h2>

<div class="awards">
<ol class="bibliography">

{% for link in site.data.awards.main %}

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
      {% if link.award_description %}
      <div class="award-description" style="color: #666; font-weight: bold; margin-bottom: 5px;">{{ link.award_description }}</div>
      {% endif %}
      {% if link.reason %}
      <div class="reason" style="margin-bottom: 10px;">{{ link.reason }}</div>
      {% endif %}
    <div class="links">
      {% if link.year and link.image == null %}
      <span style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px; font-size: 12px;">{{ link.year }}</span>
      {% endif %}
    </div>
  </div>
</div>
</li>
<br>

{% endfor %}

</ol>
</div>