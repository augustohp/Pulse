/**
 * Key bindgins helper.
 *
 * TODO better key mapping
 * @package Pulse
 * @author Augusto Pascutti <augusto@phpsp.org.br>
 */
define(['library/jquery', 'library/log'], function($, Logger) {
    var KEYDOWN = 'down';
    var KEYUP   = 'up';
    
    /**
     * Key binding class.
     */
    var Binding = function(keys, callback, ev) {
        var self      = this;
        self.keys     = keys;
        self.callback = callback;
        self.events   = ev || [KEYDOWN, KEYUP];
        /**
         * Returns if the given key code refers to this binding.
         *
         * @return Boolean
         */
        self.isKey = function(k) {
            return ( this.keys[k] >= 0 );
        };
        /**
         * Returns if the current event is associated with this binding.
         *
         * @return Boolean
         */
        self.isEvent = function(e) {
            return ( this.events.indexOf(e) >= 0 );
        };
        /**
         * Executes the callback associated with this binding if the given key code
         * corresponds to this binding.
         */
        self.callFor = function(e, k) {
            if ( this.isEvent(e) ) 
                if ( this.isKey(k) )
                    this.run();
        };
        /**
         * Runs the callback.
         */
        self.run = function() {
            this.callback.call();
        }
        /**
         * Inits object.
         */
        self._init = function() {
            if ( ! self.keys instanceof Array )
                self.keys = [self.keys];
            if ( ! self.events instanceof Array )
                self.events = [self.events];
            self.keys.forEach(function(k) {
                self.keys[k] = k;
            });
        };
        this._init();
    };
    
    /**
     * Keyboard handling events class.
     */
    var Keyboard = function(options) {
        var self       = this;
        options        = options || {};
        var Log        = new Logger({"TAG":"[Keyboard]", "debug":options.debug});
        self.debug     = options.debug || false;
        self.mapping   = [];
        self._bindings = [];
        self._all      = undefined;
        
        self.KEYDOWN     = KEYDOWN;
        self.KEYUP       = KEYUP;
        
        self.mapping[87] = 'w';
        self.mapping[65] = 'a';
        self.mapping[83] = 's';
        self.mapping[68] = 'd';
        self.mapping[80] = 'p';
        self.mapping[38] = 'UP';
        self.mapping[37] = 'LEFT';
        self.mapping[40] = 'DOWN';
        self.mapping[39] = 'RIGHT';
        self.mapping[32] = 'SPACE';
        
        /**
         * Binds the events to the document object.
         */
        self._bindEvents = function() {
            Log.debug("Binding events ...");
            $(document).keydown(function(e) {
                key = e.which;
                self._runAll(e);
                for(__b=0; __b<self._bindings.length; __b++)
                    self._bindings[__b].callFor(self.KEYDOWN,key);
            });
            $(document).keyup(function(e) {
                key = e.which;
                self._runAll(e);
                for(__b=0; __b<self._bindings.length; __b++)
                    self._bindings[__b].callFor(self.KEYUP,key);
            });
        };
        /**
         * Initializes this object.
         */
        self._init = function() {
            self._bindEvents();
        };
        /**
         * Returns the key code by name.
         */
        self.getKey = function(name) {
            for (_m=0; _m<self.mapping.length; _m++)
                if (self.mapping[_m] && self.mapping[_m] == name)
                    return _m;
        };
        /**
         * Binds event to the given key.
         */
        self.bind = function(keyName, callback, ev) {
            Log.debug(ev);
            if ( keyName instanceof Array ) {
                key = [];
                for (_k=0; _k<keyName.length; _k++) {
                    _key = self.getKey(keyName[_k]);
                    if ( ! _key ) throw new Error("Key "+keyName[_k]+" not found!");
                    key.push(_key);
                }
            } else {
                key = self.getKey(keyName);
                if ( ! key ) throw new Error("Key "+keyName+" not found!");
            }
            b = new Binding(key, callback, ev);
            self._bindings.push(b);
        };
        self._runAll = function(e) {
            if ( self._all )
                self._all.call(self._all, e);
        }
        self.all = function(callback) {
            self._all = callback;
        };
        self._init();
    };
    
    return Keyboard;
});