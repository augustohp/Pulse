define(['library/jquery', 'library/canvas', 'library/log', 'library/util', 'library/map/tile'],function($, Canvas, Logger, undefined, Tile) {    
    var Mapper = function(options) {
        var self              = this;
        var $$                = undefined;
        options               = options || {};
        self.logLevel         = options.level || 0;
        self.map              = [];
        self._mapString       = options.map || "";
        self.width            = parseInt(options.width, 10) || 0;
        self.height           = parseInt(options.height, 10) || 0;
        self.widthElement     = options.widthElement || undefined;
        self.heightElement    = options.heightElement || undefined;
        self.triggerElement   = options.triggerElement || undefined;
        self.containerElement = options.containerElement || undefined;
        self.tileElement      = options.tileElement || undefined;
        self.creatorMode      = options.creator || false;
        self.scale            = options.scale || 15;
        self.debug            = options.debug || false;
        self.canvas           = undefined;
        self._drawing         = 0;
        self.tiles            = [];
        var Log               = new Logger({"level":self.logLevel});

        this.init = function() {
            Log.debug('Init')
            self._initTiles();
            self._initEvents();
            self._initMap();
            self._initCanvas();
        };
        
        this._initTiles = function() {
            Log.debug('Init tiles')
            floor          = new Tile();
            floor.name     = "floor";
            floor.id       = 1;
            floor.color    = '#000';
            floor.walkable = true;
            wall           = new Tile();
            wall.name      = "Wall";
            wall.id        = 2;
            wall.color     = "#EEE";
            wall.walkable  = false;
            self.addTile(floor);
            self.addTile(wall);
        }
        
        this._initCanvas = function() {
            Log.debug('Init canvas');
            if ( ! self.widthElement && ! self.width )
                throw new Error("Unable to handle width. (Please, inform widthElement or width)");
            if ( ! self.heightElement && ! self.height )
                throw new Error("Unable to handle height. (Please, inform heightElement or height)");
            if ( self.widthElement && self.heightElement && ! self.triggerElement )
                throw new Error("Missing trigger element.");
            if ( ! self.containerElement )
                throw new Error("Missing container object. (Please inform the containerElement)");
                
            $$ = self.canvas = new Canvas({
                "containerId": self.containerElement,
                "width": self.width,
                "height": self.height,
                "scale": self.scale,
                "level": self.logLevel
            });
            if ( self.isMapEmpty() )
                self.fillMap(1);
        };
        
        this._initEvents = function() {
            if ( ! self.creatorMode )
                return;
            Log.debug("Init events");
            if ( self.triggerElement )
                $('#'+self.triggerElement).click(function() {
                    elementId   = self.containerElement;
                    self.setWidth($('#'+self.widthElement).val());
                    self.setHeight($('#'+self.heightElement).val());
                    self.map = [];
                    self._initCanvas();
                });
            $('#'+self.containerElement).mousedown(function (e) {
                self._drawing = 1;
                pos = $$.gridMousePos(e);
                tileId = $('#'+self.tileElement).val();
                self.savePoint(pos.x, pos.y, tileId);
            });
            $('#'+self.containerElement).mousemove(function (e) {
                if ( self._drawing != 1) return;
                pos = $$.gridMousePos(e);
                tileId = $('#'+self.tileElement).val();
                self.savePoint(pos.x, pos.y, tileId);
            });
            $('#'+self.containerElement).mouseup(function (e) {
                self._drawing = 0;
            });
        };
        
        this._initMap = function() {
            if ( ! self.isMapEmpty() )
                self.setMap(self._mapString);
        };
        
        this.setWidth = function(w) {
            self.width = parseInt(w, 10);
        };
        
        this.setHeight = function(h) {
            self.height = parseInt(h, 10);
        };
        
        this.resize = function() {
            $$.setWidth(self.width);
            $$.setHeight(self.height);
        };
        
        this.savePoint = function(x, y, tileId) {
            if ( x >= self.width || y >= self.height )
                return;
            tile   = self.getTile(tileId);
            if ( ! tile )
                throw new Error("Unable to find tile");
            self.drawBlock(x, y, tile.color)
            if ( ! self.map[y] ) self.map[y] = [];
            if ( ! self.map[y][x] ) self.map[y][x] = 0;
            self.map[y][x] = tile.id;
        };
        
        this.drawBlock = function(x,y,fill) {
            $$.setStroke('#FFF');
            $$.setFill(fill);
            if ( self.creatorMode )
                $$.rect(x, y, 1); 
            $$.rectFill(x, y, 1);
            $$.reset();
        };
        
        this.getTiles = function() {
            return self.tiles;
        };
        
        this.addTile = function(tile) {
            self.tiles[tile.id] = tile;
        };
        
        this.getTile = function(id) {
            if ( ! self.tiles[id] )
                return undefined;
            return self.tiles[id];
        };
        
        this.getCanvas = function() {
            return self.canvas;
        };
        
        this.fillMap = function(tileId) {
            Log.debug('Fill map')
            for (ii=0; ii<self.width; ii++)
                for (jj=0; jj<self.height; jj++)
                    self.savePoint(ii, jj, tileId);
            return self;
        };
        
        this.getMap = function() {
            var string = "";
            self.map.forEach(function(row) {
                string += row.join('')+"\n";
            });
            return string;
        };
        
        this.setMap = function(string) {
            Log.debug('Set map');
            self._mapString = "";
            self.map        = [];
            string          = string || "";
            string.split("\n").forEach(function(row) {
                row = row.trim(); _row = [];
                if ( row.trim().length <= 0 ) return; 
                for (r=0; r<row.length; r++)
                    _row.push(row.charAt(r)*1);
                self.map.push(_row);
            });
            self.setWidth(self.map[0].length);
            self.setHeight(self.map.length);
            self._initCanvas();
            return self;
        };
        
        this.drawMap = function() {
            $$.emptyContext();
            self.map.forEach(function(row, rowIndex) {
                row.forEach(function(column, columnIndex) {
                    self.savePoint(columnIndex, rowIndex, column);
                });
            });
        };
        
        this.isMapEmpty = function() {
            return (self._mapString.length <= 0 && self.map.length <=0);
        };
        
        this.canWalk = function(y,x) {
            _x = x; _y = y;
            x      = parseInt(x, 10);
            y      = parseInt(y, 10);
            tile   = self.getTile(self.map[x][y]);
            if ( tile && tile instanceof Tile )
                return tile.walkable;
            return false;
        };
        
        self.init();
    };
    
    return Mapper;
});