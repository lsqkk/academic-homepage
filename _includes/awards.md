<h2 id="awards" style="margin: 2px 0px -15px;">Competitions \& Awards</h2>



<div class="awards">

<ol class="bibliography">



{% for link in site.data.awards.main %}



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

&nbsp;     {% if link.award\_description %}

&nbsp;     <div class="award-description"><strong>{{ link.award\_description }}</strong></div>

&nbsp;     {% endif %}

&nbsp;     {% if link.reason %}

&nbsp;     <div class="reason">{{ link.reason }}</div>

&nbsp;     {% endif %}

&nbsp;   <div class="links">

&nbsp;     {% if link.year and link.image == null %} 

&nbsp;     <span class="badge-year" style="background-color: #f0f0f0; padding: 3px 8px; border-radius: 3px; font-size: 12px;">{{ link.year }}</span>

&nbsp;     {% endif %}

&nbsp;   </div>

&nbsp; </div>

</div>

</li>

<br>



{% endfor %}



</ol>

</div>

