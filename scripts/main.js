require(['./fund'], function(fund) {
    // fund.getList(function(list, openList, currencyList) {
    //     console.log(list, openList, currencyList);
    //     fund.getHistoricalValues('020001', 2014, function(values) {
    //         console.log(values);
    //     });
    // });

    fund.fixedInvest({
        fundCode: '020001',
        startDate: '2007-12-1',
        endDate: '2014-12-1',
        redeemDate: '2014-12-3',
        round: 1, // round = 1 * months or -7 * weeks
        fixedDay: 1,
        fee: 0.6,
        amount: 1000,
        dividendType: 2, //1: 红利再投资，2：现金分红
        needfirst: true
    });
});
