var signature = {
    point: {},
    init: function(ops) {
        var __ = this;
        var supportTouch = ("createTouch" in document) || ('ontouchstart' in window);
        __.eventStart = supportTouch ? 'touchstart' : 'mousedown';
        __.eventMove = supportTouch ? 'touchmove' : 'mousemove';
        __.eventEnd = supportTouch ? 'touchend' : 'mouseup';
        __.canvasDiv = ops.div;
        __.finishBtn = ops.finishBtn;
        __.clearBtn = ops.clearBtn;
        __.finishcall = ops.finish;
        __.lineColor = ops.lineColor;
        __.lineWidth = ops.lineWidth;
        __.canvas = document.createElement('canvas');
        __.canvasWidth = __.canvasDiv.width(),
            __.canvasHeight = __.canvasDiv.height();
        __.point.notFirst = false;
        $(__.canvas).attr({
            width: __.canvasWidth,
            height: __.canvasHeight,
            id: 'signature'
        }).appendTo(__.canvasDiv);
        __.offsetLeft = $(__.canvas).offset().left;
        __.offsetTop = $(__.canvas).offset().top;
        // if (typeof G_vmlCanvasManager != 'undefined') {
        //     __.canvas = G_vmlCanvasManager.initElement(__.canvas);
        // }
        __.context = __.canvas.getContext("2d");
        $(__.canvas).on(__.eventStart, function(e) {
            var _this = $(this);
            __.mouseX = e.pageX - __.offsetLeft;
            __.mouseY = e.pageY - __.offsetTop;
            __.paint = true;
            if (supportTouch)
                var touches = e.originalEvent.changedTouches[0];
            else
                var touches = e.originalEvent;
            __.oft = __.offsetTop - $('.conter-auto').scrollTop();
            __.addClick(touches.pageX - __.offsetLeft, touches.pageY - __.oft);
            __.redraw();
        });
        $(__.canvas).on(__.eventMove, function(e) {
            if (__.paint) {
                e.preventDefault();
                var _this = $(this);
                if (supportTouch)
                    var touches = e.originalEvent.changedTouches[0];
                else
                    var touches = e.originalEvent;
                __.addClick(touches.pageX - __.offsetLeft, touches.pageY - __.oft, true);
                __.redraw();
            }
        });
        $(__.canvas).on(__.eventEnd, function(e) {
            __.paint = false;
        });
        $(__.canvas).on("mouseleave", function(e) {
            __.paint = false;
        });
        __.clickX = new Array();
        __.clickY = new Array();
        __.clickDrag = new Array();
        __.paint;
        __.finish();
    },
    addClick: function(x, y, dragging) {
        var __ = this;
        __.clickX.push(x);
        __.clickY.push(y);
        __.clickDrag.push(dragging);
    },
    redraw: function() {
        var __ = this;
        __.context.strokeStyle = __.lineColor;
        __.context.lineJoin = "round";
        __.context.lineWidth = __.lineWidth;
        while (__.clickX.length > 0) {
            __.point.bx = __.point.x;
            __.point.by = __.point.y;
            __.point.x = __.clickX.pop();
            __.point.y = __.clickY.pop();
            __.point.drag = __.clickDrag.pop();
            __.context.beginPath();
            if (__.point.drag && __.point.notFirst) {
                __.context.moveTo(__.point.bx, __.point.by);
            } else {
                __.point.notFirst = true;
                __.context.moveTo(__.point.x - 1, __.point.y);
            }
            __.context.lineTo(__.point.x, __.point.y);
            __.context.closePath();
            __.context.stroke();
        }
    },
    addPic:function(img){
        var __ = this;
        __.context.drawImage(img,0,0);
    },
    finish: function() {
        var __ = this;
        __.clearBtn.on(__.eventStart, function() {
            __.canvas.width = __.canvas.width;
        });
        __.finishBtn.on(__.eventStart, function() {
            //��ȡcanvas�����ݻص�
            var imageData = __.canvas.toDataURL("image/png");
            if (typeof __.finish === 'function')
                __.finishcall(imageData);
        });
    }
};

