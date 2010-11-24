define(['exports', 'sys', 'events', 'ws', './util'],
function(exports, Sys, Events, WS, U) {

  exports.createHost = createHost;

  function createHost() {
    return new Host();
  }

  Sys.inherits(Host, Events.EventEmitter);
  function Host() {
    Events.EventEmitter.call(this);

    var self = this;
    this._clients = {};
    this._ws = WS.createServer();

    this._ws.addListener('connection', function(conn) {
      console.log('CONNECTED', conn.id);

      conn.send(JSON.stringify({ type: 'capture', url: 'http://nodejs.org/' }));

      conn.addListener('message', function(m) {
        self.emit('message', JSON.parse(m));
      });
    });

    this._ws.addListener('error', function() {
      console.log('ERROR! %j', arguments);
    });

    this._ws.addListener('disconnected', function(conn) {
      console.log('DISCONNECTED', conn.id);
    });
  }

  Host.prototype.listen = function() {
    this._ws.listen.apply(this._ws, arguments);
    return this;
  };

});