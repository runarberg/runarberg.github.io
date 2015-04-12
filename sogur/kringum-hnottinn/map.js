(function() {
  var map, stateInputs, tocAnchors, tocLayer;

  L.mapbox.accessToken = 'pk.eyJ1IjoicnVuYXJiZXJnIiwiYSI6IjhqWmd0ZTgifQ.tq-NpBG7oDG9Q7Vc9pIsJw';

  map = L.mapbox.map('toc-map', 'runarberg.j54p5f5j', {
    zoomControl: false,
    keyboard: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    touchZoom: false
  });

  map.setView([63.9, -22.46], 5);

  tocLayer = L.mapbox.featureLayer().loadURL('toc.geojson').on('layeradd', function(e) {
    var feature, marker;
    marker = e.layer;
    feature = marker.feature;
    if (feature.id.match(/point$/)) {
      marker.setIcon(L.divIcon({
        className: "toc-spot " + feature.id,
        iconSize: [50, 50],
        html: "<a href='" + feature.properties.href + "'>" + feature.properties.h1 + "</a>"
      }));
    } else {
      marker.setStyle({
        weight: 3,
        dashArray: "20,15",
        lineJoin: "round",
        lineCap: "round"
      });
    }
  }).on('click', function(e) {
    window.location.hash = e.layer.feature.properties.href;
  }).addTo(map);

  stateInputs = document.querySelectorAll("input[name='toc-state']");

  Array.prototype.forEach.call(stateInputs, function(input) {
    var d;
    d = input.dataset;
    if (input.checked) {
      map.setView([d.lat, d.lng], d.zoom);
    }
    return input.addEventListener("change", function(e) {
      return map.setView([d.lat, d.lng], d.zoom);
    });
  });

  tocAnchors = document.querySelectorAll(".toc a[href^='#']");

  Array.prototype.forEach.call(tocAnchors, function(anchor) {
    anchor.addEventListener("mouseover", function(e) {
      var href, point;
      href = this.hash.substr(1);
      point = document.querySelector(".toc-" + href + "-point");
      if (point) {
        point.classList.add("hover");
      }
    });
    anchor.addEventListener("mouseout", function(e) {
      var href, point;
      href = this.hash.substr(1);
      point = document.querySelector(".toc-" + href + "-point");
      if (point) {
        point.classList.remove("hover");
      }
    });
  });

}).call(this);
