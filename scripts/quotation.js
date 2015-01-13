define(['./helper/util'], function(util) {
    function fundQuotation(funds, callback) {
        var counter = 0;
        for (var i = 0; i < funds.length; i++) {
            var url = 'http://hqqd.fund123.cn/HQ_EV_{0}.js';
            var code = funds[i].code || funds[i];
            url = util.format(url, code);
            util.loadScript(url, function() {
                ++counter;
                if (counter === funds.length) {
                    var data = parseFundData(funds);
                    if (callback) {
                        callback(data);
                    }
                }
            });
        }
    }

    function parseFundData(funds) {
        //raw format: var HQ_EV_519087 = ['519087', '新华优选分红混合', '2015-01-13 10:22:40', 0.0000, '--', 1.0875, '0.53%', '0.00%', '2014/12/31 0:00:00'];
        var list = [];
        for (var i = 0; i < funds.length; i++) {
            var ev = window['HQ_EV_' + funds[i].code || funds[i]];
            if (!ev) {
                continue;
            }
            var code = ev[0],
                name = ev[1],
                date = ev[2],
                netvalue = ev[5],
                change = ev[6].replace('%', '') / 100;
            list.push({
                code: code,
                name: name,
                date: date,
                netvalue: netvalue,
                change: change
            });
            if (funds[i].code) {
                funds[i].name = name;
                funds[i].netvalue = netvalue;
                funds[i].change = change;
                funds[i].date = date;
            }
        }
        return list;
    }

    function stockQuotation(stocks, callback) {
        var counter = 0;
        var url = 'http://hq.sinajs.cn/list=';
        for (var k = 0; k < stocks.length; k++) {
            var code = stocks[k].code || stocks[i];
            url += code + ',';
        }
        util.loadScript(url, function() {
            if (callback) {
                var data = parseStockData(stocks);
                callback(data);
            }
        });
    }

    /*
    raw format: var hq_str_sh601006="大秦铁路,11.23,11.18,11.14,11.35,11.06,11.13,11.14,48804072,547671220,127951,11.13,118300,11.12,146200,11.11,273700,11.10,222736,11.09,5289,11.14,88200,11.15,39655,11.16,27600,11.17,111999,11.18,2015-01-13,13:18:04,00";

    0：”大秦铁路”，股票名字；
    1：”27.55″，今日开盘价；
    2：”27.25″，昨日收盘价；
    3：”26.91″，当前价格；
    4：”27.55″，今日最高价；
    5：”26.20″，今日最低价；
    6：”26.91″，竞买价，即“买一”报价；
    7：”26.92″，竞卖价，即“卖一”报价；
    8：”22114263″，成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百；
    9：”589824680″，成交金额，单位为“元”，为了一目了然，通常以“万元”为成交金额的单位，所以通常把该值除以一万；
    10：”4695″，“买一”申请4695股，即47手；
    11：”26.91″，“买一”报价；
    12：”57590″，“买二”
    13：”26.90″，“买二”
    14：”14700″，“买三”
    15：”26.89″，“买三”
    16：”14300″，“买四”
    17：”26.88″，“买四”
    18：”15100″，“买五”
    19：”26.87″，“买五”
    20：”3100″，“卖一”申报3100股，即31手；
    21：”26.92″，“卖一”报价
    (22, 23), (24, 25), (26,27), (28, 29)分别为“卖二”至“卖四的情况”
    30：”2008-01-11″，日期；
    31：”15:05:32″，时间；
    */
    function parseStockData(stocks) {
        var list = [];
        for (var i = 0; i < stocks.length; i++) {
            var code = stocks[i].code || stocks[i];
            var str = window['hq_str_' + code];
            if (str) {
                var parts = str.split(','),
                    name = parts[0],
                    price = +parts[3],
                    lastPrice = +parts[2],
                    change = (price - lastPrice) / lastPrice,
                    high = +parts[4],
                    low = +parts[5],
                    amount = +parts[9],
                    time = parts[31];
                list.push({
                    code: code,
                    name: name,
                    price: price,
                    lastPrice: lastPrice,
                    change: change,
                    high: high,
                    low: low,
                    amount: amount,
                    time: time
                });
                //if the argument is an array of objects, attach these values to them.
                if(stocks[i].code) {
                    stocks[i].name = name;
                    stocks[i].price = price;
                    stocks[i].lastPrice = lastPrice;
                    stocks[i].change = change;
                    stocks[i].amount = amount;
                    stocks[i].time = time;
                }
            }
        }
        return list;
    }

    return {
        getFund: function(funds, callback) {
            fundQuotation(funds, callback);
        },

        getStock: function(stocks, callback) {
            stockQuotation(stocks, callback);
        }
    };
});
