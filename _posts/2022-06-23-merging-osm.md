---
layout: post
title: Merging OSM Files
date: 2022-06-23 09:00:00
description: Merging states for more accurate routing calculations
tags: code data geo mac docker
categories: research-log
featured: false
mermaid:
  enabled: true
  zoomable: false
---
This post investigates discrepancies in routing distances using multiple geospatial data sources, including Google Maps, and a custom merged OpenStreetMap file. It highlights anomalies in travel time calculations caused by inaccurate snapping and explores methods to resolve them. The detailed results are organized below in expandable sections for clarity and comparison.

<style>
.expand-collapse-btn {
  padding: 8px 16px;
  margin: 0.25em 0.5em 1em 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: #fff;
  background-color: #007acc;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.expand-collapse-btn:hover {
  background-color: #005fa3;
}
</style>
<button id="expand-all" class="expand-collapse-btn">Expand All</button>
<button id="collapse-all" class="expand-collapse-btn">Collapse All</button>

<details>
<summary><strong>June 23, Thursday:</strong> Satisfactory result from testing</summary>
<div markdown="1">
  - I came back and found out that the process ran successfully. 
  - I went ahead and completed the ''set-up" and went forward with the testing. 
  - The results show that the merged file has a `82%` match with the OSRM base server
</div>
</details>
<hr>

