define(['library/jquery', 'library/canvas'],function($, Canvas) {
    var Mapper = function(options) {
        var self = this;
        var $$   = undefined;
        this.map              = [];
        this.width            = options.width || 0;
        this.height           = options.height || 0;
        this.widthElement     = options.widthElement || undefined;
        this.heightElement    = options.heightElement || undefined;
        this.triggerElement   = options.triggerElement || undefined;
        this.containerElement = options.containerElement || undefined;
        this.canvas           = undefined;
        
        this.init = function() {
            if ( ! self.widthElement && ! self.width )
                throw new Error("Unable to handle width. (Please, inform widthElement or width)");
            if ( ! self.heightElement && ! self.height )
                throw new Error("Unable to handle height. (Please, inform heightElement or height)");
            if ( self.widthElement && self.heightElement && ! self.triggerElement )
                throw new Error("Missing trigger element.");
            if ( ! self.containerElement ) {
                throw new Error("Missing container object. (Please inform the containerElement)");
            }
            
            if ( self.triggerElement )
                $('#'+self.triggerElement).click(function() {
                    elementId   = self.containerElement;
                    self.width  = $('#'+self.widthElement).val();
                    self.height = $('#'+self.heightElement).val();
                    self.initCanvas();
                });
        };
        
        this.initCanvas = function() {
            $$ = self.canvas = new Canvas({
                "containerId": self.containerElement,
                "width": self.width,
                "height": self.height,
                "scale": 15
            });
            self.events();
            self.grid();
        };
        
        this.grid = function() {
            $$.setStroke('#FFF');
            $$.setFill('#000');
            for ( xx = 0; xx <= self.width; xx++) {
                for (yy = 0; yy < self.height; yy++) {
                    $$.rect(xx, yy, 1); $$.rectFill(xx, yy, 1);
                }
            }
            $$.reset();
        };
        
        this.events = function() {
            $('#'+self.containerElement).css('border','3px solid red').mousedown(function (e) {
                pos = $$.gridMousePos(e);
                self.savePoint(pos.x, pos.y);
            });
        }
        
        this.savePoint = function(x, y) {
            $$.setFill('#FFF');
            $$.rectFill(x,y)
            $$.reset();
        }
        
        self.init();
    };
    
    return Mapper;
});