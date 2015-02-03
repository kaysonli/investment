define(['./helper/util', './quotation', './data/holdings'], function(util, quote, holdings) {
    var fundShares = holdings.fund,
        myStocks = holdings.stock;

    function saveFunds(funds) {
        if (localStorage) {
            localStorage.setItem('fund', JSON.stringify(funds));
        } else {
            util.setCookie('fund', JSON.stringify(funds));
        }
    }

    function getFunds() {
        var str = '[]';
        if (localStorage) {
            str = localStorage.getItem('fund');
        } else {
            str = util.getCookie('fund');
        }
        if (str) {
            return JSON.parse(str);
        }
        return fundShares;
    }

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
            funds[i].increaseRate = ev[6];
            funds[i].estimatedTotalRate = (parse(funds[i].totalRewardRate) + parse(ev[6])).toFixed(2) + '%';
            sum += reward;
        }
        funds.sum = sum;
        funds.estimatedSum = estimatedSum;
        var stats = funds.slice();
        stats.push({
            code: '',
            name: '合计',
            reward: sum,
            estimateReward: +estimatedSum.toFixed(2)
        });
        stats.sum = sum;
        stats.estimatedSum = estimatedSum;
        console.clear();
        if (console.table) {
            console.table(stats, ['code', 'name', 'totalRewardRate', 'increaseRate', 'estimatedTotalRate', 'estimateReward']);
        }
        return +estimatedSum.toFixed(2);
    }

    function notify() {
        var tpl = [util.format('上证指数：{0}, {1}%\n', myStocks[0].price, (myStocks[0].change * 100).toFixed(1))];
        for (var i = 1; i < myStocks.length; i++) {
            var reward = ((myStocks[i].price || myStocks[i].lastPrice) - myStocks[i].buyPrice) * 100 / myStocks[i].buyPrice;
            var rewardNum = (myStocks[i].buyPrice * myStocks[i].shares * reward / 100).toFixed(1);
            var change = (myStocks[i].change * 100).toFixed(2);
            var text = '{0}: {1}, {2}%, {3}, {4}%\n';
            tpl.push(util.format(text, myStocks[i].name, myStocks[i].price.toFixed(2), change, rewardNum, reward.toFixed(2)));
        }
        tpl.push(util.format('基金收益：{0}\n', totalFundReward.toFixed(1)));
        console.log(tpl.join(''));
        var capacity = 5,
            pos = 0;
        var deferredTimer = -1;
        if(!switchOn) {
            return;
        }
        while (true) {
            var start = pos,
                end = pos + capacity;
            if (end > tpl.length) {
                end = tpl.length;
            }
            var segment = tpl.slice(start, end);
            var option = {
                title: myStocks[0].time,
                tag: 'quote',
                body: segment.join(''),
                icon: 'http://t11.baidu.com/it/u=3970997941,3640969545&fm=58',
                onclick: function() {
                    loadData();
                    clearTimeout(deferredTimer);
                },
                onclose: function() {
                    switchOn = false;
                }
            };
            if (start === 0) {
                util.notify(option);
            } else {
                deferredTimer = setTimeout(function() {
                    util.notify(option);
                }, 3000);
            }

            if (end === tpl.length) {
                break;
            }
            pos += capacity;
        }

    }

    function loadData() {
        var counter = 0;
        var open_am = new Date(),
            close_am = new Date(),
            open_pm = new Date(),
            close_pm = new Date(),
            now = new Date();
        open_am.setHours(9);
        open_am.setMinutes(25);
        close_am.setHours(11);
        close_am.setMinutes(33);

        open_pm.setHours(13);
        open_pm.setMinutes(0);
        close_pm.setHours(15);
        close_pm.setMinutes(3);

        //for closed hours.
        if (now < open_am || now > close_pm || now > close_am && now < open_pm) {
            if (!isNaN(totalFundReward)) {
                return;
            }
        }

        var savedFunds = getFunds();
        if(savedFunds.length > 0) {
            fundShares = savedFunds;
        }

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

    var totalFundReward = NaN;
    var switchOn = true;

    return {
        display: function() {
            loadData();
        },
        getFunds: getFunds,
        saveFunds: saveFunds
    };
});
