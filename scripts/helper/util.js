define(function() {

    function format() {
        if (arguments.length === 0) {
            return '';
        }
        var formatStr = arguments[0];
        var args = [].slice.call(arguments, 1);
        for (var i = 0; i < args.length; i++) {
            formatStr = formatStr.replace('{' + i + '}', args[i]);
        }
        return formatStr;
    }

    return {
        loadScript: function(url, callback) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            script.onreadystatechange = script.onload = function() {
                // Remove the script
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
                if (callback) {
                    callback();
                }
            };

            if (script.addEventListener) {
                script.addEventListener('error', function() {
                    if (callback) {
                        callback();
                    }
                });
            }

            // Fire the loading
            head.appendChild(script);
        },

        format: format,

        setLoading: function(loading) {
            var mask = document.getElementById('mask');
            mask.style.display = loading ? 'block' : 'none';
        },

        hasClass: function(dom, cls) {
            return dom.className.indexOf(cls) > -1;
        },

        addClass: function(dom, cls) {
            var arr = dom.className.split(' ');
            if (dom.className.indexOf(add) < 0) {
                arr.push(cls);
            }
            dom.className = arr.join(' ');
        },

        removeClass: function(dom, cls) {
            dom.className = dom.className.replace(new RegExp(remove, 'g'), '');
        },

        toggleClass: function(dom, add, remove) {
            if (remove) {
                // dom.classList.remove(remove);
                dom.className = dom.className.replace(new RegExp(remove, 'g'), '');
            }
            if (add) {
                // add && dom.classList.add(add);
                var arr = dom.className.split(' ');
                if (dom.className.indexOf(add) < 0) {
                    arr.push(add);
                }
                dom.className = arr.join(' ');
            }
        },

        notify: function(args) {
            if (!Notification) {
                alert('Please us a modern version of Chrome, Firefox, Opera or Firefox.');
                return;
            }

            if (Notification.permission !== "granted")
                Notification.requestPermission();

            var notification = new Notification(args.title || '', {
                icon: args.icon,
                tag: args.tag,
                body: args.body,
            });


            notification.onclick = function() {
                // window.open("http://stackoverflow.com/a/13328397/1269037");
                if (args.onclick) {
                    args.onclick();
                }
            };
            if (args.duration) {
                setTimeout(function() {
                    notification.close();
                }, args.duration);
            }
        },

        setCookie: function(name, value) {
            var argv = arguments,
                argc = arguments.length,
                expires = (argc > 2) ? argv[2] : null,
                path = (argc > 3) ? argv[3] : '/',
                domain = (argc > 4) ? argv[4] : null,
                secure = (argc > 5) ? argv[5] : false;
            document.cookie = name + "=" + escape(value) + ((expires === null) ? "" : ("; expires=" + expires.toGMTString())) + ((path === null) ? "" : ("; path=" + path)) + ((domain === null) ? "" : ("; domain=" + domain)) + ((secure === true) ? "; secure" : "");
        },

        getCookie: function(name) {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var parts = cookies[i].split('='),
                    key = parts[0],
                    value = parts[1];
                if(parts.length > 2) {
                    value = parts.slice(1).join('=');
                }
                if(key === name) {
                    return value;
                }
            }
            return null;

            //version 2
            // var reg = new RegExp(name + '=.*?(;|$)');
            // var match = document.cookie.match(reg);
            // if(match) {
            //     var parts = match[0].split('='),
            //         target = parts[1];
            //     if(parts.length > 2) {
            //         target = parts.slice(1).join('=');
            //     }
            //     return target.replace(';', '');
            // }
            // return null;
        }
    };
});
