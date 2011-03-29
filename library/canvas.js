/**
 * canvas.js
 * Canvas helper module
 *
 * TODO rename 'fill' and 'stroke' properties to use this namespace as functions instead of endStroke() and endFill();
 * @package Pulse
 * @author Augusto Pascutti
 */
define(["library/jquery"], function($) {
    var Canvas = function(options) {
        var self         = this;
        var $$           = undefined; // Context alias
        options          = options || {};
        this.containerId = options.containerId || undefined;
        this.container   = undefined;
        this.context     = null;
        this.scale       = parseInt(options.scale,10) || 1;
        this.width       = parseInt(options.width, 10) || 50;
        this.height      = parseInt(options.height, 10) || 50;
        this.stroke      = this._stroke      = options.stroke || "#000000";
        this.strokeWidth = this._strokeWidth = options.strokeWidth || 1;
        this.fill        = this._fill        = options.fill   || "#000000";
        this.debug       = options.debug || false;
        /**
         * Log utility. (paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/)
         */
        this.log = function() {
            self.log.history = self.log.history || [];   // store logs to an array for reference
            self.log.history.push(arguments);
            arguments.callee = arguments.callee.caller;  
            if(!self.debug) return;
            if(window.console) window.console.log( Array.prototype.slice.call(arguments) );
        }
        /**
         * Returns the unit to draw a point in the canvas.
         *
         * @param int u
         * @param string[optional] prepend Prepends this string to the return value
         * return int|string
         */
        this.getUnit = function(u, prepend) {
            x = u*self.scale;
            if ( prepend )
                return x+prepend;
            return x;
        }
        /**
         * Returns the width in the correct scale.
         */
        this.getWidth = function() { return self.getUnit(self.width); }
        /**
         * Returns the height in the corect scale.
         */
        this.getHeight = function() { return self.getUnit(self.height); }
        /**
         * Inits the canvas and the context.
         */
        this._init = function() {
            if ( ! self.containerId )
                throw new Error("Container element not defined, please especify it in options.");
            self.container = $('#'+self.containerId).get(0);
            w = self.getUnit(self.width);
            h = self.getUnit(self.height);
            $(self.container).width(w+'px').attr('width', w);
            $(self.container).height(h+'px').attr('height', h);
            
            if ( ! self.containerId )
                throw new Error("Container could not be initialized.");
            if ( ! self.container || ! self.container.getContext )
                throw new Error("The container element is not a valid canvas element. (Does this browser really supports canvas?)");
            $$ = self.context = self.container.getContext('2d');
            self.emptyContext();
        };
        /**
         * Sets fill color.
         */
        this.setFill = function(f) { 
            if ( f )
                self._fill = self.fill;
            f            = f || self.fill;
            self.fill    = $$.fillStyle = f;
            $$.fillStyle = self.fill;
        };
        /**
         * Sets stroke color.
         */
        this.setStroke = function(s, w) {
            if ( s )
                self._stroke = self.stroke;
            if ( w )
                self._strokeWidth = self.strokeWidth;
            s                = s || self.stroke;
            w                = w || self.strokeWidth;
            self.stroke      = $$.strokeStyle = s;
            self.strokeWidth = $$.lineWidth   = w;
            $$.strokeStyle   = self.stroke;
            $$.lineWidth     = self.strokeWidth;
        };
        /**
         * Resets colors and line width.
         */
        this.reset = function() { 
            this.setFill(self._fill); 
            this.setStroke(self._stroke, self._strokeWidth);
        };
        /**
         * Draws a blank canvas.
         */
        this.emptyContext = function() {
            self.setFill('#FFF');
            self.rect(0, 0, self.width, self.height);
            self.reset();
        };
        this.beginPath = function() {
            $$.beginPath();
        };
        this.closePath = function() {
            $$.closePath();
        };
        this.endStroke = function() {
            $$.stroke();
        }
        this.endFill = function() {
            $$.fill();
        }
        /**
         * Draws a line.
         */
        this.line = function(fromX, fromY, toX, toY, color) {
            if ( color )
                self.setStroke(color);
            self.log("Drawing line from "+self.getUnit(fromX)+","+self.getUnit(fromY)+" to "+self.getUnit(toX)+","+self.getUnit(toY));
            $$.moveTo(self.getUnit(fromX), self.getUnit(fromY));
            $$.lineTo(self.getUnit(toX), self.getUnit(toY));
            if ( color )
                self.reset();
            return self;
        };
        /**
         * Draws a rectangle
         */
        this.rect = function(fromX, fromY, width, height) {
            width  = width || 1;
            height = height || width;
            self.log('Drawing rectangle from'+self.getUnit(fromX)+","+self.getUnit(fromY)+" with "+self.getUnit(width)+","+self.getUnit(height));
            $$.strokeRect(self.getUnit(fromX), self.getUnit(fromY), self.getUnit(width), self.getUnit(height));
            return self;
        };
        /**
         * Draws a filled rectangle.
         */
        this.rectFill = function(fromX, fromY, width, height, fill) {
            if ( fill )
                self.setFill(fill);
            width  = width || 1;
            height = height || width;
            self.log('Drawing a filled rectangle from'+self.getUnit(fromX)+","+self.getUnit(fromY)+" with "+self.getUnit(width)+","+self.getUnit(height));
            $$.fillRect(self.getUnit(fromX), self.getUnit(fromY), self.getUnit(width), self.getUnit(height));
            if ( fill )
                self.reset();
            return self;
        };
        /**
         * Returns the grid position on wich the current event was triggered
         *
         * @param MouseEvent event
         * @return [x,y]
         */
        this.gridMousePos = function(event) {
            offset = $(self.container).offset();
            x      = Math.floor((event.pageX - offset.left)/self.scale);
            y      = Math.floor((event.pageY - offset.top)/self.scale);
            function Position(x,y) {
                this.x = x;
                this.y = y;
            }
            return new Position(x,y);
        };
        this._init();
    };
    
    return Canvas;
});