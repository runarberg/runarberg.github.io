(function() {
  var setup_controls, setup_graph, svg;

  svg = d3.select("#wealth").append("svg").attr("class", "bar-chart").attr("width", "100%");

  setup_controls = function() {
    var menu;
    menu = d3.select("#wealth").append("menu").attr("class", "wealth-controls");
    menu.append("div").attr("class", "wealth_N-label").append("label").attr("for", "wealth_N").text("Fjöldi");
    d3.select(".wealth_N-label").append("input").attr("id", "wealth_N").attr("type", "number").attr("name", "wealth_N").attr("min", "2").attr("max", "40").attr("step", "2").attr("value", "10").attr("placeholder", "Fjöldi");
    menu.append("div").attr("class", "wealth_W-label").append("label").attr("for", "wealth_W").text("Upphafsfé");
    d3.select(".wealth_W-label").append("input").attr("id", "wealth_W").attr("type", "number").attr("name", "wealth_W").attr("min", "20").attr("max", "1000000").attr("step", "20").attr("value", "100").attr("placeholder", "Upphafsfé");
    d3.select(".wealth_W-label").append("button").attr("class", "wealth_reset").attr("title", "Reset").text("⬑");
    menu.append("div").attr("class", "prev-next-container");
    d3.select(".prev-next-container").append("button").attr("class", "wealth_prev").attr("title", "Previous round").text("<<");
    d3.select(".prev-next-container").append("button").attr("class", "wealth_next").attr("title", "Next round").text(">>");
  };

  setup_graph = function() {
    var N, W, chart, col_height, time, update, update_chart, x, yard;
    N = parseInt(document.getElementById("wealth_N").value);
    W = parseInt(document.getElementById("wealth_W").value);
    yard = Wealth(N, W);
    time = 0;
    col_height = (N > 80 ? 2 : 180 / N);
    svg.attr("height", col_height * N + 60);
    chart = svg.append("g").attr("transform", "translate(10,30)");
    x = d3.scale.linear().domain([0, W * 4]).range(["0", "80%"]);
    chart.selectAll("line").data(x.ticks(12)).enter().append("line").attr("x1", x).attr("x2", x).attr("y1", 0).attr("y2", col_height * N).style("stroke", "#ccc");
    chart.selectAll(".rule").data(x.ticks(12)).enter().append("text").attr("class", "rule").attr("x", x).attr("y", 0).attr("dy", -3).attr("text-anchor", "middle").text(String);
    chart.append("g").attr("class", "round").append("text").attr("y", col_height * (N + 1)).attr("x", "80%").attr("dx", "-.2em").text("Umferð " + time);
    chart.selectAll("rect").data(yard.data[time]).enter().append("rect").attr("y", function(d, i) {
      return i * col_height;
    }).attr("width", function(d) {
      return x(d.wealth);
    }).attr("height", col_height - 2);
    update = function() {
      chart.selectAll("rect").data(yard.data[time]).transition().duration(750).attr("width", function(d) {
        return x(d.wealth);
      });
      chart.select(".round text").text("Umferð " + time);
    };
    update_chart = function() {
      chart.remove();
      setup_graph();
    };
    d3.select(".wealth_next").on("click", function() {
      time += 1;
      if (yard.data.length === time) {
        yard.trade();
      }
      update();
    });
    d3.select(".wealth_prev").on("click", function() {
      if (time > 0) {
        time -= 1;
        update();
      }
    });
    d3.select(".wealth_reset").on("click", function() {
      N = parseInt(document.getElementById("wealth_N").value);
      W = parseInt(document.getElementById("wealth_W").value);
      yard = Wealth(N, W);
      time = 0;
      update_chart();
      update();
    });
  };

  setup_controls();

  setup_graph();

}).call(this);
