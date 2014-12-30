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
        }
    };
});