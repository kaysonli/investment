require.config({
    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
        fundList: 'http://hqqd.fund123.cn/funddataforsearch'
    },
    shim: {
        'fundList': {
            exports: 'fundArray'
        }
    }
});

require(['./fund', './stock', './helper/util', './estimate', './cache', 'fundList'], 
    function(fund, stock, util, estimate, cache, fundList) {
    // fund.getList(function(list, openList, currencyList) {
    //     console.log(list, openList, currencyList);
    //     fund.getHistoricalValues('020001', 2014, function(values) {
    //         console.log(values);
    //     });
    // });

    // fund.fixedInvest({
    //     fundCode: '020001',
    //     startDate: '2007-12-1',
    //     endDate: '2014-12-1',
    //     redeemDate: '2014-12-3',
    //     round: 1, // round = 1 * months or -7 * weeks
    //     fixedDay: 1,
    //     fee: 0.6,
    //     amount: 1000,
    //     dividendType: 2, //1: 红利再投资，2：现金分红
    //     needfirst: true
    // });
    var autoChk = document.getElementById('auto');
    var freq = document.getElementById('freq').value;
    stock.setup(autoChk.checked, freq * 1000);

    estimate.display();
    setInterval(function() {
        estimate.display();
    }, 30000);

    var btnSettings = document.getElementById('btnSettings');
    btnSettings.addEventListener('click', function() {
        var funds = estimate.getFunds();
        cache.openPanel(funds);
    });
});
