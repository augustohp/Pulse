define(function() {
    var Log = function(options) {
        var self     = this;
        options      = options || {};
        self.debug   = options.debug || false;
        self.TAG     = options.TAG || "";
        
        self.debug = function() {
            if ( ! self.debug ) return;
            arguments.callee = arguments.callee.caller;  
            if ( ! window.console ) return;
            for (_s=0; _s<arguments.length; _s++)
                window.console.log(self.TAG+" "+arguments[_s]);
        };
    };
    
    return Log;
});