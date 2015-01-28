define(['./helper/util', './data/stock'], function(util, ds) {
    var source = ds.dataSource;
    function setDisplayAttr(dom, path, amount, change, title) {
        dom.setAttribute('path', path);
        dom.setAttribute('amount', amount);
        dom.setAttribute('change', change);
        dom.setAttribute('_title', title);
    }

    function buildNavigation(el, container) {
        var menuItems = [];
        for (var i = 0; i < source.length; i++) {
            var liItem = document.createElement('li');
            menuItems.push(liItem);
            liItem.className = 'nav-item';
            liItem.id = 'category-' + i;
            liItem.setAttribute('path', i);
            liItem.insertAdjacentHTML('beforeend', util.format('<a href="#" class="item" path="{1}">{0}</a>', source[i].category, i));
            if (i === 0) {
                util.toggleClass(liItem, 'selected', '');
            }
            el.appendChild(liItem);
        }
        el.addEventListener('click', function(e) {
            var category = e.target.getAttribute('path');
            if (category !== undefined && category !== null) {
                currentCategory = undefined;
                for (var i = 0; i < menuItems.length; i++) {
                    if (+category === i) {
                        util.toggleClass(menuItems[i], 'selected', '');
                    } else {
                        util.toggleClass(menuItems[i], '', 'selected');
                    }
                }
                currentFilter = category;
                listCategories(currentFilter, domMain);
            }
        });
    }

    function listCategories(index, container) {
        container.innerHTML = '';
        var data = source[index].data;
        var maxAmount = -1;
        var bars = [];
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < data.length; i++) {
            var path = index + '-' + i;

            var div = document.createElement('div');
            div.className = 'category clearfix';
            div.setAttribute('category', i);
            setDisplayAttr(div, path, data[i].amount, data[i].change, data[i].name);

            var bar = document.createElement('div');
            bar.className = 'main';
            setDisplayAttr(bar, path, data[i].amount, data[i].change, data[i].name);
            bars.push(bar);
            div.appendChild(bar);
            div.insertAdjacentHTML('beforeend', util.format('<span class="title" path="{1}" _title="{2}">{0}</span>', data[i].name, path, data[i].name));

            fragment.appendChild(div);

            if (data[i].amount > maxAmount) {
                maxAmount = data[i].amount;
            }
            if (data[i].change > 0) {
                util.toggleClass(div, 'up', 'down');
            } else if (data[i].change < 0) {
                util.toggleClass(div, 'down', 'up');
            }
        }
        container.appendChild(fragment);
        var width = container.offsetWidth - 120;
        setTimeout(function() {
            for (var i = 0; i < bars.length; i++) {
                var w = data[i].amount / maxAmount * width;
                bars[i].style.width = ~~w + 'px';
                bars[i].style.backgroundColor = getColor(data[i].change);
            }
        }, 0);
    }

    function openCategory(level0, level1, container) {
        container.innerHTML = '';
        var maxAmount = -1;
        var bars = [];
        var fragment = document.createDocumentFragment();
        // var data = source[level0].data[level1].stocks;
        var data = currentCategory.stocks;
        for (var i = 0; i < data.length; i++) {
            var info = getStockInfo(data[i]),
                displayName = info.name + ' ' + info.code;
            var path = level0 + '-' + level1 + '-' + i;

            var div = document.createElement('div');
            div.className = 'stock clearfix';
            div.setAttribute('code', info.code);
            div.setAttribute('price', info.price);
            setDisplayAttr(div, path, info.amount, info.change, displayName);

            var bar = document.createElement('div');
            bar.className = 'main';
            setDisplayAttr(bar, path, info.amount, info.change, displayName);
            bar.setAttribute('price', info.price);
            bar.setAttribute('code', info.code);
            bars.push(bar);
            div.appendChild(bar);
            div.insertAdjacentHTML('beforeend', util.format('<span class="title">{0}</span>', info.name));

            fragment.appendChild(div);

            if (info.amount > maxAmount) {
                maxAmount = info.amount;
            }

            if (info.change > 0) {
                util.toggleClass(div, 'up', 'down');
            } else if (info.change < 0) {
                util.toggleClass(div, 'down', 'up');
            }
        }
        container.appendChild(fragment);
        var width = container.offsetWidth - 120;
        setTimeout(function() {
            for (var i = 0; i < bars.length; i++) {
                var info = getStockInfo(data[i]);
                var w = info.amount / maxAmount * width;
                bars[i].style.width = ~~w + 'px';
                bars[i].style.backgroundColor = getColor(info.change);
            }
        }, 0);
    }

    function getColor(change) {
        var r = 255,
            g = 255,
            b = 255;
        if (change >= 0) {
            g = r - r * change / 0.1;
            b = g;
        } else {
            r = g + g * change / 0.1;
            b = r;
        }
        return util.format('rgb({0}, {1}, {2})', ~~r, ~~g, ~~b);
    }

    function showDetail(info, location) {
        var tpl = ['<h3>{3}</h3>',
            '       <ul>',
            info.price !== null ? '<li class="point"><span class="column">当前价：</span><span class="value price">{0}</span></li>' : '',
            '           <li class="point"><span class="column">涨跌幅：</span><span class="value price">{1}%</span></li>',
            '           <li class="point"><span class="column">成交量：</span><span class="value">{2}万</span></li>',
            '       </ul>'
        ].join('');
        var content = util.format(tpl, info.price, (+info.change * 100).toFixed(1), (+info.amount).toFixed(2), info.title);
        var detailPanel = document.getElementById('detail');
        if (detailPanel) {
            detailPanel.style.display = 'block';
            detailPanel.style.left = location.x + 'px';
            detailPanel.style.top = location.y + 'px';
            detailPanel.innerHTML = content;
            if (info.change > 0) {
                util.toggleClass(detailPanel, 'up', 'down');
            } else if (info.change < 0) {
                util.toggleClass(detailPanel, 'down', 'up');
            } else {
                util.toggleClass(detailPanel, '', 'up');
                util.toggleClass(detailPanel, '', 'down');
            }
        }
    }

    function hideDetail() {
        var detailPanel = document.getElementById('detail');
        if (detailPanel) {
            detailPanel.style.display = 'none';
        }
    }

    function expand() {
        if (currentCategory !== undefined) {
            openCategory(currentFilter, currentCategory, domMain);
        } else {
            listCategories(currentFilter, domMain);
        }
    }

    function refreshData() {
        util.setLoading(true);
        loadData(currentFilter, function() {
            expand();
            document.getElementById('time').innerHTML = refreshTime;
            util.setLoading(false);
        });
    }

    function startTimer(interval) {
        refreshData();
        timer = setInterval(function() {
            refreshData();
        }, interval || 5000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function setup(navId, containerId) {
        var navbar = document.getElementById(navId),
            container = document.getElementById(containerId);
        domNav = navbar;
        domMain = container;
        buildNavigation(navbar, container);
        container.addEventListener('click', function(e) {
            var path = e.target.getAttribute('path');
            if (path !== undefined && path !== null) {
                var levels = path.split('-');
                if (levels.length === 2) {
                    currentFilter = levels[0];
                    currentCategory = source[levels[0]].data[levels[1]];
                    openCategory(levels[0], levels[1], container);
                }
            }
        });
        container.addEventListener('mouseover', function(e) {
            var price = e.target.getAttribute('price'),
                amount = e.target.getAttribute('amount'),
                change = e.target.getAttribute('change'),
                title = e.target.getAttribute('_title');
            if (change != null) {
                showDetail({
                    price: price,
                    amount: amount / 10000,
                    change: change,
                    title: title
                }, {
                    x: e.pageX + 50,
                    y: e.pageY - 50
                });
            }
        });
        container.addEventListener('mouseout', function(e) {
            hideDetail();
        });
        var btnUp = document.getElementById('btnUp'),
            btnRfresh = document.getElementById('btnRefresh'),
            sortBar = document.getElementById('sort');
        btnUp.addEventListener('click', function() {
            currentCategory = undefined;
            listCategories(currentFilter, domMain);
        });
        btnRfresh.addEventListener('click', function() {
            refreshData();
        });
        sortBar.addEventListener('click', function(e) {
            var order = 'asc',
                sortName = e.target.getAttribute('sort');
            if (sortName) {
                if (util.hasClass(e.target, 'asc')) {
                    util.toggleClass(e.target, 'desc', 'asc');
                    order = 'desc';
                } else {
                    util.toggleClass(e.target, 'asc', 'desc');
                    order = 'asc';
                }
                gSortName = sortName;
                gSortOrder = order;
                console.time('updateSource');
                updateSource(sortName, order);
                console.timeEnd('updateSource');
                console.time('expand');
                expand();
                console.timeEnd('expand');
            }
        });

        var autoChk = document.getElementById('auto');
        autoChk.addEventListener('click', function() {
            if(this.checked) {
                var freq = document.getElementById('freq').value;
                startTimer(freq * 1000);
            } else {
                stopTimer();
            }
        });
        var freqSelect = document.getElementById('freq');
        freqSelect.addEventListener('change', function() {
            stopTimer();
            startTimer(this.value * 1000);
        });
    }

    function getStockInfo(code) {
        var str = window['hq_str_' + code];
        if (str) {
            var parts = str.split(',');
            return {
                code: code,
                name: parts[0],
                price: +parts[3],
                lastPrice: +parts[2],
                change: (parts[3] - parts[2]) / parts[2],
                high: +parts[4],
                low: +parts[5],
                amount: +parts[9],
                time: parts[31]
            };
        }
        return {};
    }

    var tasks = 0;
    var domNav, domMain;
    var currentFilter = 0,
        currentCategory;
    var timer;
    var gSortName, gSortOrder;
    var refreshTime;
    /*
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

    function loadData(filter, callback) {
        filter = filter || 0;
        tasks = 0;
        var category = source[filter],
            data = category.data;
        for (var j = 0; j < data.length; j++) {
            var stocks = data[j].stocks;
            var url = 'http://hq.sinajs.cn/list=';
            for (var k = 0; k < stocks.length; k++) {
                var code = stocks[k].toLowerCase();
                url += code + ',';
            }
            (function(url, contents) {
                util.loadScript(url, function() {
                    ++tasks;
                    if (tasks === data.length) {
                        if (callback) {
                            updateSource(gSortName, gSortOrder);
                            callback();
                        }
                    }
                });
            })(url, data[j]);
        }
        // sortCategories(data);
    }

    function sortStocks(stocks, sortName, sortOrder) {
        stocks.sort(function(a, b) {
            var infoA = getStockInfo(a),
                infoB = getStockInfo(b);
            var ret = infoA[sortName] - infoB[sortName];
            return sortOrder == 'asc' ? ret : -ret;
        });
    }

    function sortCategories(categories, sortName, sortOrder) {
        categories.sort(function(a, b) {
            var ret = a[sortName] - b[sortName];
            return sortOrder == 'asc' ? ret : -ret;
        });
    }

    function updateSource(sortName, sortOrder) {
        sortName = sortName || 'amount';
        sortOrder = sortOrder || 'desc';
        for (var i = 0; i < source.length; i++) {
            var data = source[i].data;
            for (var j = 0; j < data.length; j++) {
                var contents = data[j],
                    stocks = contents.stocks,
                    sum = 0,
                    lastTotal = 0,
                    currentTotal = 0;
                for (var k = 0; k < stocks.length; k++) {
                    var code = stocks[k],
                        info = getStockInfo(code);
                    sum += info.amount;
                    lastTotal += info.lastPrice;
                    currentTotal += info.price;
                    contents.amount = sum;
                    contents.change = (currentTotal - lastTotal) / lastTotal;
                    refreshTime = info.time;
                }
                sortStocks(stocks, sortName, sortOrder);
            }
            sortCategories(data, sortName, sortOrder);
        }
    }

    return {
        setup: function(autoRefresh, interval) {
            setup('nav', 'content');
            if (autoRefresh) {
                startTimer(interval);
            }
            refreshData();
        },
        setInterval: function(interval) {
            stopTimer();
            startTimer(interval);
        },
        getStockInfo: getStockInfo,

        loadData: loadData
    };
});