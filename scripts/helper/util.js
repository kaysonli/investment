define(function() {
    return {
        loadScript: function(url, callback) {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            script.onreadystatechange = callback;
            script.onload = callback;

            // Fire the loading
            head.appendChild(script);
        },
        format: function() {
            if (arguments.length === 0) {
                return '';
            }
            var formatStr = arguments[0];
            var args = [].slice.call(arguments, 1);
            for (var i = 0; i < args.length; i++) {
                formatStr = formatStr.replace('{' + i + '}', args[i]);
            }
            return formatStr;
        },

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
        notify: function(title, body, duration) {
            if (!Notification) {
                alert('Please us a modern version of Chrome, Firefox, Opera or Firefox.');
                return;
            }

            if (Notification.permission !== "granted")
                Notification.requestPermission();

            var notification = new Notification(title || '', {
                // icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
                width: 90,
                tag: 'quotation',
                body: body,
            });


            notification.onclick = function() {
                // window.open("http://stackoverflow.com/a/13328397/1269037");
            };

            setTimeout(function() {
                // notification.close();
            }, duration || 2000);
        }
    };
});
