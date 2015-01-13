define(['./helper/util', './quotation'], function(util, quote) {
    var fundShares = [{
        "code": "020010",
        "totalRewardRate": "16.82%",
        "shares": 1475.92
    }, {
        "code": "217023",
        "totalRewardRate": "16.22%",
        "shares": 2084.31
    }, {
        "code": "213006",
        "totalRewardRate": "15.67%",
        "shares": 1501.68
    }, {
        "code": "519977",
        "totalRewardRate": "14.27%",
        "shares": 1094.75
    }, {
        "code": "161211",
        "totalRewardRate": "10.09%",
        "shares": 4731.24
    }, {
        "code": "519983",
        "totalRewardRate": "7.03%",
        "shares": 2460.49
    }, {
        "code": "163113",
        "totalRewardRate": "5.73%",
        "shares": 4451.57
    }, {
        "code": "000193",
        "totalRewardRate": "5.56%",
        "shares": 1984.13
    }, {
        "code": "377240",
        "totalRewardRate": "-0.57%",
        "shares": 1223.05
    }, {
        "code": "000051",
        "totalRewardRate": "-1.21%",
        "shares": 5628.89
    }, {
        "code": "233009",
        "totalRewardRate": "-1.89%",
        "shares": 2066.6
    }, {
        "code": "370027",
        "totalRewardRate": "-3.16%",
        "shares": 856.19
    }, {
        "code": "519087",
        "totalRewardRate": "-3.11%",
        "shares": 4478.45
    }];

    var myStocks = [{
        code: 'sh000001',
        name: '上证指数'
    }, {
        code: 'sh601218',
        name: '吉鑫科技',
        buyPrice: 7.65,
        shares: 300
    }, {
        code: 'sz000930',
        name: '中粮生化',
        buyPrice: 7.82,
        shares: 400
    }, {
        code: 'sz160706',
        name: '嘉实 300',
        buyPrice: 0.944,
        shares: 1400
    }];

    function getFundShares() {
        var funds = [];
        var rows = $("#m_Table_open tr[code]");
        for (var i = 0; i < rows.length; i++) {
            var row = $(rows[i]);
            var code = row.attr('code');
            var share = +row.find('td:eq(3)').text().replace(',', '');
            var totalRewardRate = row.find('td:last').text().replace(/\s/g, '');
            funds.push({
                code: code,
                totalRewardRate: totalRewardRate,
                shares: share
            });
        }
        return funds;
    }

    function parse(percent) {
        var val = +percent.replace('%', '');
        return +val.toFixed(2);
    }

    function estimateValues(funds) {
        var estimatedSum = 0,
            sum = 0;
        for (var i = 0; i < funds.length; i++) {
            var ev = window['HQ_EV_' + funds[i].code];
            if (!ev) {
                continue;
            }
            funds[i].name = ev[1];
            var netvalue = ev[5],
                rate = ev[6].replace('%', '') / 100;
            var reward = funds[i].shares * (netvalue - netvalue / (1 + rate));
            funds[i].estimateReward = +reward.toFixed(2);
            estimatedSum += reward;
            netvalue = ev[3], rate = ev[4].replace('%', '') / 100;
            var reward = funds[i].shares * (netvalue - netvalue / (1 + rate));
            funds[i].reward = reward;
            funds[i].increaseRate = ev[6];
            funds[i].estimatedTotalRate = (parse(funds[i].totalRewardRate) + parse(ev[6])).toFixed(2) + '%';
            sum += reward;
        }
        funds.push({
            code: '',
            name: '合计',
            reward: sum,
            estimateReward: +estimatedSum.toFixed(2)
        });
        funds.sum = sum;
        funds.estimatedSum = estimatedSum;
        console.table(funds, ['name', 'reward', 'totalRewardRate', 'increaseRate', 'estimatedTotalRate', 'estimateReward']);
        return +estimatedSum.toFixed(2);
    }

    function notify() {
        var tpl = [util.format('上证指数：{0}, {1}%\n', myStocks[0].price, (myStocks[0].change * 100).toFixed(1))];
        for (var i = 1; i < myStocks.length; i++) {
            var reward = (myStocks[i].price - myStocks[i].buyPrice) * 100 / myStocks[i].buyPrice;
            var rewardNum = (myStocks[i].buyPrice * myStocks[i].shares * reward / 100).toFixed(1);
            var text = '{0}: {1}, {2}%, {3}\n';
            tpl.push(util.format(text, myStocks[i].name, myStocks[i].price.toFixed(1), reward.toFixed(1), rewardNum));
        }
        tpl.push(util.format('基金收益：{0}\n', totalFundReward.toFixed(1)));
        var option = {
            title: myStocks[0].time,
            tag: 'quote',
            body: tpl.join(''),
            icon: 'http://t11.baidu.com/it/u=3970997941,3640969545&fm=58',
            onclick: loadData
        };
        util.notify(option);
    }

    function loadData() {
        var counter = 0;
        quote.getFund(fundShares, function(data) {
            ++counter;
            totalFundReward = estimateValues(fundShares);
            if (counter === 2) {
                notify();
            }
        });
        quote.getStock(myStocks, function(data) {
            ++counter;
            if (counter === 2) {
                notify();
            }
        });
    }

    var totalFundReward = 0;

    return {
        display: function() {
            loadData();
        }
    };
});
