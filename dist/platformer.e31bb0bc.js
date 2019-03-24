// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"block.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Block = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Block =
/*#__PURE__*/
function () {
  function Block(context, options) {
    _classCallCheck(this, Block);

    this.context = context;
    var x = options.x,
        y = options.y,
        width = options.width,
        height = options.height,
        type = options.type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  _createClass(Block, [{
    key: "draw",
    value: function draw() {
      this.context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }]);

  return Block;
}();

exports.Block = Block;
},{}],"world.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.World = void 0;

var _block = require("./block");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var World =
/*#__PURE__*/
function () {
  function World(game) {
    _classCallCheck(this, World);

    var canvas = game.canvas,
        context = game.context;
    this.canvas = canvas;
    this.context = context;
    var unitLength = canvas.height / 5;
    this.unitLength = unitLength;
    this.groundHeight = canvas.height - unitLength;
    this.blocks = [];
  }

  _createClass(World, [{
    key: "createGround",
    value: function createGround() {
      var numberOfSquaresToDraw = Math.floor(this.canvas.width / this.unitLength) + 1;

      for (var i = 0; i < numberOfSquaresToDraw; i++) {
        this.blocks.push(new _block.Block(this.context, {
          x: i * this.unitLength,
          y: this.groundHeight,
          width: this.unitLength,
          height: this.unitLength,
          type: 'ground'
        }));
      }
    }
  }, {
    key: "createPlatform",
    value: function createPlatform() {
      var numberOfSquaresToDraw = 3;

      for (var i = 0; i < numberOfSquaresToDraw; i++) {
        this.blocks.push(new _block.Block(this.context, {
          x: (i + 2) * this.unitLength,
          y: this.groundHeight - this.unitLength * 2,
          width: this.unitLength,
          height: this.unitLength,
          type: 'platform'
        }));
      }
    }
  }, {
    key: "init",
    value: function init() {
      this.createGround();
      this.createPlatform();
    }
  }, {
    key: "draw",
    value: function draw() {
      this.blocks.forEach(function (block) {
        return block.draw();
      });
    }
  }]);

  return World;
}();

exports.World = World;
},{"./block":"block.js"}],"player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Player =
/*#__PURE__*/
function () {
  function Player(game, options) {
    _classCallCheck(this, Player);

    this.game = game;
    var world = game.world;
    this.world = world;
    var x = options.x,
        y = options.y;
    this.x = x;
    this.y = y;
    this.width = world.unitLength * 0.8;
    this.height = world.unitLength * 3;
    this.vx = 0;
    this.vy = 0;
    this.accelerations = {
      x: [],
      y: [{
        type: 'gravity',
        magnitude: 0.5
      }]
    };
  }

  _createClass(Player, [{
    key: "draw",
    value: function draw() {
      this.world.context.fillRect(this.x, this.y, this.width, this.height);
    }
  }, {
    key: "startMoving",
    value: function startMoving(direction) {
      var speed = this.world.unitLength / 10;
      if (direction === 'left') return this.vx = speed * -1;
      if (direction === 'right') return this.vx = speed;
    }
  }, {
    key: "stopMoving",
    value: function stopMoving() {
      this.vx = 0;
    }
  }, {
    key: "jump",
    value: function jump() {
      if (this.onTheGround) return this.vy = -20;
    }
  }, {
    key: "addAntiGravity",
    value: function addAntiGravity() {
      var groundAccelertionIndex = this.accelerations.y.findIndex(function (acceleration) {
        return acceleration.type === 'ground';
      });

      if (groundAccelertionIndex === -1) {
        this.accelerations.y.push({
          type: 'ground',
          magnitude: -0.5
        });
      }
    }
  }, {
    key: "removeAntiGravity",
    value: function removeAntiGravity() {
      var groundAccelertionIndex = this.accelerations.y.findIndex(function (acceleration) {
        return acceleration.type === 'ground';
      });

      if (groundAccelertionIndex !== -1) {
        this.accelerations.y.splice(groundAccelertionIndex, 1);
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.x += this.vx;

      if (this.x < -this.width) {
        // console.log(this.world.canvas.width)
        this.x = this.world.canvas.width;
      }

      if (this.x > this.world.canvas.width) {
        this.x = -this.width;
      } // console.log(this.x === -this.width)


      this.vy += this.acceleration.y;
      var newY = this.y + this.vy;
      newY < this.baseY ? this.y = newY : this.y = this.baseY; // this.y = newY
    }
  }, {
    key: "baseY",
    get: function get() {
      return this.world.groundHeight - this.height;
    }
  }, {
    key: "acceleration",
    get: function get() {
      return {
        x: this.accelerations.x.reduce(function (a, b) {
          return a + b.magnitude;
        }, 0),
        y: this.accelerations.y.reduce(function (a, b) {
          return a + b.magnitude;
        }, 0)
      };
    }
  }, {
    key: "onTheGround",
    get: function get() {
      return this.y === this.baseY;
    }
  }]);

  return Player;
}();

exports.Player = Player;
},{}],"game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;

