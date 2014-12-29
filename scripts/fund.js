define(['./helper/util'], function(util) {
	return {
		getList: function(callback) {
			var url = 'http://hqqd.fund123.cn/funddataforsearch.js?ver=' + (+new Date);
			util.loadScript(url, function() {
				var fundList = [],
					openList = [],
					currencyList = [];
				if (fundArray) {
					for (var i = fundArray.length - 1; i >= 0; i--) {
						var fund = fundArray[i];
						//['泰信中小盘精选股票','290011','txzxpjxgp','0']
						fundList.push({
							name: fund[0],
							code: fund[1]
						});
					}
					for (var i = fundArray_Open.length - 1; i >= 0; i--) {
						var fund = fundArray_Open[i];
						openList.push({
							name: fund[0],
							code: fund[1]
						});
					}
					for (var i = fundArray_Currency.length - 1; i >= 0; i--) {
						var fund = fundArray_Currency[i];
						currencyList.push({
							name: fund[0],
							code: fund[1]
						});
					}
					if (callback) {
						callback(fundList, openList, currencyList);
					}
				}
			});
		},
		getHistoricalValues: function(fundCode, year, callback) {
			var url = util.format('http://hqqd.fund123.cn/jsdata/nv_daily/{0}/{1}.js', year, fundCode);
			//daily_nv_020001_2014="20140102 0.9720 3.9760 5.491560 0.0031;20140103 0.9810 3.9850 5.542408 0.0093;20140106 0.9650 3.9690 5.452012 -0.0163;20140107 0.9730 3.9770 5.497210 0.0083;20140108 0.9890 3.9930 5.587606 0.0164;20140109 0.9880 3.9920 5.581956 -0.0010;20140110 0.9760 3.9800 5.514159 -0.0121;20140113 0.9800 3.9840 5.536758 0.0041;20140114 0.9990 4.0030 5.644103 0.0194;20140115 1.0020 4.0060 5.661053 0.0030;20140116 1.0000 4.0040 5.649753 
			util.loadScript(url, function() {
				var netValues = [],
					param = util.format('daily_nv_{0}_{1}', fundCode, year);
				if (window[param]) {
					var parts = window[param].split(';');
					for (var i = 0; i < parts.length; i++) {
						var daily = parts[i].split(' ');
						netValues.push({
							date: daily[0],
							value: daily[1],
							upDown: daily[4]
						});
					}
					if(callback) {
						callback(netValues);
					}
				}
			});
		},
		getEstimatedValues: function() {

		},


	};
});