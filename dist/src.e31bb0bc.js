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
})({"geometry/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AXES = exports.SIDES = void 0;
var SIDES = {
  TOP: 'TOP',
  RIGHT: 'RIGHT',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT'
};
exports.SIDES = SIDES;
var AXES = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL'
};
exports.AXES = AXES;
},{}],"physics/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STICKY_THRESHOLD = exports.GRAVITY = void 0;
var GRAVITY = 0.5;
exports.GRAVITY = GRAVITY;
var STICKY_THRESHOLD = 0.004;
exports.STICKY_THRESHOLD = STICKY_THRESHOLD;
},{}],"physics/movement.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopIfLowVelocity = exports.moveEntities = void 0;

var _constants = require("./constants");

var _geometry = require("../geometry");

var move = function move(entity) {
  entity.x += entity.vx;
  entity.y += entity.vy;
};

var accelerate = function accelerate(entity) {
  entity.vx += entity.ax;
  entity.vy += entity.ay;
};

var moveEntities = function moveEntities(entities) {
  entities.forEach(function (entity) {
    accelerate(entity);
    move(entity);
  });
};

exports.moveEntities = moveEntities;

var stopIfLowVelocity = function stopIfLowVelocity(entity, axis) {
  var v;

  if (axis === _geometry.AXES.VERTICAL) {
    v = entity.vy;
  }

  if (axis === _geometry.AXES.HORIZONTAL) {
    v = entity.vx;
  } // if (v === undefined) {
  //   throw new Error('Invalid axis provided.')
  // }


  if (Math.abs(v) < _constants.STICKY_THRESHOLD) {
    v = 0;
  }
};

exports.stopIfLowVelocity = stopIfLowVelocity;
},{"./constants":"physics/constants.js","../geometry":"geometry/index.js"}],"physics/collision.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveCollisions = exports.detectCollisions = exports.colliding = void 0;

var _geometry = require("../geometry");

var _movement = require("./movement");

var colliding = function colliding(a, b) {
  var collidingX = a.right >= b.left && a.left <= b.right;
  var collidingY = a.bottom >= b.top && a.top <= b.bottom;
  return collidingX && collidingY;
};

exports.colliding = colliding;

var detectCollisions = function detectCollisions(dynamicEntities, staticEntities) {
  return dynamicEntities.map(function (dynamicEntity) {
    return staticEntities.map(function (staticEntity) {
      dynamicEntity.touchingTheGround = false;

      if (colliding(dynamicEntity, staticEntity)) {
        return {
          a: dynamicEntity,
          b: staticEntity
        };
      }
    }).filter(function (collision) {
      return collision !== undefined;
    });
  }).flat();
};

exports.detectCollisions = detectCollisions;

var resolveCollisions = function resolveCollisions(collisions) {
  if (!collisions.length) return;
  return collisions.map(function (collision) {
    var side = calculateCollisionSide(collision);
    var a = collision.a,
        b = collision.b;
    var RESTITUTION = 0;

    if (side === _geometry.SIDES.TOP) {
      a.y = b.bottom;
      a.vy = -a.vy * RESTITUTION;
      (0, _movement.stopIfLowVelocity)(_geometry.AXES.VERTICAL);
    }

    if (side === _geometry.SIDES.RIGHT) {
      a.x = b.left - a.width;
      a.vx = -a.vx * RESTITUTION;
      (0, _movement.stopIfLowVelocity)(_geometry.AXES.HORIZONTAL);
    }

    if (side === _geometry.SIDES.BOTTOM) {
      a.y = b.top - a.height;
      a.vy = -a.vy * RESTITUTION;
      (0, _movement.stopIfLowVelocity)(_geometry.AXES.VERTICAL);
      a.touchingTheGround = true;
    }

    if (side === _geometry.SIDES.LEFT) {
      a.x = b.right;
      a.vx = -a.vx * RESTITUTION;
      (0, _movement.stopIfLowVelocity)(_geometry.AXES.HORIZONTAL);
    }
  });
};

