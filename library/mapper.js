define(['library/jquery', 'library/canvas'],function($, Canvas) {
    var Tile = function() {
        this.id    = 0;
        this.color = undefined;
        this.name  = undefined;
    }
    
    var Mapper = function(options) {
        var self = this;
        var $$   = undefined;
        this.map              = [];
        this.width            = parseInt(options.width, 10) || 0;
        this.height           = parseInt(options.height, 10) || 0;
        this.widthElement     = options.widthElement || undefined;
        this.heightElement    = options.heightElement || undefined;
        this.triggerElement   = options.triggerElement || undefined;
        this.containerElement = options.containerElement || undefined;
        this.tileElement      = options.tileElement || undefined;
        this.canvas           = undefined;
        this._drawing         = 0;
        this.tiles            = [];
        
        this.init = function() {
            if ( ! self.widthElement && ! self.width )
                throw new Error("Unable to handle width. (Please, inform widthElement or width)");
            if ( ! self.heightElement && ! self.height )
                throw new Error("Unable to handle height. (Please, inform heightElement or height)");
            if ( self.widthElement && self.heightElement && ! self.triggerElement )
                throw new Error("Missing trigger element.");
            if ( ! self.containerElement )
                throw new Error("Missing container object. (Please inform the containerElement)");
            if ( ! self.tileElement )
                throw new Error("Missing tile element. (Please inform the tileElement)");
            
            if ( self.triggerElement )
                $('#'+self.triggerElement).click(function() {
                    elementId   = self.containerElement;
                    self.setWidth($('#'+self.widthElement).val());
                    self.setHeight($('#'+self.heightElement).val());
                    self._initCanvas();
                });
        };
        
        this._initTiles = function() {
            floor       = new Tile();
            floor.name  = "floor";
            floor.id    = 1;
            floor.color = '#000';
            wall        = new Tile();
            wall.name   = "Wall";
            wall.id     = 2;
            wall.color  = "#EEE";
            self.tiles.push(floor);
            self.tiles.push(wall);
        }
        
        this._initCanvas = function() {
            $$ = self.canvas = new Canvas({
                "containerId": self.containerElement,
                "width": self.width,
                "height": self.height,
                "scale": 15,
                "debug": false
            });
            self._initTiles();
            self.clearMap();
            self.events();
        };
        
        this.setWidth = function(w) {
            self.width = parseInt(w, 10);
        }
        
        this.setHeight = function(h) {
            self.height = parseInt(h, 10);
        }
        
        this.clearMap = function() {
            for (ii=0; ii<self.width; ii++)
                for (jj=0; jj<self.height; jj++)
                    self.savePoint(ii, jj, 1);
        }
        
        this.events = function() {
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
        }
        
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
        }
        
        this.drawBlock = function(x,y,fill) {
            $$.setStroke('#FFF');
            $$.setFill(fill);
            $$.rect(x, y, 1); 
            $$.rectFill(x, y, 1);
            $$.reset();
        }
        
        this.getTiles = function() {
            return self.tiles;
        }
        
        this.getTile = function(id) {
            for (t=0; t<self.tiles.length; t++) {
                if ( id == self.tiles[t].id )
                    return self.tiles[t];
            }
            return undefined;
        }
        
        this.getMap = function() {
            string = "";
            for (i=0; i<self.height; i++) {
                for (j=0; j<self.width; j++) {
                    string += self.map[i][j] || 0 ;
                }
                string += "\n";
            }
            return string;
        }
        
        this.setMap = function(string) {
            z = string.split("\n");
            h = z.length-1;
            w = z[0].length;
            self.setWidth(w);
            self.setHeight(h);
            self._initCanvas();
            for (_y=0; _y<h; _y++)
                for(_x=0; _x<w; _x++)
                    self.savePoint(_x,_y,z[_y][_x]);
        }
        
        self.init();
    };
    
    return Mapper;
});