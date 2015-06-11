;(function () {

var utils = {};
utils.getBasename = function (url) {
  return url.split('/').reverse()[0];
};

var romsOrigin = 'http://localhost:9000';
var romsUrl = romsOrigin + '/index.json';

xhr(romsUrl).then(function (games) {

  var gameNames = Object.keys(games).sort();
  var html = gameNames.map(function (gameName) {
    return '<option value="' + romsOrigin + '/' + games[gameName] + '">' + gameName + '</option>';
  });

  choices.innerHTML += html.join('\n');

  choices.addEventListener('change', function () {
    loadGame(choices.value);
  });

  function loadGame(url) {
    return xhr(url, null, 'arraybuffer').then(function (game) {
      runGame(utils.getBasename(url), game);
    }).catch(function (e) {
      console.log('Error fetching game', e);
    });
  }

  function runGame(filename, game) {
    // Module.exit();
    exitRuntime();
    FS.writeFile(filename, new Uint8Array(game), {encoding: 'binary'});
    Module.callMain(['--resolution', '640x480', filename]);
  }

  // loadGame('Mario Kart 64');

});

})();
