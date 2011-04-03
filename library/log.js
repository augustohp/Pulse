define(function() {
    /*!
     * JavaScript Debug - v0.4 - 6/22/2010
     * http://benalman.com/projects/javascript-debug-console-log/
     * 
     * Copyright (c) 2010 "Cowboy" Ben Alman
     * Dual licensed under the MIT and GPL licenses.
     * http://benalman.com/about/license/
     * 
     * With lots of help from Paul Irish!
     * http://paulirish.com/
     */
    window.debug = (function(){
      var window = this,

        // Some convenient shortcuts.
        aps = Array.prototype.slice,
        con = window.console,

        // Public object to be returned.
        that = {},

        callback_func,
        callback_force,

        // Default logging level, show everything.
        log_level = 9,

        // Logging methods, in "priority order". Not all console implementations
        // will utilize these, but they will be used in the callback passed to
        // setCallback.
        log_methods = [ 'error', 'warn', 'info', 'debug', 'log' ],

        // Pass these methods through to the console if they exist, otherwise just
        // fail gracefully. These methods are provided for convenience.
        pass_methods = 'assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace'.split(' '),
        idx = pass_methods.length,

        // Logs are stored here so that they can be recalled as necessary.
        logs = [];

      while ( --idx >= 0 ) {
        (function( method ){

          // Generate pass-through methods. These methods will be called, if they
          // exist, as long as the logging level is non-zero.
          that[ method ] = function() {
            log_level !== 0 && con && con[ method ]
              && con[ method ].apply( con, arguments );
          }

        })( pass_methods[idx] );
      }

      idx = log_methods.length;
      while ( --idx >= 0 ) {
        (function( idx, level ){

          // Method: debug.log
          // 
          // Call the console.log method if available. Adds an entry into the logs
          // array for a callback specified via <debug.setCallback>.
          // 
          // Usage:
          // 
          //  debug.log( object [, object, ...] );                               - -
          // 
          // Arguments:
          // 
          //  object - (Object) Any valid JavaScript object.

          // Method: debug.debug
          // 
          // Call the console.debug method if available, otherwise call console.log.
          // Adds an entry into the logs array for a callback specified via
          // <debug.setCallback>.
          // 
          // Usage:
          // 
          //  debug.debug( object [, object, ...] );                             - -
          // 
          // Arguments:
          // 
          //  object - (Object) Any valid JavaScript object.

          // Method: debug.info
          // 
          // Call the console.info method if available, otherwise call console.log.
          // Adds an entry into the logs array for a callback specified via
          // <debug.setCallback>.
          // 
          // Usage:
          // 
          //  debug.info( object [, object, ...] );                              - -
          // 
          // Arguments:
          // 
          //  object - (Object) Any valid JavaScript object.

          // Method: debug.warn
          // 
          // Call the console.warn method if available, otherwise call console.log.
          // Adds an entry into the logs array for a callback specified via
          // <debug.setCallback>.
          // 
          // Usage:
          // 
          //  debug.warn( object [, object, ...] );                              - -
          // 
          // Arguments:
          // 
          //  object - (Object) Any valid JavaScript object.

          // Method: debug.error
          // 
          // Call the console.error method if available, otherwise call console.log.
          // Adds an entry into the logs array for a callback specified via
          // <debug.setCallback>.
          // 
          // Usage:
          // 
          //  debug.error( object [, object, ...] );                             - -
          // 
          // Arguments:
          // 
          //  object - (Object) Any valid JavaScript object.

          that[ level ] = function() {
            var args = aps.call( arguments ),
              log_arr = [ level ].concat( args );

            logs.push( log_arr );
            exec_callback( log_arr );

            if ( !con || !is_level( idx ) ) { return; }

            con.firebug ? con[ level ].apply( window, args )
              : con[ level ] ? con[ level ]( args )
              : con.log( args );
          };

        })( idx, log_methods[idx] );
      }
    })();
    
    
    
    
    var Log = function(options) {
        var self      = this;
        var con       = window.console;
        options       = options || {};
        self._debug   = options.debug || false;
        self.level    = options.level || 0;
        self.levels   = ['error','warn','info','debug'];
        self._methods = ['group']
        self.levels.forEach(function(level, priority) {
            self[level] = function() {
                args = Array.prototype.slice.call(arguments);
                if ( self.level >= priority && con && con[level] )
                    con[level].apply(con,args);
            }
        });
        /*
        self.debug = function() {
            if ( ! self._debug ) return;
            arguments.callee = arguments.callee.caller;  
            if ( ! window.console ) return;
            for (_s=0; _s<arguments.length; _s++)
                window.console.log(arguments[_s]);
        };
        */
    };
    
    return Log;
});