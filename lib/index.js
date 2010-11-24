define(['fs', './server'], function(Fs, Server) {
  Server.createHost()
    .on('message', function(m) {
      if (m.type == 'captured')
        saveImage('pic.png', m.data);
    })
    .listen(8000);

  function saveImage(file, data) {
    var probe = data.match(/^data:(.*);(.*),(.*)$/);

    if (probe)
      Fs.writeFile(file, new Buffer(probe[3], probe[2]), 'binary', function(err) {
        err ? console.log('ERROR!', err) : console.log('Wrote', file);
      });
    else
      console.log('ERROR: badly formatted image data.');
  }

  console.log('Listening: http://localhost:8000/');
});