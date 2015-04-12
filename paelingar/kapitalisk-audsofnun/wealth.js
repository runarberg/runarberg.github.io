(function() {
  window.Wealth = function(N, W) {
    var data, i, trade;
    data = [
      (function() {
        var j, ref, results;
        results = [];
        for (i = j = 1, ref = N; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
          results.push({
            time: 0,
            indv: i,
            wealth: W
          });
        }
        return results;
      })()
    ];
    trade = function() {
      var a, b, new_data, old_data, pairs, pot, result, stake;
      old_data = data[data.length - 1];
      new_data = [];
      pairs = d3.shuffle(d3.range(N));
      i = 0;
      while (i < N) {
        a = pairs[i];
        b = pairs[i + 1];
        stake = Math.min(old_data[a].wealth, old_data[b].wealth);
        pot = 2 * stake;
        result = d3.random.normal(0.5, 0.1)();
        new_data[a] = {
          time: old_data[a].time + 1,
          indv: a,
          wealth: old_data[a].wealth + result * pot - stake
        };
        new_data[b] = {
          time: old_data[b].time + 1,
          indv: b,
          wealth: old_data[b].wealth + (1 - result) * pot - stake
        };
        i += 2;
      }
      data[data.length] = new_data;
      return new_data;
    };
    return {
      trade: trade,
      data: data
    };
  };

}).call(this);
