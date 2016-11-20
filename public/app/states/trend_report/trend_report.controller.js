(function() {
    'use strict';

    angular.module('emoviato.ui.controllers').controller('TrendController', Controller);

    Controller.$inject = ['$log', '$state', '$stateParams', '$interval', '$timeout','ChartService'];

    function Controller($log, $state, $stateParams, $interval, $timeout, ChartService) {

        this.currentTrendName = $stateParams.currentTrendName;

        var trendReportContainer = ChartService.getTrendReportContainer();
        this.trendData = trendReportContainer.trendData;

        // finds emotion with highest count
        var alias = this;
        var topEmotionCount = Math.max.apply(Math,alias.trendData.emotions.map(function(o){return o.count;}));
        var topEmotion = alias.trendData.emotions.find(function(o){ return o.count == topEmotionCount; });



        var getTop5Emoji = function(arr, prop, n) {
            // clone before sorting, to preserve the original array
            var clone = arr.slice(0);

            // sort descending
            clone.sort(function(x, y) {
                if (x[prop] == y[prop]) return 0;
                else if (parseInt(x[prop]) < parseInt(y[prop])) return 1;
                else return -1;
            });

            return clone.slice(0, n || 1);
        };

        var top5Emoji = getTop5Emoji(alias.trendData.emojis, "count", 5);
        var getTop5EmojiString = function() {
            var result = '';
            for(var i = 0; i < 5; i++) {
                result += top5Emoji[i].char;
                result += ' ';
            }
            return result;
        };

        this.top5EmojiString = getTop5EmojiString();


        // sets page headers according to emotion
        var topTweetHeader = document.getElementById("top-tweet-header");
        var topEmojiHeader = document.getElementById("top-emoji-header");
        var setHeaderEmotionColor = function () {

            var headerColor;
          switch(topEmotion.name) {
              case 'lit':
                  headerColor = '#FF6F08';
                  break;
              case 'sad':
                  headerColor = '#8085e9';
                  break;
              case 'mad':
                  headerColor = '#d9534f';
                  break;
              case 'happy':
                  headerColor = '#FFEF4C';
                  break;
              default:
                  headerColor = '#0275d8';
                  break;
          }
            topTweetHeader.style.backgroundColor = headerColor;
            topEmojiHeader.style.backgroundColor = headerColor;
        };
        setHeaderEmotionColor();


        var divisor = alias.trendData.totalEmojis;
        var getPercentage = function (num) {
            return Number(((num / divisor) * 100).toFixed(2));
        };
        // Cant do this in the chart config :(
        var percentageHappy = getPercentage(this.trendData.emotions[0].count);
        var percentageLit = getPercentage(this.trendData.emotions[1].count);
        var percentageSad = getPercentage(this.trendData.emotions[2].count);
        var percentageMad = getPercentage(this.trendData.emotions[3].count);
        var percentageFunny = getPercentage(this.trendData.emotions[4].count);

        var litEmoji = '\ud83d\udd25';
        var madEmoji = '\ud83d\ude21';
        var sadEmoji = '\uD83D\uDE14';
        var funnyEmoji = '\uD83D\uDE02';
        var happyEmoji = '\uD83D\uDE04';

        this.pieChartConfig = {

            options: {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                chart: {
                    type: 'pie'
                },
                tooltip: {
                    shared: true,
                    formatter: function()
                    {
                        var value = this;
                        var string = '<div>';
                        string += '<p>' + value.point.series.name + '</p>';
                        string += '<strong>' + value.point.legend + ':</strong> ';
                        string += '<span>' + value.point.y + ' %' + '</span>';
                        string += '</li>';
                        string += '</div>';
                        return string;
                    },
                    useHTML: true
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    labelFormatter: function () {
                        var opAlias = this;
                        return '<h2>' + opAlias.legend + '</h2>';
                    }
                },
            },
            series: [{
                name: 'Emotion',
                type: 'pie',
                data: [ {
                    name: happyEmoji,
                    y: percentageHappy,
                    drilldown: 'Happy',
                    legend: 'Happy'
                }, {
                    name: sadEmoji,
                    y: percentageSad,
                    drilldown: 'Sad',
                    legend: 'Sad'
                }, {
                    name: madEmoji,
                    y: percentageMad,
                    drilldown: 'Mad',
                    legend: 'Mad'
                }, {
                    name: litEmoji,
                    y: percentageLit,
                    drilldown: litEmoji,
                    legend: 'Lit'
                }, {
                    name: funnyEmoji,
                    y: percentageFunny,
                    drilldown: 'Funny',
                    legend: 'Funny'
                }]
            }],
            //Title configuration (optional)
            title: {
                text: 'Range of Emotions'
            },
            //Boolean to control showing loading status on chart (optional)
            //Could be a string if you want to show specific loading text.
            loading: false,
            //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
            //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
            xAxis: {
                currentMin: 0,
                currentMax: 20,
                title: {text: 'values'}
            },
            //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
            useHighStocks: false,
            //size (optional) if left out the chart will default to size of the div or something sensible.
            size: {
                width: 400,
                height: 300
            }
        };


        var maxXAxisLen = alias.trendData.emojis.length;
        var colCategories = alias.trendData.emojis.map(function (o) {return o.char;});
        var colData = alias.trendData.emojis.map(function (o) { return o.count;});

        this.columnChartConfig = {

            options: {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                chart: {
                    inverted: false,
                },
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            //Series object (optional) - a list of series using normal Highcharts series options.
            //This is where each emoji will go.
            series: [{
                type: 'column',
                name: 'Count',
                colorByPoint: true,
                data: colData,
                showInLegend: false
            }],
            //Title configuration (optional)
            title: {
                text: 'Distribution of Emoji'
            },
            //Boolean to control showing loading status on chart (optional)
            //Could be a string if you want to show specific loading text.
            loading: false,
            //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
            //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
            xAxis: {
                categories: colCategories
            },
            yAxis: {
                title: {text: 'Emojis counted'}
            },
            //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
            useHighStocks: false,
            //size (optional) if left out the chart will default to size of the div or something sensible.
            size: {
                width: 400,
                height: 300
            }
        };

        var isInverted = false;
        this.buttonText = 'Invert Chart';
        this.invertColumnChart = function () {
            if(isInverted) {
                isInverted = false;
                this.buttonText = 'Invert Chart';
                this.columnChartConfig.options.chart.inverted = false;
            }
            else {
                isInverted = true;
                this.buttonText = 'Invert-Invert Chart';
                this.columnChartConfig.options.chart.inverted = true;
            }
        };

        var data = [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
            [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
            [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
            [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
            [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
            [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
            [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
            [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
            [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
            [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
            [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
            [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
            [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
            [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
            [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
            [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
            [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
            [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
            [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
            [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
            [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
            [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
            [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
            [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
            [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
            [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
            [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
            [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
            [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
            [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
            [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
            [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
            [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
            [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
            [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
            [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
            [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
            [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
            [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
            [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
            [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
            [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
            [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
            [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
            [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
            [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
            [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
            [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
            [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
            [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
            [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
            [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]];

        /**
         * Get histogram data out of xy data
         * @param   {Array} data  Array of tuples [x, y]
         * @param   {Number} step Resolution for the histogram
         * @returns {Array}       Histogram data
         */
        function histogram(data, step) {
            var histo = {},
                x,
                i,
                arr = [];

            // Group down
            for (i = 0; i < data.length; i++) {
                x = Math.floor(data[i][0] / step) * step;
                if (!histo[x]) {
                    histo[x] = 0;
                }
                histo[x]++;
            }

            // Make the histo group into an array
            for (x in histo) {
                if (histo.hasOwnProperty((x))) {
                    arr.push([parseFloat(x), histo[x]]);
                }
            }

            // Finally, sort the array
            arr.sort(function (a, b) {
                return a[0] - b[0];
            });

            return arr;
        }



        this.histoChartConfig = {

            options: {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                chart: {
                    type: 'column'
                },
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            title: {
                text: 'Highcharts Histogram'
            },
            xAxis: {
                gridLineWidth: 1
            },
            yAxis: [{
                title: {
                    text: 'Histogram Count'
                }
            }, {
                opposite: true,
                title: {
                    text: 'Y value'
                }
            }],
            series: [{
                name: 'Histogram',
                type: 'column',
                data: histogram(data, 10),
                pointPadding: 0,
                groupPadding: 0,
                pointPlacement: 'between'
            }, {
                name: 'XY data',
                type: 'scatter',
                data: data,
                yAxis: 1,
                marker: {
                    radius: 1.5
                }
            }]
        };

        var testLog = function () {
            console.log("topEmotion");
            console.log(this.top5EmojiString);

        }.bind(this);
        testLog();


    }

    return Controller;
})();