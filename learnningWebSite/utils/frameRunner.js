(function(root, fn) {
    if (typeof define === "function" && define.amd) {
        define(fn);
    } else if (typeof exports === "object") {
        module.exports = fn();
    } else {
        root.FrameRunner = fn();
    }
})(this, function() {
    (function() {
        var lastTime = 0;
        var vendors = ["ms", "moz", "webkit", "o"];
        for (
            var x = 0;
            x < vendors.length && !window.requestAnimationFrame;
            ++x
        ) {
            window.requestAnimationFrame =
                window[vendors[x] + "RequestAnimationFrame"];
            window.cancelAnimationFrame =
                window[vendors[x] + "CancelAnimationFrame"] ||
                window[vendors[x] + "CancelRequestAnimationFrame"];
        }

        if (!window.requestAnimationFrame) {
            var timer = null;
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                clearTimeout(timer);
                var id = (timer = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall));
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    })();

    function Main(fps) {
        this.fps = fps;
        this.lastTime = new Date().getTime();
        this.isStart = 0;
        this.fn = [];

		var _this=this;
        function run(t) {
			if(_this.willDestroy){
				return
			}

			if(!_this.isStart){
				requestAnimationFrame(run);
				return 
			}
			var time=new Date().getTime();
			var step=time-_this.lastTime
			if(step<1000/_this.fps){
				requestAnimationFrame(run);
				return
			}
			_this.lastTime=time;

			for(var i=0;i<_this.fn.length;i++){
				_this.fn[i]&&_this.fn[i](t,step);
			}
            requestAnimationFrame(run);
		}
		run();
    }
    Main.prototype = {
        constructor: Main,
        start: function() {
            this.isStart = 1;
            return this;
        },
        stop: function() {
			this.isStart = 0;
			
            return this;
        },
        beforeDestroy: function() {
			this.willDestroy = true;
        },
        onUpdate: function(fn) {
            if (typeof fn === "function") {
                this.fn.push(fn);
			}
			return this
        }
    };

    return Main;
});
