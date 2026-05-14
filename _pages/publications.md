---
layout: terminal
title: Publications
permalink: /publications/
description: Selected work exploring data, design, and how systems shape the world around us.
---

<a href="{{ '/' | relative_url }}" class="back-link">cd ..</a>

<div class="section-header" style="margin-top: 0;">
  <span class="prompt">$</span>
  <span class="command">cat publications.bib</span>
</div>

<p style="margin-bottom: 2rem;">Selected work exploring data, design, and how systems shape the world around us.</p>

<div class="publications-list">
{% bibliography %}
</div>

<footer class="terminal-footer">
  <span class="footer-prompt">$</span> echo "{{ site.first_name }} {{ site.last_name }} &copy; {{ 'now' | date: '%Y' }}"
</footer>
