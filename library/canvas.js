/**
 * canvas.js
 * Canvas helper module
 *
 * TODO rename 'fill' and 'stroke' properties to use this namespace as functions instead of endStroke() and endFill();
 * @package Pulse
 * @author Augusto Pascutti
 */
define(["library/jquery", 'library/log'], function($, Logger) {
    var Canvas = function(options) {
        var self         = this;
        var $$           = undefined; // Context alias
        options          = options || {};
        self.containerId = options.containerId || undefined;
        self.container   = undefined;
        self.context     = null;
        self.scale       = parseInt(options.scale,10) || 1;
        self.width       = parseInt(options.width, 10) || 50;
        self.height      = parseInt(options.height, 10) || 50;
        self.stroke      = this._stroke      = options.stroke || "#000000";
        self.strokeWidth = this._strokeWidth = options.strokeWidth || 1;
        self.fill        = this._fill        = options.fill   || "#000000";
        self.logLevel    = options.level || 0 ;
        var Log          = new Logger({"level": self.logLevel});
        
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
         * Defines the width;
         */
        this.setWidth = function(w) {
            self.width                 = w;
            w                          = self.getUnit(w);
            self.container.style.width = w+'px';
            self.container.width       = w;
        };
        this.setHeight = function(h) {
            self.height                 = h;
            h                           = self.getUnit(self.height);
            self.container.style.height = h+'px';
            self.container.height       = h;
        };
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
            self.container = document.getElementById(self.containerId);
            self.setWidth(self.width);
            self.setHeight(self.height);
            
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
            self.endFill();
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
            fromX = self.getUnit(fromX); fromY = self.getUnit(fromY);
            toX = self.getUnit(toX); toY = self.getUnit(toY);
            Log.debug("Drawing line from "+fromX+","+fromY+" to "+toX+","+toY);
            $$.moveTo(fromX, fromY);
            $$.lineTo(toX, toY);
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
            fromX = self.getUnit(fromX); fromY = self.getUnit(fromY);
            width = self.getUnit(width); height = self.getUnit(height);
            Log.debug('Drawing rectangle from '+fromX+","+fromY+" with "+width+","+height);
            $$.strokeRect(fromX, fromY, width, height);
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
            fromX = self.getUnit(fromX); fromY = self.getUnit(fromY);
            width = self.getUnit(width); height = self.getUnit(height);
            Log.debug('Drawing a filled rectangle from'+fromX+","+fromY+" with "+width+","+height);
            $$.fillRect(fromX, fromY, width, height);
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