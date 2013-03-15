(function($) {

    $.fn.jQwilio = function(options){

        var defaults = {
            token: "",
            onReady: function(){},
            onIncoming: function(){}
        };

        var config = $.extend({}, defaults, options);



        var ready = false;

        this.connection = undefined;

        this.init = function(token) {
            this.config.token = token;

            var fileref=document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.onload = function() {
                $(document).trigger("twilio.jsloaded");
            }
            fileref.setAttribute("src", "//static.twilio.com/libs/twiliojs/1.1/twilio.min.js");
            document.getElementsByTagName("head")[0].appendChild(fileref);

        }

        $(document).on("twilio.jsloaded", function() {
            Twilio.Device.setup(this.config.token);
            Twilio.Device.ready(function() {
                ready = true;
                $(document).trigger("twilio.ready");
                if (options.onReady !== undefined && typeof options.onReady === "function") options.onReady(this);
            });
            Twilio.Device.incoming(function(connection) {
                this.connection = connection;
                $(document).trigger("twilio.incoming", connection);

                if (options.onIncoming !== undefined && typeof options.onIncoming === "function") options.onIncoming(connection);

            });
        })

        this.ready = function(fn) {
            if (ready) return fn();
            $(document).on("twilio.ready", fn);
        }

        this.dial = function(params) {
            this.connection = Twilio.Device.connect(params);
        }

        return this;
    }

})(jQuery);
