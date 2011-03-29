/**
 * Framerate implementation.
 *
 * @package Pulse
 * @author Augusto Pascutti <augusto@phpsp.org.br>
 */
define(function() {
    /**
     * Returns difference between the given date and now.
     */
    Date.prototype.delta = function() {
        now = new Date().getTime();
        return now-this.getTime();
    };
    
    var Frame = function(options) {
        var self        = this;
        options         = options || {};
        self.fps        = options.fps || 30;
        self._timeout   = 0;
        self._frames    = 0;
        self._lastFrame = new Date();
        self._callbacks = [];

        self.emptyCallbacks = function() {
            self._callbacks = [];
        };
        
        self.addCallback = function(c) {
            self._callbacks.push(c);
        };
        
        self.runCallbacks = function(delta) {
            for(_c=0; _c<self._callbacks.length; _c++)
                self._callbacks[_c](delta);
        };
        
        self.setFps = function(seconds) {
            self.fps      = parseInt(seconds, 10);
            self._timeout = 1000/self.fps;
        };
        
        self._update = function() {
            delta           = self._lastFrame.delta();
            self._lastFrame = new Date(self._lastFrame.getTime()+delta);
            if ( delta > self._timeout ) // Compensate rendering time loss ...
                delta = Math.max(1, self._timeout - (delta-self._timeout));
            self._frames++;
            self.runCallbacks(delta);
            setTimeout(self._update, 1000/self.fps);
        };
        
        self.run = function() {
            self._update();
        }
        
        self.setFps(self.fps);
    };
    
    return Frame;
});