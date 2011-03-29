/**
 * Basic game engine implementation.
 * Handles keyboard bindings and frame randering cycles.
 *
 * TODO Remove player actions from this module (shame on me)
 * @package Pulse
 * @author Augusto Pascutti <augusto@phpsp.org.br>
 */
define(['library/mapper', 'library/frame', 'library/jquery', 'library/keyboard', 'library/player', 'library/log'], function(Map, Frame, $, Keyboard, Player, Logger) {
    
    var Game = function(options) {
        var self              = this;
        var $$                = undefined;
        options               = options || {};
        var Log               = new Logger({"TAG":"[Engine]", "debug":options.debug});
        self._scale           = options.scale || 1;
        self._canvasElementId = options.canvasElementId || undefined;
        self._canvasElement   = undefined;
        self._context         = undefined;
        self._framerate       = undefined;
        self._map             = options.map || undefined;
        self._keyboard        = undefined;
        self._debug           = options.debug || false;
        self._startPoint      = options.startPoint || [0,0];
        self.player           = undefined;
        /**
         * Inits the game engine.
         */
        self._init = function() {
            Log.debug('Initializing ...');
            self._initCanvas();
            self._initKeyboard();
            self._initPlayer();
            self._initFrames();
        };
        /**
         * Initilizes canvas element.
         */
        self._initCanvas = function() {
            Log.debug('Init canvas');
            if ( ! self._map )
                throw new Error("No map set.");
            self._canvasElement = $('#'+self._canvasElementId).get(0);
            if (!self._canvasElement)
                throw new Error("Invalid canvas element ...");
            self._context  = $$ = new Map({"map":self._map, "containerElement":self._canvasElementId, "scale": self._scale, "debug":self._debug});
        };
        /**
         * Initilizes keyboard bindings.
         */
        self._initKeyboard = function() {
            Log.debug('Init keyboard events');
            self._keyboard = new Keyboard({"debug": self.debug});
        };
        /**
         * Initilizes framerate handling.
         */
        self._initFrames = function() {
            Log.debug("Init framerate controller");
            self._framerate = new Frame();
            self._framerate.addCallback(function(delta) {
                $$.drawMap();
                self.player.update().draw($$.getCanvas());
            });
        };
        /**
         * Initilizes player.
         */
        self._initPlayer = function() {
            Log.debug("Init player");
            self.player = new Player({"x":self._startPoint[0], "y":self._startPoint[1]});
            self.key(['UP','w'], function() { self.player.acelerate(); },self._keyboard.KEYDOWN);
            self.key(['DOWN','s'], function() { self.player.reverse(); },self._keyboard.KEYDOWN);
            self.key(['LEFT','a'], function() { self.player.left(); }, self._keyboard.KEYDOWN);
            self.key(['RIGHT','d'], function() { self.player.right(); }, self._keyboard.KEYDOWN);
            self.key(['UP','w','DOWN','s'], function() { self.player.break(); },self._keyboard.KEYUP);
            self.key(['LEFT','a','RIGHT','d'], function() { self.player.still(); }, self._keyboard.KEYUP);
            self.player.draw($$.getCanvas());
        };
        /**
         * Returns the width with the given scale.
         */
        self.getWidth = function() {
            return $$.width;
        };
        /**
         * Returns the height with the given scale.
         */
        self.getHeight = function() {
            return $$.height;
        };
        /**
         * Bind a key event to a calback function.
         */
        self.key = function(key, callback, ev) {
            self._keyboard.bind(key, callback, ev);
        };
        /**
         * Runs the game.
         */
        self.run = function() {
            self._framerate.run();
        }
        
        self._init();
    };
    
    return Game;
});