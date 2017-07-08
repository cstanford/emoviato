(function() {
    'use strict';

    angular.module('emoviato.ui.controllers').controller('ReportController', Controller);

    Controller.$inject = ['$log', '$state', '$stateParams', 'TrendService'];

    function Controller($log, $state, $stateParams, TrendService) {

        // TODO: move chart config to a directive.
        // TODO: Add feature that shows how long the current trend has been trending.
        // TODO: Fix image scaling issue.

        var alias = this;
        var trendContainer = TrendService.getTrendContainer();
        this.currentTrend = trendContainer.currentTrend;
        this.currentTrendName = $stateParams.currentTrendName;
        
        var currentTrendEmotions = this.currentTrend.emotions;
        // sort list according to emotion name
        currentTrendEmotions.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} ); 


        // finds emotion with highest count
        var topEmotionCount = Math.max.apply(Math,currentTrendEmotions.map(function(o){return o.count;}));
        var topEmotion = currentTrendEmotions.find(function(o){ return o.count == topEmotionCount; });

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

        var top5Emoji = getTop5Emoji(alias.currentTrend.emojis, "count", 5);
        var getTop5EmojiString = function() {
            var result = '';
            for(var i = 0; i < alias.currentTrend.emojis.length; i++) {
                if(i === 5) {
                    break;
                }
                result += top5Emoji[i].symbol;
                result += ' ';
            }
            if(result === ''){
                result = alias.currentTrend.name + ' isn\'t dank enough!';
            }
            return result;
        };

        this.top5EmojiString = getTop5EmojiString();


        // sets page headers according to emotion
        var content = document.getElementById("trend-background");
        var currentTrendHeader = document.getElementById("current-trend-header");
        var topTweetHeader = document.getElementById("top-tweet-header");
        var topEmojiHeader = document.getElementById("top-emoji-header");
        var setHeaderEmotionColor = function () {

            var headerColor;
          switch(topEmotion.name) {
              case 'lit':
                  headerColor = '#FF9800';
                  break;
              case 'sad':
                  headerColor = '#3F51B5';
                  break;
              case 'mad':
                  headerColor = '#D32F2F';
                  break;
              case 'happy':
                  headerColor = '#FFEB3B';
                  break;
              default:
                  headerColor = '#03A9F4';
                  break;
          }
            content.style.backgroundColor = headerColor;
            currentTrendHeader.style.backgroundColor = '#fff';
            topTweetHeader.style.backgroundColor = headerColor;
            topEmojiHeader.style.backgroundColor = headerColor;
        };
        setHeaderEmotionColor();


        // // Total num of emojis that we have mapped to an emotion
        var totalCategorizedEmojiCount = currentTrendEmotions.reduce(function(acc, o) { return acc + o.count; }, 0);

        var divisor = totalCategorizedEmojiCount;
        var getPercentage = function (num) {
            // return Number(((num / divisor) * 100).toFixed(2));
            var p = Number(((num / divisor) * 100).toFixed(2));
            console.log(p);
            return p;
        };
        // Cant do this in the chart config :(
        // Objs in currentTrendEmotions are sorted by obj.name so we know that this order will be correct.
        var percentageFunny = getPercentage(currentTrendEmotions[0].count);
        var percentageHappy = getPercentage(currentTrendEmotions[1].count);  
        var percentageLit = getPercentage(currentTrendEmotions[2].count);                          
        var percentageMad = getPercentage(currentTrendEmotions[3].count);
        var percentageSad = getPercentage(currentTrendEmotions[4].count);
        // var percentageUncategorized = getPercentage(alias.currentTrend.total_emoji - totalCategorizedEmojiCount);

        var litEmoji = '\ud83d\udd25';
        var madEmoji = '\ud83d\ude21';
        var sadEmoji = '\uD83D\uDE14';
        var funnyEmoji = '\uD83D\uDE02';
        var happyEmoji = '\uD83D\uDE04';
        var uncategorizedEmoji = '\u2049\uFE0F';

        this.pieChartConfig = {

            options: {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                chart: {
                    type: 'pie'
                }, // funny mad happy lit sad uncategorized
                colors: ['#03A9F4', '#D32F2F', '#FFEB3B', '#FF9800', '#3F51B5', '#78909C'],
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
                    name: funnyEmoji,
                    y: percentageFunny,
                    drilldown: 'Funny',
                    legend: 'Funny'
                }, {
                    name: madEmoji,
                    y: percentageMad,
                    drilldown: 'Mad',
                    legend: 'Mad'
                }, {
                    name: happyEmoji,
                    y: percentageHappy,
                    drilldown: 'Happy',
                    legend: 'Happy'
                }, {
                    name: litEmoji,
                    y: percentageLit,
                    drilldown: litEmoji,
                    legend: 'Lit'
                }, {
                    name: sadEmoji,
                    y: percentageSad,
                    drilldown: 'Sad',
                    legend: 'Sad'
                }
                // , {
                // 	name: uncategorizedEmoji,
                // 	y: percentageUncategorized,
                // 	drilldown: uncategorizedEmoji,
                // 	legend: 'Uncategorized'
                // }
                ]
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
            // size: {
            //     width: 400,
            //     height: 300
            // }
        };


        var maxXAxisLen = alias.currentTrend.emojis.length;
        var colCategories = alias.currentTrend.emojis.map(function (o) {return o.symbol;});
        var colData = alias.currentTrend.emojis.map(function (o) { return o.count;});

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
        };

        this.colChartIsInverted = false;
        this.invertColumnChart = function () {
            if(alias.colChartIsInverted) {
                alias.colChartIsInverted = false;
                this.columnChartConfig.options.chart.inverted = false;
            }
            else {
                alias.colChartIsInverted = true;
                this.columnChartConfig.options.chart.inverted = true;
            }
        };

        this.goHome = function() {
            $state.go('app.home');
        };

        var testLog = function () {
            console.log("currentTrend");
            console.log(this.currentTrend);
        }.bind(this);
        // testLog();

    }

    return Controller;
})();