var signatureS = {
    point: {},
    init: function(ops) {
        var __ = this;
        var supportTouch = ("createTouch" in document) || ('ontouchstart' in window);
        __.eventStart = supportTouch ? 'touchstart' : 'mousedown';
        __.eventMove = supportTouch ? 'touchmove' : 'mousemove';
        __.eventEnd = supportTouch ? 'touchend' : 'mouseup';
        __.canvasDiv = ops.div;
        __.finishBtn = ops.finishBtn;
        __.clearBtn = ops.clearBtn;
        __.finishcall = ops.finish;
        __.lineColor = ops.lineColor;
        __.lineWidth = ops.lineWidth;
        __.canvas = document.createElement('canvas');
        __.canvasWidth = __.canvasDiv.width();
        __.canvasHeight = __.canvasDiv.height();
        __.point.notFirst = false;
        $(__.canvas).attr({
            width: __.canvasWidth,
            height: __.canvasHeight,
            id: 'signatureS'
        }).appendTo(__.canvasDiv);
        __.offsetLeft = $(__.canvas).offset().left;
        __.offsetTop = $(__.canvas).offset().top;
        // if (typeof G_vmlCanvasManager != 'undefined') {
        //     __.canvas = G_vmlCanvasManager.initElement(__.canvas);
        // }
        __.context = __.canvas.getContext("2d");
        $(__.canvas).on(__.eventStart, function(e) {
            var _this = $(this);
            __.mouseX = e.pageX - __.offsetLeft;
            __.mouseY = e.pageY - __.offsetTop;
            __.paint = true;
            if (supportTouch)
                var touches = e.originalEvent.changedTouches[0];
            else
                var touches = e.originalEvent;
            __.oft = __.offsetTop - $('.conter-auto').scrollTop();
            __.addClick(touches.pageX - __.offsetLeft, touches.pageY - __.oft);
            __.redraw();
        });
        $(__.canvas).on(__.eventMove, function(e) {
            if (__.paint) {
                e.preventDefault();
                var _this = $(this);
                if (supportTouch)
                    var touches = e.originalEvent.changedTouches[0];
                else
                    var touches = e.originalEvent;
                __.addClick(touches.pageX - __.offsetLeft, touches.pageY - __.oft, true);
                __.redraw();
            }
        });
        $(__.canvas).on(__.eventEnd, function(e) {
            __.paint = false;
        });
        $(__.canvas).on("mouseleave", function(e) {
            __.paint = false;
        });
        __.clickX = new Array();
        __.clickY = new Array();
        __.clickDrag = new Array();
        __.paint;
        __.finish();
    },
    addClick: function(x, y, dragging) {
        var __ = this;
        __.clickX.push(x);
        __.clickY.push(y);
        __.clickDrag.push(dragging);
    },
    redraw: function() {
        var __ = this;
        __.context.strokeStyle = __.lineColor;
        __.context.lineJoin = "round";
        __.context.lineWidth = __.lineWidth;
        while (__.clickX.length > 0) {
            __.point.bx = __.point.x;
            __.point.by = __.point.y;
            __.point.x = __.clickX.pop();
            __.point.y = __.clickY.pop();
            __.point.drag = __.clickDrag.pop();
            __.context.beginPath();
            if (__.point.drag && __.point.notFirst) {
                __.context.moveTo(__.point.bx, __.point.by);
            } else {
                __.point.notFirst = true;
                __.context.moveTo(__.point.x - 1, __.point.y);
            }
            __.context.lineTo(__.point.x, __.point.y);
            __.context.closePath();
            __.context.stroke();
        }
    },
    finish: function() {
        var __ = this;
        __.clearBtn.on(__.eventStart, function() {
            __.canvas.width = __.canvas.width;
        });
        __.finishBtn.on(__.eventStart, function() {
            //��ȡcanvas�����ݻص�
            var imageData = __.canvas.toDataURL("image/png");
            if (typeof __.finish === 'function')
                __.finishcall(imageData);
        });
    }
};