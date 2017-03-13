(function(root) {
    function ObjServer(data) {
        this.data = data;
        this.walk(data);
        this.events = new Event();
    }
    root.ObjServer = ObjServer;
    var p = ObjServer.prototype;
    p.walk = function(data) {
        let val;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                val = data[key];
                if (typeof val == 'object') {
                    new ObjServer(val)
                }
                this.convert(key, val);
            }
        }
    };
    p.convert = function(key, val) {
        var _this = this;
        Object.defineProperty(this.data, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                console.log('你访问了' + key);
                return val
            },
            set: function(value) {
                console.log('你设置了' + key);
                console.log('新的' + key + '=' + value);
                if (value == val) return;
                if (typeof value === 'object') {
                    new ObjServer(value)
                }
                _this.events.emit(key, _this, value)
                val = value;
            }
        })
    };
    p.$watch = function(key, handler) {
        this.events.on(key, handler)
    };
    var Event = function() {
        this.handlers = [];
    }
    var ep = Event.prototype;
    ep.on = function(eventType, handler) {
        if (typeof handler !== 'function') return;
        var handlers = this.handlers;
        if (!(eventType in handlers)) {
            handlers[eventType] = [];
        };
        handlers[eventType].push(handler)
    };
    ep.off = function(eventType) {
        var handlers = this.handlers;
        if (eventType in handlers) {
            delete handlers[eventType]
        }
    };
    ep.emit = function(eventType, context) {
        var handlers = this.handlers;
        if (!(eventType in handlers)) return
        var arg = [].slice.call(arguments, 2);
        var _this = context || this;
        handlers[eventType] && handlers[eventType].forEach(function(handler, index, el) {
            handler.apply(_this, arg)
        })
    }
})(window)