var _world = require("./world");

var _player = require("./player");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game(canvas) {
    _classCallCheck(this, Game);

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  _createClass(Game, [{
    key: "init",
    value: function init() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.world = new _world.World(this);
      this.world.init();
      this.player = new _player.Player(this, {
        x: this.world.unitLength * 0.1,
        y: this.world.groundHeight - this.world.unitLength * 3
      });
      this.world.player = this.player;
      this.addEventListeners();
      this.animate();
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this = this;

      window.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') {
          _this.player.startMoving('right');
        }

        if (event.key === 'ArrowLeft') {
          _this.player.startMoving('left');
        }

        if (event.code === 'Space') {
          _this.player.jump();
        }
      });
      window.addEventListener('keyup', function (event) {
        if (event.key === 'ArrowRight') {
          _this.player.stopMoving();
        }

        if (event.key === 'ArrowLeft') {
          _this.player.stopMoving();
        }
      });
    }
  }, {
    key: "physics",
    value: function physics() {
      var _this2 = this;

      var colliding = function colliding(a, b) {
        // const collidingX = (first, second) => first.x + first.width >= second.x && first.x <= second.x + second.width
        // const collidingY = (first, second) => first.y + first.height >= second.y && first.y <= second.y + second.height
        var getSides = function getSides(shape) {
          return {
            leftEdge: shape['x'],
            rightEdge: shape['x'] + shape['width'],
            topEdge: shape['y'],
            bottomEdge: shape['y'] + shape['height']
          };
        };

        a = getSides(a);
        b = getSides(b);
        var collidingX = a.rightEdge >= b.leftEdge && a.leftEdge <= b.rightEdge;
        var collidingY = a.bottomEdge >= b.topEdge && a.topEdge <= b.bottomEdge;
        return collidingX && collidingY;
      };

      var overlappingEdges = function overlappingEdges(a, b) {
        var result = {
          a: [],
          b: []
        };
        if (!colliding(a, b)) return result;

        var getSides = function getSides(shape) {
          return {
            leftEdge: shape['x'],
            rightEdge: shape['x'] + shape['width'],
            topEdge: shape['y'],
            bottomEdge: shape['y'] + shape['height']
          };
        };

        a = getSides(a);
        b = getSides(b);

        if (a.rightEdge > b.leftEdge && a.leftEdge < b.leftEdge) {
          result.a.push('rightEdge');
          result.b.push('leftEdge');
        }

        if (a.leftEdge < b.rightEdge && a.rightEdge > b.rightEdge) {
          result.a.push('leftEdge');
          result.b.push('rightEdge');
        }

        if (a.bottomEdge >= b.topEdge && a.topEdge <= b.topEdge) {
          result.a.push('bottomEdge');
          result.b.push('topEdge');
        } // console.log({
        //   'b.topEdge': b.topEdge,
        //   'a.topEdge': a.topEdge,
        //   'b.bottomEdge': b.bottomEdge
        // })
        // console.log('a.topEdge <= b.topEdge:', a.topEdge <= b.topEdge)


        if (a.topEdge <= b.bottomEdge && a.topEdge >= b.topEdge) {
          result.a.push('topEdge');
          result.b.push('bottomEdge');
        }

        return result;
      }; // console.log(overlappingEdges(this.player, this.world.blocks[7]))
      // colliding(this.player, this.world.blocks[7])


      var collisions = this.world.blocks.map(function (block, index) {
        return overlappingEdges(_this2.player, block); // console.log(`trying ${index}`)
      }).filter(function (collisions) {
        return collisions.a.includes('rightEdge') && !collisions.a.includes('bottomEdge');
      });
      console.log(collisions);

      if (collisions.length) {
        if (this.player.vx > 0) {
          this.player.vx = 0;
        }
      } // if (collisions.length) {
      //   this.player.addAntiGravity()
      //   if (collisions.some(block => block.type === 'platform')) {
      //     this.player.vy = 0
      //   }
      // } else {
      //   this.player.removeAntiGravity()
      // }

    }
  }, {
    key: "draw",
    value: function draw() {
      this.world.draw();
      this.player.draw();
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this3 = this;

      requestAnimationFrame(function () {
        return _this3.animate();
      });
      this.update();
    }
  }, {
    key: "update",
    value: function update() {
      this.physics();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.player.update();
      this.draw();
    }
  }]);

  return Game;
}();

exports.Game = Game;
},{"./world":"world.js","./player":"player.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _game = require("./game");

var main = function main() {
  window.game = new _game.Game(document.querySelector('#game'));
  game.init();
};

var debounce = function debounce(fn) {
  var timer;
  return function (event) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, 100, event);
  };
};

document.addEventListener('DOMContentLoaded', main);
},{"./game":"game.js"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63431" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/platformer.e31bb0bc.js.map