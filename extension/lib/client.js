define(['exports'], function(exports) {
  exports.createConnection = createConnection;

  function createConnection(port, host) {
    host = host || 'localhost';
    return (new Connection()).connect(port, host);
  }

  function Connection() {
    this.uri = null;
    this._ws = null;
    this._listening = {};
  }

  Connection.prototype.connect = function(port, host) {
    if (this.uri !== null)
      throw new Error('Already connected to "' + this.uri + '".');

    var self = this,
        uri = 'ws://' + host + ':' + port + '/',
        ws = this._ws = new WebSocket(uri);

    ws.onopen = function() {
      self.emit('open');
    };

    ws.onmessage = function(evt) {
      console.log('got message', evt);
      if (evt.type == 'message')
        self.emit('message', JSON.parse(evt.data));
    };

    ws.onclose = function() {
      self.emit('close');
    };

    return this;
  };

  Connection.prototype.send = function(data) {
    this._ws.send(JSON.stringify(data));
    return this;
  };

  Connection.prototype.emit = function(name) {
    var args = Array.prototype.slice.call(arguments, 1),
        listening = this._listening[name];

    if (listening)
      listening.forEach(function(fn) {
        fn.apply(null, args);
      });

    return this;
  };

  Connection.prototype.on = function(name, fn) {
    var listening = this._listening[name];

    if (listening === undefined)
      listening = this._listening[name] = [];
    listening.push(fn);

    return this;
  };
});