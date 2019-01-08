(function() {
    var MicroEvents = function() {
        this._events = {};
    }

    MicroEvents.prototype.on = function(event, callback) {
        this._events = this._events || {};
        this._events[event] = callback;
    }

    MicroEvents.prototype.emit = function(event, data) {
        if (this._events && this._events[event] && typeof this._events[event] === 'function') {
            this._events[arguments[0]].apply(null, Array.prototype.slice.call(arguments, 1));
        }
    }

    window.MicroEvents = MicroEvents;
})();