exports.resolveCollisions = resolveCollisions;

var calculateCollisionSide = function calculateCollisionSide(collision) {
  var a = collision.a,
      b = collision.b;
  var dx = (b.midX - a.midX) / b.halfWidth;
  var dy = (b.midY - a.midY) / b.halfWidth;
  var absDx = Math.abs(dx);
  var absDy = Math.abs(dy); // If the object is approaching from the sides

  if (absDx > absDy) {
    // If the player is approaching from the left
    if (dx > 0) {
      return _geometry.SIDES.RIGHT; // If the player is approaching from the right
    } else {
      return _geometry.SIDES.LEFT;
    } // If this collision is coming from the top or bottom more

  } else {
    // If the player is approaching from above
    if (dy > 0) {
      return _geometry.SIDES.BOTTOM; // If the player is approaching from below
    } else {
      return _geometry.SIDES.TOP;
    }
  }
};
},{"../geometry":"geometry/index.js","./movement":"physics/movement.js"}],"physics/entity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DynamicEntity = exports.StaticEntity = void 0;

var _constants = require("./constants");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Entity =
/*#__PURE__*/
function () {
  function Entity(options) {
    _classCallCheck(this, Entity);

    var x = options.x,
        y = options.y,
        width = options.width,
        height = options.height;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  _createClass(Entity, [{
    key: "top",
    get: function get() {
      return this.y;
    }
  }, {
    key: "right",
    get: function get() {
      return this.x + this.width;
    }
  }, {
    key: "bottom",
    get: function get() {
      return this.y + this.height;
    }
  }, {
    key: "left",
    get: function get() {
      return this.x;
    }
  }, {
    key: "midX",
    get: function get() {
      return (this.left + this.right) / 2;
    }
  }, {
    key: "midY",
    get: function get() {
      return (this.top + this.bottom) / 2;
    }
  }, {
    key: "halfWidth",
    get: function get() {
      return this.width / 2;
    }
  }, {
    key: "halfHeight",
    get: function get() {
      return this.height / 2;
    }
  }]);

  return Entity;
}();

var StaticEntity =
/*#__PURE__*/
function (_Entity) {
  _inherits(StaticEntity, _Entity);

  function StaticEntity(options) {
    _classCallCheck(this, StaticEntity);

    return _possibleConstructorReturn(this, _getPrototypeOf(StaticEntity).call(this, options));
  }

  return StaticEntity;
}(Entity);

exports.StaticEntity = StaticEntity;

var DynamicEntity =
/*#__PURE__*/
function (_Entity2) {
  _inherits(DynamicEntity, _Entity2);

  function DynamicEntity(options) {
    var _this;

    _classCallCheck(this, DynamicEntity);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DynamicEntity).call(this, options));
    var vx = options.vx,
        vy = options.vy,
        ax = options.ax,
        ay = options.ay;
    _this.vx = vx;
    _this.vy = vy;
    _this.ax = ax;
    _this.ay = ay || _constants.GRAVITY;
    return _this;
  }

  return DynamicEntity;
}(Entity);

exports.DynamicEntity = DynamicEntity;
},{"./constants":"physics/constants.js"}],"physics/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "detectCollisions", {
  enumerable: true,
  get: function () {
    return _collision.detectCollisions;
  }
});
Object.defineProperty(exports, "resolveCollisions", {
  enumerable: true,
  get: function () {
    return _collision.resolveCollisions;
  }
});
Object.defineProperty(exports, "DynamicEntity", {
  enumerable: true,
  get: function () {
    return _entity.DynamicEntity;
  }
});
Object.defineProperty(exports, "StaticEntity", {
  enumerable: true,
  get: function () {
    return _entity.StaticEntity;
  }
});
Object.defineProperty(exports, "moveEntities", {
  enumerable: true,
  get: function () {
    return _movement.moveEntities;
  }
});

var _collision = require("./collision");

var _entity = require("./entity");

