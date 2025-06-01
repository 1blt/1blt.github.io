---
layout: page
title: Force Pedometer
description: Your foot, as an interface
img: assets/img/force_pedometer.jpg
importance: 4
category: compute
---

We chose the force sensor because of our unique experience with walking. Specifically, that there is a noticeable weight-shifting mechanism between steps, where more force is applied onto the ground with which our feet are connected. This feature seemed to be resilient to strange ways of walking, for example, dance moves. As such, we decided to go with the force sensor, which could measure the force applied to the ground, rather than an accelerometer or other sensors that may not be alerted to constant-velocity sliding movements or other atypical ways of walking.

We decided that starting with a more frequent sample rate would allow us to observe the behavior of the walking better, and that we did not have that much constraints over processing power or memory space, so our sampling time just had to be smaller than the world record running time of <a href="https://www.youtube.com/watch?v=jiQ-4TFeeO8"> Usain Bolt's 9.58 / 100 meter </a> of which we counted 41 steps, meaning 9.58 seconds/41 steps which is around 0.23 seconds per step, or 4.27 Hz. We multiplied that by two to get a minimum sampling rate of around 8.54 Hz. Therefore, we decided to aim for a sampling rate of around 10 Hz by putting in a delay of 100 ms between each sensor reading. Our actual sampling rate was around 9.6 Hz.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/foot_circuit.jpg" title="Foor circuit" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/foot-setup.jpg" title="Fot setup 1" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/foot-setup2.jpg" title="Foot setup 2" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    On the left, the circuit for the force pedometer. Middle, the sock interface for user 1 testing. Right, the sock interface for user 2 testing.
</div>
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/foot_shuffle.png" title="Shuffling" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The signals characteristics of shuffling your feet on the ground without picking them up.
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/foot_walking.png" title="walking" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/foot_stepping in place.png" title="walking-in-place" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/foot_skipping.png" title="skipping" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/foot_running.png" title="running" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    From left to right: force signals on the foot for walking, walking in place, skipping, and running.
</div>

<a href="https://www.overleaf.com/read/vgqfjfzfshpm#083212">More on how we built the run/walk classifier here </a>
