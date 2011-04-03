define(["library/log"], function(Logger) {
    var Player = function(options) {
        var self           = this;
        options            = options || {};
        options.level      = options.level || 0;
        var Log            = new Logger({"TAG":"[Player]", "level":options.level});
        self.x             = options.x || 0; // current x position
        self.y             = options.y || 0; // current y position
        self.a             = 0;              // current angle looking
        self.moving        = 0;
        self.speed         = options.speed || 0.5;
        self.speedRotation = options.speedRotation || 8;
        self.direction     = 0;
        self.map           = options.map || undefined;
        
        self._init = function() {
            self.setSpeedRotation(self.speedRotation);
        };
        
        self.isMovingLeft = function() {
            return (self.direction == -1);
        };
        
        self.isMovingRight = function() {
            return (self.direction == 1);
        };
        
        self.isStill = function() {
            return (self.direction == 0);
        };
        
        self.setSpeed = function(s) {
            self.speed = s;
        }
        
        self.setSpeedRotation = function(s) {
            self.speedRotation = s * (Math.PI/180);
        };
        
        self.left = function() {
            Log.debug("Moving left");
            self.direction = -1;
        };
        
        self.right = function() {
            Log.debug("Moving right");
            self.direction = 1;
        };
        
        self.still = function() {
            Log.debug("Stay still (stoped rotation)");
            self.direction = 0;
        };
        
        self.acelerate = function() {
            Log.debug("Acelerate");
            self.moving = 1;
        };
        
        self.reverse = function() {
            Log.debug("Reverse");
            self.moving = -1;
        };
        
        self.stop = function() {
            Log.debug("Stop (aceleration = 0)");
            self.moving = 0;
        };
        
        self.canMoveTo = function(map, x,y) {
            return map.canWalk(x,y);
        }
        
        self.update = function(map, delta) {
            delta    = 1; 
            velocity = self.moving * self.speed * delta;
            self.a  += self.direction * self.speedRotation;
            x        = self.x + (Math.cos(self.a) * velocity);
            y        = self.y + (Math.sin(self.a) * velocity);
            if ( ! self.canMoveTo(map, x,y) )
                return self;
            self.x = x;
            self.y = y;
            return self;
        };
        
        self.draw = function($$) {
            size = 0.3;
            $$.rectFill(self.x, self.y, size, size, "#FA8E00");
            $$.beginPath();
            $$.line(self.x, self.y, (self.x+Math.cos(self.a)*4),(self.y+Math.sin(self.a)*4), "#FA8E00");
            $$.closePath();
            $$.endStroke();
            return self;
        }
        
        self._init();
    };
    return Player;
});