var _movement = require("./movement");
},{"./collision":"physics/collision.js","./entity":"physics/entity.js","./movement":"physics/movement.js"}],"models/block.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Block = void 0;

var _physics = require("../physics");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Block =
/*#__PURE__*/
function (_StaticEntity) {
  _inherits(Block, _StaticEntity);

  function Block(game, options) {
    var _this;

    _classCallCheck(this, Block);

    var canvas = game.canvas,
        context = game.context;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Block).call(this, options));
    _this.canvas = canvas;
    _this.context = context;
    return _this;
  }

  _createClass(Block, [{
    key: "draw",
    value: function draw(scrollX) {
      this.context.strokeRect(scrollX + this.x, this.y, this.width, this.height);
    }
  }]);

  return Block;
}(_physics.StaticEntity);

exports.Block = Block;
},{"../physics":"physics/index.js"}],"img/ground.png":[function(require,module,exports) {
module.exports = "/ground.0de3554a.png";
},{}],"models/model.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = void 0;

var _physics = require("../physics");

var _ground = _interopRequireDefault(require("../img/ground.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Model =
/*#__PURE__*/
function (_StaticEntity) {
  _inherits(Model, _StaticEntity);

  function Model(game, options) {
    var _this;

    _classCallCheck(this, Model);

    var context = game.context,
        canvas = game.canvas;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Model).call(this, options));
    _this.canvas = canvas;
    _this.context = context;
    var sprite = new Image();
    sprite.src = _ground.default;
    _this.sprite = sprite;
    return _this;
  }

  _createClass(Model, [{
    key: "inViewport",
    value: function inViewport(scrollX) {
      return this.x >= scrollX && this.x < this.canvas.width - scrollX;
    }
  }, {
    key: "draw",
    value: function draw(scrollX) {
      if (this.inViewport(scrollX)) {
        this.context.drawImage(this.sprite, scrollX + this.x, this.y, this.width, this.height);
      }
    }
  }]);

  return Model;
}(_physics.StaticEntity);

exports.Model = Model;
},{"../physics":"physics/index.js","../img/ground.png":"img/ground.png"}],"img/brick.png":[function(require,module,exports) {
module.exports = "/brick.36a5bb2d.png";
},{}],"models/brick.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Brick = void 0;

var _model = require("./model");

var _brick = _interopRequireDefault(require("../img/brick.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Brick =
/*#__PURE__*/
function (_Model) {
  _inherits(Brick, _Model);

  function Brick(game, options) {
    var _this;

    _classCallCheck(this, Brick);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Brick).call(this, game, options));
    var sprite = new Image();
    sprite.src = _brick.default;
    _this.sprite = sprite;
    return _this;
  }

  return Brick;
}(_model.Model);

exports.Brick = Brick;
},{"./model":"models/model.js","../img/brick.png":"img/brick.png"}],"models/door.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Door = void 0;

var _model = require("./model");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Door =
/*#__PURE__*/
function (_Model) {
  _inherits(Door, _Model);

  function Door(game, options) {
    _classCallCheck(this, Door);

    return _possibleConstructorReturn(this, _getPrototypeOf(Door).call(this, game, options));
  }

  _createClass(Door, [{
    key: "draw",
    value: function draw(scrollX) {
      if (this.inViewport(scrollX)) {
        this.context.fillStyle = 'black';
        this.context.fillRect(scrollX + this.x, this.y, this.width, this.height);
      }
    }
  }]);

  return Door;
}(_model.Model);

exports.Door = Door;
},{"./model":"models/model.js"}],"models/flag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Flag = void 0;

var _model = require("./model");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Flag =
/*#__PURE__*/
function (_Model) {
  _inherits(Flag, _Model);

  function Flag(game, options) {
    var _this;

    _classCallCheck(this, Flag);

    var world = game.world;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Flag).call(this, game, options));
    _this.world = world;
    _this.width = world.unitLength * 0.25;
    return _this;
  }

  _createClass(Flag, [{
    key: "draw",
    value: function draw(scrollX) {
      if (this.inViewport(scrollX)) {
        this.context.fillStyle = 'white';
        this.context.fillRect(scrollX + this.x + this.world.unitLength * 0.375, this.y, this.width, this.height);
      }
    }
  }]);

  return Flag;
}(_model.Model);

