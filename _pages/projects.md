---
layout: terminal
title: Projects
permalink: /projects/
description: A selection of projects combining design, code, and systems thinking.
---

<a href="{{ '/' | relative_url }}" class="back-link">cd ..</a>

<div class="section-header" style="margin-top: 0;">
  <span class="prompt">$</span>
  <span class="command">ls -la projects/</span>
</div>

<p style="margin-bottom: 2rem;">A selection of projects combining design, code, and systems thinking.</p>

<div class="projects-grid">
{% assign sorted_projects = site.projects | sort: "importance" %}
{% for project in sorted_projects %}
<div class="project-card">
  <a href="{{ project.url | relative_url }}" class="project-title">{{ project.title }}</a>
  <p class="project-description">{{ project.description }}</p>
  <div class="project-meta">
    {% if project.category %}<span class="tag">{{ project.category }}</span>{% endif %}
  </div>
</div>
{% endfor %}
</div>

<footer class="terminal-footer">
  <span class="footer-prompt">$</span> echo "{{ site.first_name }} {{ site.last_name }} &copy; {{ 'now' | date: '%Y' }}"
</footer>
