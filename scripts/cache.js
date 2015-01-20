define(['./helper/util'], function(util) {

    var dataSource = null;
    var panel = null;

    var tpl = ['<ul class="row">',
        '  <li class="grid span2">',
        '  {0}',
        '  </li>',
        '  <li class="grid span2">',
        '    <input type="text" value="{code}">',
        '  </li>',
        '  <li class="grid span2">',
        '    <span class="name">{name}',
        '    </span>',
        '  </li>',
        '  <li class="grid span2">',
        '    <input type="text" value="{shares}">',
        '  </li>',
        '  <li class="grid span2">',
        '    <input type="text" value="{totalRewardRate}">',
        '  </li>',
        '  <li class="grid span2">',
        '    <i type="button" index="{code}" action="remove" class="action remove"></i>',
        '  </li>',
        '</ul>'
    ].join('');

    function bindEvents(panel) {
        panel.addEventListener('click', function(e) {
            var action = e.target.getAttribute('action');
            if (action) {
                var handlers = {
                    'add': function() {
                        var recordsPart = document.getElementById('records');
                        var html = util.format(tpl, {
                            code: '',
                            name: '',
                            shares: '',
                            totalRewardRate: ''
                        }, '');
                        recordsPart.insertAdjacentHTML('beforeend', html);
                    },
                    'remove': function() {
                        var row = e.target.parentNode.parentNode,
                            parent = row.parentNode,
                            index = e.target.getAttribute('index');
                        parent.removeChild(row);
                        dataSource.splice(index, 0);
                    },
                    'save': function() {
                        if (localStorage) {
                            localStorage.setItem('fund', JSON.stringify(dataSource));
                        } else {
                            var today = new Date(),
                                year = today.getFullYear();
                            util.setCookie('fund', JSON.stringify(dataSource), today.setFullYear(year + 1));
                        }
                    }
                };
                var handler = handlers[action];
                if (handler) {
                    handler();
                }
            }
        });
    }

    function closePanel() {
        panel.style.display = 'none';
    }

    function openPanel(funds, stocks) {
        dataSource = funds;
        var panelId = 'dataPanel';
        // var panel = document.getElementById(panelId);
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'dataPanel';
            panel.className = 'panel';
            document.body.appendChild(panel);

            var recordsPart = document.createElement('div');
            recordsPart.id = 'records';
            recordsPart.className = 'center';
            var html = ['<ul class="row">',
                '  <li class="grid span2">',
                '  </li>',
                '  <li class="grid span2">',
                '    <span class="item">',
                '      代码',
                '    </span>',
                '  </li>',
                '  <li class="grid span2">',
                '    <span class="item">',
                '      名称',
                '    </span>',
                '  </li>',
                '  <li class="grid span2">',
                '    <span class="item">',
                '      份额',
                '    </span>',
                '  </li>',
                '  <li class="grid span2">',
                '    <span class="item">',
                '      当前收益',
                '    </span>',
                '  </li>',
                '  <li class="grid span2">',
                '  </li>',
                '</ul>'
            ].join('');

            for (var i = 0; i < funds.length - 1; i++) {
                var fund = funds[i];
                html += util.format(tpl, fund, '');
            }
            recordsPart.innerHTML = html;
            panel.appendChild(recordsPart);

            var toolbar = ['<ul class="row last">',
                '  <li class="grid span4">',
                '    <i type="button" action="add" class="action add"></i>',
                '  </li>',
                '  <li class="grid span4">',
                '    <input type="button" value="Save" action="save">',
                '  </li>',
                '  <li class="grid span4">',
                '  </li>',
                '</ul>'
            ].join('');


            var footer = document.createElement('div');
            footer.className = 'center';
            footer.innerHTML = toolbar;
            panel.appendChild(footer);
            bindEvents(panel);
        }
        panel.style.display = 'block';
    }
    return {
        openPanel: openPanel
    };
});