<details>
<summary><strong>June 22, Wednesday:</strong> Further investigating the OSRM queries</summary>
<div markdown="1">
- I took a look at the OSRM query, and found some [stackoverflow responses](https://stackoverflow.com/questions/48221046/osrm-giving-wrong-response-for-distance-between-2-points). Specifically,
  - Do a manual sanity check about the route [here](http://map.project-osrm.org/)
  - Then cross reference whether the reference check would like like [this](https://router.project-osrm.org/route/v1/driving/-78.8688833,38.4493315;-82.1885009,36.5959685). Essentially, the coordinates should be supplied in lon lat format instead of lat lon
  - Instead of root mean square error, I felt that using mean absolute difference made some more sense when reporting the individual elements as well as the collective error
- I then got the credentials for the digital ocean server on which I could run the OSRM things. The server runs pretty fast. I used `scp` to copy the pbf file onto the server to initialize the extraction. Since one of the operations took a long time, I looked to see if I can run something in the background and tackle it tomorrow when I came back. I found:

  ```bash
  nohup long-running-process & exit
  # To look up after you come back
  tail -f nohup.out
  ```
</div>
</details>
<hr>

<details>
<summary><strong>June 16, Thursday:</strong> Testing against the custom OSRM server</summary>
<div markdown="1">
- The last part of the works I think should be finding the ability to query the docker server and cross compare the results. Looking at [Networking for Docker on MacOS](https://docs.docker.com/desktop/mac/networking/). 
- Success. When running docker's publish flag, the first argument is the host, and the next argument is the port on the container. ``To clarify the syntax, the following two commands both expose port 80 on the container to port 8000 on the host:" 
```bash
    docker run --publish 8000:80 --name webserver nginx
    docker run -p 8000:80 --name webserver nginx
```
- I've finished testing to a point. When I used the actual responses, none of the responses matched. If I use the route 0 distance, we actually get about 60 to 80 \% matches, but only on distances that were 0. 

In any case, I compiled an excel sheet with the query, response, city coordinates.
</div>
</details>
<hr>

<details>
<summary><strong>June 15, Wednesday:</strong> Ground truth for merged OSM File</summary>
<div markdown="1">
- Looked into an error ``/data/.osrm.ebg" not found!" and realized that you need to give a docker instance more memory in order to run the compilation. Therefore, I added 50g to the memory of the docker run in order to run the extraction. 

  ```bash
  docker run --memory=50g -t -v "${PWD}:/data" osrm/osrm-backend osrm-extract -p  /opt/car.lua /data/merged.osm.pbf
  ```

- This still did not work, so looking for an alternative solution. I will first try just rendering it for a single state, and see what the final completed ending messages are:

  ```bash
  [info] Writing edge-based-graph edges       ... 
  [info] ok, after 31.9418s
  [info] Processed 7687138 edges
  [info] Expansion: 26098 nodes/sec and 8605 edges/sec
  [info] To prepare the data for routing, run: ./osrm-contract "/data/virginia-latest.osrm"
  [info] RAM: peak bytes used: 3638427648
  ```

- Response from the state of Virginia
  ```bash
  # curl "http://127.0.0.1:5000/route/v1/driving/38.9072,77.0369;36.7783,119.4179?annotations=distance"
  {"message":"Invalid coordinate value.","code":"InvalidValue"}# curl "http://127.0.0.1:5000/route/v1/driving/38.894500,77.070400;38.897700,77.036500?annotations=distance"
  {"code":"Ok","routes":[{"geometry":"w|`hFp{viM??","legs":[{"annotation":{"distance":[0]},"steps":[],"distance":0,"duration":0,"summary":"","weight":0}],"distance":0,"duration":0,"weight_name":"routability","weight":0}],"waypoints":[{"hint":"zXQfgM90H4AAAAAAHAEAAAAAAABPDAEAAAAAANNqnUIAAAAACdiURgAAAAAcAQAAAAAAAE8MAQAYAwAAJCKF-5ymRgKke1ECQACYBAAALw3q5C0b","distance":8074707.069774,"name":"","location":[-75.161052,38.184604]},{"hint":"zXQfgM90H4AAAAAAHAEAAAAAAABPDAEAAAAAANNqnUIAAAAACdiURgAAAAAcAQAAAAAAAE8MAQAYAwAAJCKF-5ymRgIkiFEC1HuXBAAALw3q5C0b","distance":8072844.13171,"name":"","location":[-75.161052,38.184604]}]}# curl "http://127.0.0.1:5000/route/v1/driving/38.8945,77.0704;40.4406,79.9959?annotations=distance"
  {"code":"Ok","routes":[{"geometry":"w|`hFp{viM??","legs":[{"annotation":{"distance":[0]},"steps":[],"distance":0,"duration":0,"summary":"","weight":0}],"distance":0,"duration":0,"weight_name":"routability","weight":0}],"waypoints":[{"hint":"zXQfgM90H4AAAAAAHAEAAAAAAABPDAEAAAAAANNqnUIAAAAACdiURgAAAAAcAQAAAAAAAE8MAQAYAwAAJCKF-5ymRgKke1ECQACYBAAALw3q5C0b","distance":8074707.069774,"name":"","location":[-75.161052,38.184604]},{"hint":"zXQfgM90H4AAAAAAHAEAAAAAAABPDAEAAAAAANNqnUIAAAAACdiURgAAAAAcAQAAAAAAAE8MAQAYAwAAJCKF-5ymRgIYE2kC_KPEBAAALw3q5C0b","distance":8102575.604085,"name":"","location":[-75.161052,38.184604]}]}
  ```
- Response from Virignia + West Virginia
  ```bash
  # curl "http://127.0.0.1:5000/route/v1/driving/38.9072,77.0369;36.7783,119.4179?annotations=distance"
  {"message":"Invalid coordinate value.","code":"InvalidValue"}# curl "http://127.0.0.1:5000/route/v1/driving/38.894500,77.070400;38.897700,77.036500?annotations=distance"
  {"code":"Ok","routes":[{"geometry":"w|`hFp{viM??","legs":[{"annotation":{"distance":[0]},"steps":[],"distance":0,"duration":0,"summary":"","weight":0}],"distance":0,"duration":0,"weight_name":"routability","weight":0}],"waypoints":[{"hint":"_LwGgP68BoAAAAAAHAEAAAAAAABPDAEAAAAAANNqnUIAAAAACdiURgAAAAAcAQAAAAAAAE8MAQB5AwAAJCKF-5ymRgKke1ECQACYBAAALw0nEIeN","distance":8074707.069774,"name":"","location":[-75.161052,38.184604]},{"hint":"_LwGgP68BoAAAAAAHAEAAAAAAABPDAEAAAAAANNqnUIAAAAACdiURgAAAAAcAQAAAAAAAE8MAQB5AwAAJCKF-5ymRgIkiFEC1HuXBAAALw0nEIeN","distance":8072844.13171,"name":"","location":[-75.161052,38.184604]}]}# curl "http://127.0.0.1:5000/route/v1/driving/38.8945,77.0704;40.4406,79.9959?annotations=distance"
  {"code":"Ok","routes":[{"geometry":"w|`hFp{viM??","legs":[{"annotation":{"distance":[0]},"steps":[],"distance":0,"duration":0,"summary":"","weight":0}],"distance":0,"duration":0,"weight_name":"routability","weight":0}],"waypoints":[{"hint":"_LwGgP68BoAAAAAAHAEAAAAAAABPDAEAAAAAANNqnUIAAAAACdiURgAAAAAcAQAAAAAAAE8MAQB5AwAAJCKF-5ymRgKke1ECQACYBAAALw0nEIeN","distance":8074707.069774,"name":"","location":[-75.161052,38.184604]},{"hint":"_LwGgP68BoAAAAAAHAEAAAAAAABPDAEAAAAAANNqnUIAAAAACdiURgAAAAAcAQAAAAAAAE8MAQB5AwAAJCKF-5ymRgIYE2kC_KPEBAAALw0nEIeN","distance":8102575.604085,"name":"","location":[-75.161052,38.184604]}]}# 
  ```
- It looks like the proper location in the response to extract the distances are based off of the legs instead of the way points. But also, the extracted file from Osmium seems to be working correctly. At least for Virginia + West Virginia. 

  ```bash
  #curl "http://127.0.0.1:5000/route/v1/driving/37.630212545662474,-77.38546027847718;38.694396643163486,-79.9854414837675?annotations=distance"

  ce":[0]},"steps":[],"distance":0,"duration":0,"summary":"","weight":0}],"distance":0,"duration":0,"weight_name":"routability","weight":0}],"waypoints":[{"hint":"o0EFgKRBBYAAAAAAFAAAAAAAAACCCAAAAAAAAGGfXEEAAAAATLm8RAAAAAAUAAAAAAAAAIIIAAAkBQCABXB5-0iCLQIFMT4CDDFj-wAAPwAnEIeN","distance":17306391.47749,"name":"Knotts Island Road","location":[-75.927547,36.536904]},{"hint":"o0EFgKRBBYAAAAAAFAAAAAAAAACCCAAAAAAAAGGfXEEAAAAATLm8RAAAAAAUAAAAAAAAAIIIAAAkBQCABXB5-0iCLQL9bU4C34Q7-wAAPwAnEIeN","distance":17523813.71623,"name":"Knotts Island Road","location":[-75.927547,36.536904]}]}
  ```

- The answers are still zero? Which doesn't make sense. The kill all solution is probably to generate a list of random coordinates and cross-check that the return from the docker instance is same as the osm server.
- I put together a [tester repository](https://github.com/1blt-archive/dspg22_osm-tester) for posterity.

</div>
</details>
<hr>

<details>
<summary><strong>June 14, Tuesday:</strong> Constructing test cases for OSM files</summary>
<div markdown="1">
- Looking at how to [merge](https://docs.osmcode.org/osmium/latest/osmium-merge.html) different states. Found the following command in Osmium 
```bash
    osmium merge file1.osm file2.osm -o merged.osm
```

- I used the above command to combine the following files: District of Columbia, Pennsylvania, Virginia, and West Virginia and it seemed to work well. Tested this system on Docker, and storing a [gist](https://gist.github.com/1blt-archive/859cefaea7b61046d084ead1b3d104a1) for future users. Note: it takes about half a day to a whole day just to compile the combined files for the osrm-partition and osrm-customize. 

- Got in, but running it now gives me errors: 
  ```bash
    qemu: uncaught target signal 11 (Segmentation fault) - core dumped
  ```
- Based on the [OSRM API Documentation](http://project-osrm.org/docs/v5.5.1/api/#routeleg-object), the returned distances is in meters.

  | #  | Source       | From (Lat, Lon)                   | To (Lat, Lon)                     | Distance (m) |
  |----|--------------|-----------------------------------|-----------------------------------|--------------|
  | 1  | Google Maps  | 38.9072° N, 77.0369° W            | 36.7783° N, 119.4179° W           | 4,494,898    |
  | 2  | Germany OSM  | 38.9072° N, 77.0369° W            | 36.7783° N, 119.4179° W           | InvalidValue |
  | 3  | Merged OSM   | 38.9072° N, 77.0369° W            | 36.7783° N, 119.4179° W           | (Seg Fault)  |
  | 4  | Google Maps  | 38.8945° N, 77.0704° W            | 38.8977° N, 77.0365° W            | 4,345        |
  | 5  | Germany OSM  | 38.8945° N, 77.0704° W            | 38.8977° N, 77.0365° W            | 0            |
  | 6  | Google Maps  | 38.8945° N, 77.0704° W            | 40.4406° N, 79.9959° W            | 392,680      |
  | 7  | Germany OSM  | 38.8945° N, 77.0704° W            | 40.4406° N, 79.9959° W            | 0            |
  | 8  | Merged OSM   | 38.8945° N, 77.0704° W            | 40.4406° N, 79.9959° W            | 0            |

</div>

</details>
<hr>

<details>
<summary><strong>June 13, Monday:</strong> Docker OSRM setup and testing</summary>
<div markdown="1">
- Looking for ORSM files to download → looking for what OSM and OSRM files are.
- In order to properly test that the goal is complete, I wanted and worked with the [osrm-backend repository](https://github.com/Project-OSRM/osrm-backend).
- I downloaded [North America](http://download.geofabrik.de/) to start (11 GB, takes about 30 minutes).
- Also installed [Docker](https://docs.docker.com/desktop/mac/install/).
- **Checked out some logs. Apparently, OSRM can [return 0 if you are running multiple processes](https://github.com/Project-OSRM/osrm-backend/issues/4489). Also, it [returns null if no route between the two places exists](https://github.com/Project-OSRM/osrm-backend/issues/5111).**
- Running [Docker commands](https://github.com/Project-OSRM/osrm-backend) from Project-OSRM `osrm-backend`.

    ```shell
    curl "http://127.0.0.1:5000/route/v1/driving/13.388860,52.517037;13.385983,52.496891?steps=true"
    ```
    - Looked into port not available error → ran the command with port 5001.
    - Got the following error:
        ```shell
        curl: (52) Empty reply from server
        ```
      Probably means it is not listening. Investigating different ways to start the Docker instance so that it can listen to curls.
    - Went inside the Docker instance, installed curl:
        ```shell
        apt-get update; apt-get install curl
        ```
      Then ran the command and it returned a response (`logs/osrm-response-1`).
    - Looked up the `-p` flag:

        ```text
        -p=[]      : Publish a container's port or a range of ports to the host
                     format: ip:hostPort:containerPort | ip::containerPort | hostPort:containerPort | containerPort
                     ...
                     (use 'docker port' to see the actual mapping)
        ```
      Since it seems like the port can be flexible, the Docker runs the listener on port 5000:

        ```bash
        curl "http://127.0.0.1:5000/route/v1/driving/13.388860,52.517037;13.385983,52.496891?steps=true"
        ```
- Constructed a ground truth test for seeing if a route from `77.05472,38.90859` to `-75.37836,40.0806` would make sense. What happens when you query the server with two points that do not exist? Ran this on the Germany-based Docker:
    ```bash
    curl "http://127.0.0.1:5000/route/v1/driving/77.05472,38.90859;-77.069351,38.90346?steps=true"
    ```
- Unsure what the response means. Planning to run the frontend and test routing between places with no data.
    - Access the **Docker IP address**, not the shown one inside (i.e., use `0.0.0.0:9966`, not `http://172.17.0.3:9966/`).
    - Running the frontend takes a long time and does not load...
- Trying to ping a local URL to get the response data. You can get a response from Docker using:

    ```shell
    docker exec <docker-id> curl "http://127.0.0.1:5000/route/v1/driving/77.05472,38.90859;-77.069351,38.90346?steps=true"
    ```
- Coworker gave me a [website](http://download.geofabrik.de/north-america/us.html) to download individual pieces for testing merge versions.
</div>
</details>
<hr>
<details>
<summary><strong>June 10th, Friday:</strong> OSM merge, routing issue investigation</summary>
<div markdown="1">
Explored merging [OpenStreetMap (OSM)](https://www.openstreetmap.org/) files using Osmium to generate tri-state area maps and investigated routing anomalies caused by incorrect location snapping in OSRM.

**Problem Statement**: It looks like the routing machine is maybe snapping or something. For example, in one case, both locations resolve to a bridge at -77.069351, 38.903462, so the travel time is 0 minutes, which doesn't happen on the [public router](https://router.project-osrm.org/table/v1/car/-77.05472,38.90859;-75.37836,40.08063). That's happening for 19 other locations around that centroid (block group 110010001011 with a centroid of -77.05472, 38.90859).

- I found a tool online called [Osmium](https://github.com/osmcode/pyosmium/blob/master/README.md).
- PyOsmium was giving me some problems on install, so I used the [Homebrew version](https://formulae.brew.sh/formula/osmium-tool) instead.
- I ran the following command:

```bash
brew install osmium-tool
```
</div>
</details>
<hr>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const expandBtn = document.getElementById("expand-all");
    const collapseBtn = document.getElementById("collapse-all");
    const allDetails = document.querySelectorAll("details");

    if (expandBtn) {
      expandBtn.addEventListener("click", () => {
        allDetails.forEach(d => d.setAttribute("open", "true"));
      });
    }

    if (collapseBtn) {
      collapseBtn.addEventListener("click", () => {
        allDetails.forEach(d => d.removeAttribute("open"));
      });
    }
  });
</script>