exports.Flag = Flag;
},{"./model":"models/model.js"}],"models/ground.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ground = void 0;

var _model = require("./model");

var _ground = _interopRequireDefault(require("../img/ground.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Ground =
/*#__PURE__*/
function (_Model) {
  _inherits(Ground, _Model);

  function Ground(game, options) {
    var _this;

    _classCallCheck(this, Ground);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ground).call(this, game, options));
    var sprite = new Image();
    sprite.src = _ground.default;
    _this.sprite = sprite;
    return _this;
  }

  return Ground;
}(_model.Model);

exports.Ground = Ground;
},{"./model":"models/model.js","../img/ground.png":"img/ground.png"}],"models/pipe.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pipe = void 0;

var _model = require("./model");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Pipe =
/*#__PURE__*/
function (_Model) {
  _inherits(Pipe, _Model);

  function Pipe(game, options) {
    _classCallCheck(this, Pipe);

    return _possibleConstructorReturn(this, _getPrototypeOf(Pipe).call(this, game, options));
  }

  _createClass(Pipe, [{
    key: "draw",
    value: function draw(scrollX) {
      if (this.inViewport(scrollX)) {
        this.context.fillStyle = 'green';
        this.context.fillRect(scrollX + this.x, this.y, this.width, this.height);
      }
    }
  }]);

  return Pipe;
}(_model.Model);

exports.Pipe = Pipe;
},{"./model":"models/model.js"}],"img/random.png":[function(require,module,exports) {
module.exports = "/random.444ecbb3.png";
},{}],"models/random.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Random = void 0;

var _model = require("./model");

var _random = _interopRequireDefault(require("../img/random.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Random =
/*#__PURE__*/
function (_Model) {
  _inherits(Random, _Model);

  function Random(game, options) {
    var _this;

    _classCallCheck(this, Random);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Random).call(this, game, options));
    var sprite = new Image();
    sprite.src = _random.default;
    _this.sprite = sprite;
    return _this;
  }

  return Random;
}(_model.Model);

exports.Random = Random;
},{"./model":"models/model.js","../img/random.png":"img/random.png"}],"models/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Block", {
  enumerable: true,
  get: function () {
    return _block.Block;
  }
});
Object.defineProperty(exports, "Brick", {
  enumerable: true,
  get: function () {
    return _brick.Brick;
  }
});
Object.defineProperty(exports, "Door", {
  enumerable: true,
  get: function () {
    return _door.Door;
  }
});
Object.defineProperty(exports, "Flag", {
  enumerable: true,
  get: function () {
    return _flag.Flag;
  }
});
Object.defineProperty(exports, "Ground", {
  enumerable: true,
  get: function () {
    return _ground.Ground;
  }
});
Object.defineProperty(exports, "Pipe", {
  enumerable: true,
  get: function () {
    return _pipe.Pipe;
  }
});
Object.defineProperty(exports, "Random", {
  enumerable: true,
  get: function () {
    return _random.Random;
  }
});

var _block = require("./block");

var _brick = require("./brick");

var _door = require("./door");

var _flag = require("./flag");

var _ground = require("./ground");

var _pipe = require("./pipe");

var _random = require("./random");
},{"./block":"models/block.js","./brick":"models/brick.js","./door":"models/door.js","./flag":"models/flag.js","./ground":"models/ground.js","./pipe":"models/pipe.js","./random":"models/random.js"}],"worlds/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firstWorld = void 0;

var _models = require("../models");

