"use strict";

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'dfc'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(exports, exports.dfc);
  } else {
    factory(root, root.dfc);
  }
})(this, function (exports, _) {

  function InteractiveChart(dom, api) {
    this._dom = dom; // where to draw the chart
    this._api = api;

    this._chart = null;
  };

  InteractiveChart.prototype._drawChartData = function (chartConfig) {
    this._dom.innerHTML = ''; // clear the container
    var canvas = _('canvas', {}); // make the canvas
    var ctx = canvas.getContext('2d');

    var chartData = chartConfig.data;

    this._chart = new Chart(ctx, {
  	  type: chartConfig.type,
  	  data: {
  	    labels: Object.keys(chartData),
  	    datasets: [
          {
    	      label: chartConfig.label,
    	      data: Object.values(chartData),
    	      backgroundColor: chartConfig.bgColor,
    	      borderColor: chartConfig.borderColor,
    	      borderWidth: 1
    	    }
        ]
  	  },
  	  options: {
        maintainAspectRatio: false,
  	    scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
  	    }
  	  }
  	});

    // Add the canvas to the dom
    this._dom.appendChild(_('div', {
      'style': {
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'bottom': 0,
        'right': 0
      }
    }, [canvas]));
  };


  InteractiveChart.prototype._drawFilterChartData = function (chartConfig) {
    this._dom.innerHTML = ''; // clear the container
    var canvas = _('canvas', {}); // make the canvas
    var ctx = canvas.getContext('2d');

    var chartData = chartConfig.data;

    this._chart = new Chart(ctx, {
      type: chartConfig.type,
      data: {
        datasets: chartData
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'linear',
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function(value) {if (value % 1 === 0) {return value;}}
            }
          }]
          }
        }
      });

    // Add the canvas to the dom
    this._dom.appendChild(_('div', {
      'style': {
        'position': 'relative',
        'width': '100%',
        'height': '100%'
      }
    }, [canvas]));
  };


  InteractiveChart.prototype._drawFilterChartWithData = function (endpoint) {
    return this._api.getChartMetadata(endpoint).execute().then((function (c) {
      this._drawFilterChartData(c);
    }).bind(this));
  };

  InteractiveChart.prototype.drawFilterGroup = function (id) {
    return this._drawFilterChartWithData('filter/' + id + '/overview');
  };

  InteractiveChart.prototype._drawWithData = function (endpoint) {
    return this._api.getChartMetadata(endpoint).execute().then((function (c) {
      this._drawChartData(c);
    }).bind(this));
  };

  InteractiveChart.prototype.drawOverview = function () {
    return this._drawFilterChartWithData('overview');
  };  

  InteractiveChart.prototype.drawFilterRule = function (id, ruleId) {
    return this._drawWithData('filter/' + id + '/rule/' + ruleId);
  };

  exports.InteractiveChart = InteractiveChart;
});
