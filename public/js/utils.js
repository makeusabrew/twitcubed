var Utils = (function() {

    return {
        textToCanvas: function(options) {
            var x = document.createElement('canvas');
            var xc = x.getContext('2d');
            x.width = options.width;
            x.height = options.height;
            xc.fillStyle = options.colour;
            xc.font = options.fontHeight + "px " + options.font;

            //@TODO sort out this mess. I mean seriously, wtf?
            var words = options.text.split(" ");
            console.log(options.text);
            var lineStr = words.shift();
            var lines = [];
            //[this, would, be, a, really, long, tweet, we'd, have, to, break, up
            for (var i = 0, l = words.length; i < l; i++) {

                var newStr = lineStr + " " + words[i];

                if (xc.measureText(newStr).width <= options.width) {
                    // okay, we can append this word - add it and keep looping
                    lineStr = newStr;
                } else {
                    // too big. don't append, add to line stack
                    lines[lines.length] = {
                        "text": lineStr,
                        "width": xc.measureText(lineStr).width
                    };

                    // stick the new word at the start of the next line
                    lineStr = words[i];
                }
            }
            if (lineStr.length) {
                lines[lines.length] = {
                    "text": lineStr,
                    "width": xc.measureText(lineStr).width
                };
            }
            /*
            do {
                
            var uWidth = xc.measureText(options.text);
            var cString = options.text;
            var lines = [];
            var words = cString.split(" ");
            var str = cString;

            do {
                var popped = [];
                while (uWidth.width > options.width && words.length > 1) {
                    popped.unshift(words.pop());
                    str = words.join(" ");
                    uWidth = xc.measureText(str);
                }

                lines.push({
                    "text": str,
                    "width": uWidth.width
                });

                cString = popped.join(" ");
                words = cString.split(" ");
                uWidth = xc.measureText(cString);
            } while (uWidth.width > options.width && words.length > 1);
            */

            console.log(lines);
            
            var height = lines.length * options.fontHeight;
            var yOffset = (options.height - height);
            for (var i = 0; i < lines.length; i++) {
                var offset = (options.width - lines[i].width) / 2;
                xc.fillText(lines[i].text, offset, (i*options.fontHeight) + yOffset);
            }
            return x;
        },

        deg2rad: function(x) {
            return x * 0.0174532925;
        }
    };

})();