var firstWorld = {
  background: '#6496f5',
  squares: [[null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Random, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Random, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Random, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Random, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, _models.Random, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Random, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Random, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Random, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Random, null, null, null, _models.Random, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Random, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Random, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Random, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Brick, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Brick, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Pipe, _models.Pipe, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, _models.Flag, _models.Flag, _models.Flag, _models.Flag, _models.Flag, _models.Flag, _models.Flag, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Door, _models.Door, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground], [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground]]
};
exports.firstWorld = firstWorld;
var columnWithGround = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, _models.Ground, _models.Ground];
var columnWithPlatform = [null, null, null, null, null, null, null, null, null, null, _models.Ground, null, null, null, _models.Ground, _models.Ground];
},{"../models":"models/index.js"}],"world.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.World = void 0;

var _worlds = require("./worlds");

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
    this.game = game;
    this.canvas = canvas;
    this.context = context;
    var unitLength = canvas.height / 16;
    this.unitLength = unitLength;
    this.groundHeight = canvas.height - unitLength * 2;
    this.blocks = [];
  }

  _createClass(World, [{
    key: "createWorld",
    value: function createWorld(world) {
      var _this = this;

      world.squares.map(function (column, columnIndex) {
        return column.map(function (block, rowIndex) {
          if (!block) return;

          _this.blocks.push(new block(_this.game, {
            x: columnIndex * _this.unitLength,
            y: rowIndex * _this.unitLength,
            width: _this.unitLength,
            height: _this.unitLength
          }));
        });
      });
    }
  }, {
    key: "init",
    value: function init() {
      this.createWorld(_worlds.firstWorld);
    }
  }, {
    key: "draw",
    value: function draw(scrollX) {
      this.context.fillStyle = _worlds.firstWorld.background || '#6496f5';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();
      this.blocks.forEach(function (block) {
        return block.draw(scrollX);
      });
    }
  }]);

  return World;
}();

exports.World = World;
},{"./worlds":"worlds/index.js"}],"img/mario-stationary.png":[function(require,module,exports) {
module.exports = "/mario-stationary.5d8cee26.png";
},{}],"img/mario-jumping.png":[function(require,module,exports) {
module.exports = "/mario-jumping.fe0da052.png";
},{}],"player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var _physics = require("./physics");

var _marioStationary = _interopRequireDefault(require("./img/mario-stationary.png"));

var _marioJumping = _interopRequireDefault(require("./img/mario-jumping.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Player =
/*#__PURE__*/
function (_DynamicEntity) {
  _inherits(Player, _DynamicEntity);

  function Player(game, options) {
    var _this;

    _classCallCheck(this, Player);

    var context = game.context,
        world = game.world;
    var x = options.x,
        y = options.y,
        width = options.width,
        height = options.height,
        vx = options.vx,
        vy = options.vy,
        ax = options.ax,
        ay = options.ay;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Player).call(this, {
      x: x || 0,
      y: y || 0,
      width: width || world.unitLength * 0.8,
      height: height || world.unitLength * 1,
      vx: vx || 0,
      vy: vy || 0,
      ax: ax || 0,
      ay: ay
    }));
    _this.game = game;
    _this.world = world;
    _this.context = context;
    _this.sprites = {};
    _this.sprites.stationary = new Image();
    _this.sprites.stationary.src = _marioStationary.default;
    _this.sprites.jumping = new Image();
    _this.sprites.jumping.src = _marioJumping.default;
    return _this;
  }

  _createClass(Player, [{
    key: "draw",
    value: function draw(scrollX) {
      if (!this.touchingTheGround) {
        return this.context.drawImage(this.sprites.jumping, scrollX + this.x, this.y, this.width, this.height);
      }

      this.context.drawImage(this.sprites.stationary, scrollX + this.x, this.y, this.width, this.height);
      this.context.restore();
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
      if (this.touchingTheGround) return this.vy = -this.world.unitLength / 3;
    }
  }]);

  return Player;
}(_physics.DynamicEntity);

exports.Player = Player;
},{"./physics":"physics/index.js","./img/mario-stationary.png":"img/mario-stationary.png","./img/mario-jumping.png":"img/mario-jumping.png"}],"game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;

