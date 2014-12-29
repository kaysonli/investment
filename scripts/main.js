require(['./fund'], function(fund) {
	fund.getList(function(list, openList, currencyList) {
		console.log(list, openList, currencyList);
		fund.getHistoricalValues('020001', 2014, function(values) {
			console.log(values);
		});
	});
});