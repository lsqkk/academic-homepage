<h2 id="projects" style="margin: 2px 0px -15px;">Project Experience</h2>



<div class="projects">

<ol class="bibliography">



{% for link in site.data.project.main %}



<li>

<div class="pub-row">

&nbsp; <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">

&nbsp;   {% if link.image %} 

&nbsp;   <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">

&nbsp;   {% if link.year %} 

&nbsp;   <abbr class="badge">{{ link.year }}</abbr>

&nbsp;   {% endif %}

&nbsp;   {% endif %}

&nbsp; </div>

&nbsp; <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">

&nbsp;     <div class="title">{{ link.title }}</div>

&nbsp;     {% if link.attribute %}

&nbsp;     <div class="attribute"><strong>{{ link.attribute }}</strong></div>

&nbsp;     {% endif %}

&nbsp;     <div class="description">{{ link.description }}</div>

&nbsp;     {% if link.tech\_stack %}

&nbsp;     <div class="tech-stack"><strong>Tech Stack:</strong> {{ link.tech\_stack }}</div>

&nbsp;     {% endif %}

&nbsp;     {% if link.outcome %}

&nbsp;     <div class="outcome"><strong>Outcome:</strong> {{ link.outcome }}</div>

&nbsp;     {% endif %}

&nbsp;   <div class="links">

&nbsp;     {% if link.link %} 

&nbsp;     <a href="{{ link.link }}" class="btn btn-sm z-depth-0" role="button" target="\_blank" style="font-size:12px;">Link</a>

&nbsp;     {% endif %}

&nbsp;     {% if link.year and link.image == null %} 

&nbsp;     <span class="badge-year" style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px; font-size: 12px; margin-left: 5px;">{{ link.year }}</span>

&nbsp;     {% endif %}

&nbsp;   </div>

&nbsp; </div>

</div>

</li>

<br>



{% endfor %}



</ol>

</div>