var _world = require("./world");

var _player = require("./player");

var _physics = require("./physics");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game(canvas) {
    var _this = this;

    _classCallCheck(this, Game);

    this.options = {
      debug: false
    };
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.entities = [];
    this.scrollX = 0;
    this.debug = {
      draw: function draw(scrollX) {
        _this.context.restore();

        var stats = ["Player", "x: ".concat(Math.floor(_this.player.x)), "y: ".concat(Math.floor(_this.player.y)), "y: ".concat(Math.floor(_this.player.y)), "vx: ".concat(Math.floor(_this.player.vx)), "vy: ".concat(Math.floor(_this.player.vy)), "ax ".concat(_this.player.ax), "ay ".concat(_this.player.ay), "Game", "scrollX: ".concat(Math.floor(scrollX)), "inViewport: ".concat(_this.canvas.width - scrollX)];
        stats.forEach(function (string, index) {
          return _this.context.fillText(string, 10, (index + 1) * 12);
        });
      }
    };
  }

  _createClass(Game, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.world = new _world.World(this);
      this.world.init();
      this.player = new _player.Player(this, {
        x: this.world.unitLength * 0.1,
        y: this.world.groundHeight - this.world.unitLength * 1,
        ay: 0
      });
      this.world.player = this.player;
      this.entities.push(this.player);
      this.world.blocks.forEach(function (block) {
        return _this2.entities.push(block);
      });
      this.addEventListeners();
      this.animate();
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this3 = this;

      window.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') {
          _this3.player.startMoving('right');
        }

        if (event.key === 'ArrowLeft') {
          _this3.player.startMoving('left');
        }

        if (event.code === 'Space') {
          _this3.player.jump();
        }

        if (_this3.options.debug) {
          if (event.key === 'c') {
            console.log((0, _physics.detectCollisions)([_this3.player], _this3.world.blocks));
          }

          if (event.key === 'p') {
            console.log(_this3.player);
          }
        }
      });
      window.addEventListener('keyup', function (event) {
        if (event.key === 'ArrowRight') {
          _this3.player.stopMoving();
        }

        if (event.key === 'ArrowLeft') {
          _this3.player.stopMoving();
        }
      });
    }
  }, {
    key: "handlePhysics",
    value: function handlePhysics() {
      (0, _physics.moveEntities)([this.player]);
      var collisions = (0, _physics.detectCollisions)([this.player], this.world.blocks);
      (0, _physics.resolveCollisions)(collisions);
    }
  }, {
    key: "draw",
    value: function draw(scrollX) {
      this.context.save();
      this.context.beginPath();
      this.world.draw(scrollX);
      this.player.draw(scrollX);
      if (this.options.debug) this.debug.draw(scrollX);
    }
  }, {
    key: "resetCanvas",
    value: function resetCanvas() {
      this.context.fillStyle = 'white';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "scrollCanvas",
    value: function scrollCanvas() {
      if (this.player.x > this.canvas.width * 0.8 - this.scrollX) {
        this.scrollX -= 10;
      }

      if (this.player.x < this.canvas.width * 0.2 - this.scrollX) {
        if (this.scrollX < -10) {
          this.scrollX += 10;
        }
      }
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this4 = this;

      requestAnimationFrame(function () {
        return _this4.animate();
      });
      this.update();
    }
  }, {
    key: "update",
    value: function update() {
      this.handlePhysics();
      this.resetCanvas();
      this.scrollCanvas(this.player.vx);
      this.draw(this.scrollX);
    }
  }]);

  return Game;
}();

exports.Game = Game;
},{"./world":"world.js","./player":"player.js","./physics":"physics/index.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _game = require("./game");

var main = function main() {
  window.game = new _game.Game(document.querySelector('#game'));
  game.init();
};

document.addEventListener('DOMContentLoaded', main);
},{"./game":"game.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62635" + '/');

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
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map