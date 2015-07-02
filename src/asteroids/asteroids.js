
/* <==================================================

              __                  _     _______ _
  ____ ______/ /____  _________  (_)___/ / ___/(_)___ ___
 / __ `/ ___/ __/ _ \/ ___/ __ \/ / __  /\__ \/ / __ `__ \
/ /_/ (__  ) /_/  __/ /  / /_/ / / /_/ /___/ / / / / / / /
\__,_/____/\__/\___/_/   \____/_/\__,_//____/_/_/ /_/ /_/

'Back on Arcturus, this doubled as our flight simulator'
  - Dark Overlord of Data

==================================================>
 */
'use strict';
var AnimationSystem, AsteroidDeathView, AsteroidView, AudioSystem, BackgroundView, BulletAgeSystem, BulletView, CollisionSystem, Components, DeathThroesSystem, Dot, Entities, FixedPhysicsSystem, Game, GameController, GameManager, GunControlSystem, HudSystem, HudView, KeyPoll, MersenneTwister, Nodes, Point, Properties, RenderSystem, ShipControlSystem, Sound, SpaceshipDeathView, SpaceshipView, SpriteAsteroid, SpriteBullet, SpriteSpaceship, SystemPriorities, WaitForStartSystem, WaitForStartView, ZRandom, res,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

res = {
  fb_login: 'res/images/fb-login.png',
  dialog_blue: 'res/images/dialog-box.png',
  dialog_star: 'res/images/black-dialog.png',
  button_blue: 'res/images/standard-button-on.png',
  button_star: 'res/images/black-button-on.png',
  background: 'res/images/BackdropBlackLittleSparkBlack.png',
  leaderboard: 'res/icons/b_Leaderboard.png',
  settings: 'res/icons/b_Parameters.png',
  round: 'res/images/round48.png',
  square: 'res/images/square48.png',
  touchorigin: 'res/images/touchorigin.png',
  touchend: 'res/images/touchend.png',
  fire: 'res/fire.png',
  warp: 'res/warp.png'
};

SpriteBullet = 1;

SpriteAsteroid = 2;

SpriteSpaceship = 3;

MersenneTwister = (function() {
  var LOWER_MASK, M, MATRIX_A, N, UPPER_MASK;

  N = 624;

  M = 397;

  MATRIX_A = -1727483681;

  UPPER_MASK = -2147483648;

  LOWER_MASK = 2147483647;

  MersenneTwister.prototype.mt = null;

  MersenneTwister.prototype.mti = N + 1;

  function MersenneTwister(seed) {
    var _i, _results;
    this.mt = (function() {
      _results = [];
      for (var _i = 0; 0 <= N ? _i < N : _i > N; 0 <= N ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    switch (typeof seed) {
      case 'number':
        this.init_genrand(seed);
        break;
      case 'object':
        this.init_genrand(seed, seed.length);
        break;
      default:
        this.init_genrand(Date.now() % LOWER_MASK);
    }
  }


  /*
   * Generates a random boolean value.
   */

  MersenneTwister.prototype.nextBool = function() {
    return (this.genrand_int32() & 1) === 1;
  };


  /*
   * Generates a random real value from 0.0, inclusive, to 1.0, exclusive.
   */

  MersenneTwister.prototype.nextDouble = function() {
    return this.genrand_res53();
  };


  /*
   * Generates a random int value from 0, inclusive, to max, exclusive.
   */

  MersenneTwister.prototype.nextInt = function(max) {
    return ~~(this.genrand_res53() * max);
  };


  /*
   * initializes mt[N] with a seed
   */

  MersenneTwister.prototype.init_genrand = function(s) {
    this.mt[0] = s & -1;
    this.mti = 1;
    while (this.mti < N) {
      this.mt[this.mti] = 1812433253 * (this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)) + this.mti;

      /*
       * See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. #
       * In the previous versions, MSBs of the seed affect   #
       * only MSBs of the array mt[].                        #
       * 2002/01/09 modified by Makoto Matsumoto             #
       */
      this.mt[this.mti] = (this.mt[this.mti] & -1) >>> 0;

      /*
       * for >32 bit machines #
       */
      this.mti++;
    }
  };

  MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
    var i, j, k;
    this.init_genrand(19650218);
    i = 1;
    j = 0;
    k = N > key_length ? N : key_length;
    while (k > 0) {
      this.mt[i] = (this.mt[i] ^ ((this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)) * 1664525)) + init_key[j] + j;
      this.mt[i] &= -1;
      i++;
      j++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
      if (j >= key_length) {
        j = 0;
      }
      k--;
    }
    k = N - 1;
    while (k > 0) {
      this.mt[i] = (this.mt[i] ^ ((this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)) * 1566083941)) - i;
      this.mt[i] &= -1;
      i++;
      if (i >= N) {
        this.mt[0] = this.mt[N - 1];
        i = 1;
      }
      k--;
    }
    this.mt[0] = UPPER_MASK;
  };


  /*
   * generates a random number on [0,0xffffffff]-interval
   */

  MersenneTwister.prototype.genrand_int32 = function() {
    var kk, mag01, y;
    mag01 = [0, MATRIX_A];
    if (this.mti >= N) {
      if (this.mti === N + 1) {
        this.init_genrand(5489);
      }
      kk = 0;
      while (kk < N - M) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 1];
        kk++;
      }
      while (kk < N - 1) {
        y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
        this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 1];
        kk++;
      }
      y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
      this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 1];
      this.mti = 0;
    }
    y = this.mt[this.mti++];
    y ^= y >>> 11;
    y ^= (y << 7) & -1658038656;
    y ^= (y << 15) & -272236544;
    y ^= y >>> 18;
    return y >>> 0;
  };


  /*
  * generates a random number on [0,0x7fffffff]-interval
   */

  MersenneTwister.prototype.genrand_int31 = function() {
    return this.genrand_int32() >>> 1;
  };


  /*
   * generates a random number on [0,1]-real-interval
   */

  MersenneTwister.prototype.genrand_real1 = function() {
    return this.genrand_int32() * 2.32830643653869629e-10;
  };


  /*
   * generates a random number on [0,1)-real-interval
   */

  MersenneTwister.prototype.genrand_real2 = function() {
    return this.genrand_int32() * 2.32830643653869629e-10;
  };


  /*
   * generates a random number on (0,1)-real-interval
   */

  MersenneTwister.prototype.genrand_real3 = function() {
    return (this.genrand_int32() + 0.5) * 2.32830643653869629e-10;
  };


  /*
   * generates a random number on [0,1) with 53-bit resolution
   */

  MersenneTwister.prototype.genrand_res53 = function() {
    var a, b;
    a = this.genrand_int32() >>> 5;
    b = this.genrand_int32() >>> 6;
    return (a * 67108864.0 + b) * 1.11022302462515654e-16;
  };

  return MersenneTwister;

})();


/*
 * These real versions are due to Isaku Wada, 2002/01/09 added
 */

Properties = (function() {
  var _db, _name, _properties;

  function Properties() {}

  _db = null;

  _name = '';

  _properties = null;

  Properties.init = function(name, properties) {
    var isNew, key, val;
    _name = name;
    _properties = properties;
    _db = new localStorageDB(_name, cc.sys.localStorage);
    isNew = _db.isNew();
    if (isNew) {
      _db.createTable('settings', ['name', 'value']);
      _db.createTable('leaderboard', ['date', 'score']);
      for (key in _properties) {
        val = _properties[key];
        _db.insert('settings', {
          name: key,
          value: val
        });
      }
      return _db.commit();
    }
  };


  /*
   * Get Game Property from local storage
   *
   * @param property name
   * @return property value
   */

  Properties.get = function(prop) {
    return _db.queryAll('settings', {
      query: {
        name: prop
      }
    })[0].value;
  };


  /*
   * Set Game Property in local storage
   *
   * @param property name
   * @param property value
   * @return nothing
   */

  Properties.set = function(prop, value) {
    _db.update('settings', {
      name: prop
    }, function(row) {
      row.value = value;
      return row;
    });
    _db.commit();
  };

  return Properties;

})();

ZRandom = (function() {
  function ZRandom() {}


  /*
   * Generates a random boolean value.
   */

  ZRandom.prototype.nextBool = function() {
    return ((~~(Math.random() * 32767)) & 1) === 1;
  };


  /*
   * Generates a random real value from 0.0, inclusive, to 1.0, exclusive.
   */

  ZRandom.prototype.nextDouble = function() {
    return Math.random();
  };


  /*
   * Generates a random int value from 0, inclusive, to max, exclusive.
   */

  ZRandom.prototype.nextInt = function(max) {
    return ~~(Math.random() * max);
  };

  return ZRandom;

})();

AsteroidDeathView = (function() {
  AsteroidDeathView.prototype.dots = null;

  AsteroidDeathView.prototype.x = 0;

  AsteroidDeathView.prototype.y = 0;

  AsteroidDeathView.prototype.rotation = 0;

  AsteroidDeathView.prototype.stage = null;

  AsteroidDeathView.prototype.first = true;

  function AsteroidDeathView(game, radius) {
    this.animate = __bind(this.animate, this);
    var dot, i, _i;
    this.dots = [];
    for (i = _i = 0; _i < 8; i = ++_i) {
      dot = new Dot(game, game.rnd, radius);
      this.dots.push(dot);
    }
  }

  AsteroidDeathView.prototype.animate = function(time) {
    var dot, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (this.first) {
      this.first = false;
      _ref = this.dots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dot = _ref[_i];
        dot.graphics.x = this.x;
        dot.graphics.y = this.y;
      }
    }
    _ref1 = this.dots;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      dot = _ref1[_j];
      dot.graphics.x += dot.velocity.x * time;
      _results.push(dot.graphics.y += dot.velocity.y * time);
    }
    return _results;
  };

  AsteroidDeathView.prototype.dispose = function() {
    var dot, _i, _len, _ref, _results;
    _ref = this.dots;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dot = _ref[_i];
      _results.push(dot.graphics.removeFromParent(true));
    }
    return _results;
  };

  return AsteroidDeathView;

})();

Dot = (function() {
  Dot.prototype.velocity = null;

  Dot.prototype.graphics = null;

  Dot.prototype.x = 0;

  Dot.prototype.y = 0;

  function Dot(game, rnd, maxDistance) {
    var angle, color, distance, speed, x, y;
    this.graphics = new cc.DrawNode();
    game.addChild(this.graphics);
    color = cc.color(255, 255, 255, 255);
    angle = rnd.nextDouble() * 2 * Math.PI;
    distance = rnd.nextDouble() * maxDistance;
    x = Math.cos(angle) * distance;
    y = Math.sin(angle) * distance;
    this.graphics.drawDot(cc.p(x, y), 1, color);
    speed = rnd.nextDouble() * 10 + 10;
    this.velocity = new Point(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  return Dot;

})();

AsteroidView = (function() {
  AsteroidView.prototype.graphics = null;

  function AsteroidView(game, radius) {
    var angle, color, length, posX, posY, rnd, v;
    rnd = game.rnd;
    this.graphics = new cc.DrawNode();
    game.addChild(this.graphics);
    color = cc.color(255, 255, 255, 255);
    angle = 0;
    v = [cc.p(radius, 0)];
    while (angle < Math.PI * 2) {
      length = (0.75 + rnd.nextDouble() * 0.25) * radius;
      posX = Math.cos(angle) * length;
      posY = Math.sin(angle) * length;
      v.push(cc.p(posX, posY));
      angle += rnd.nextDouble() * 0.5;
    }
    v.push(cc.p(radius, 0));
    this.graphics.drawPoly(v, color, 1, color);
  }

  AsteroidView.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  return AsteroidView;

})();

BackgroundView = (function() {
  BackgroundView.prototype.graphics = null;

  function BackgroundView(game, path) {
    this.graphics = new cc.Sprite(path);
    game.addChild(this.graphics);
  }

  BackgroundView.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  return BackgroundView;

})();

BulletView = (function() {
  BulletView.prototype.graphics = null;

  function BulletView(game) {
    var color;
    this.graphics = new cc.DrawNode();
    game.addChild(this.graphics);
    color = cc.color(255, 255, 255, 255);
    this.graphics.drawDot(cc.p(0, 0), 2, color);
  }

  BulletView.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  return BulletView;

})();

GameController = (function() {
  var DRAW_DOT, DRAW_RECT, MultiTouchListener;

  DRAW_DOT = 1;

  DRAW_RECT = 2;

  GameController.prototype.fontName = 'Arial';

  GameController.prototype.controls = null;


  /**
   * GameController
   *
   * @param game cc.Level object containing the game screen
   * @param options hash
   */

  function GameController(game, options) {
    this.game = game;
    this.fontName = options.fontName || this.fontName;
    this.controls = [];
  }


  /*
   * Add Button
   *
   * @param position  cc.Point button x,y location
   * @param text      String button text
   * @param size      Number text font size
   * @param radius    Number button radius
   * @param height    Number button height
   * @param width     Number button width
   * @param color     cc.Color button color
   * @param onStart   Function event callback
   * @param onMove    Function event callback
   * @param onEnd     Function event callback
   */

  GameController.prototype.addButton = function(options) {
    var control;
    control = new cc.DrawNode();
    if (options.radius != null) {
      control.drawDot(cc.p(0, 0), options.radius, options.color);
      control.attr({
        height: options.radius * 2,
        width: options.radius * 2,
        drawShape: DRAW_DOT
      });
    } else if (options.width != null) {
      control.drawRect(cc.p(0, 0), cc.p(options.width, options.height), options.color, 1, options.color);
      control.height = options.height;
      control.width = options.width;
      control.drawShape = DRAW_RECT;
    }
    if (options.text != null) {
      control.addChild(new cc.LabelTTF(options.text, this.fontName, options.size));
    }
    control.setPosition(options.position);
    control.onStart = options.onStart;
    control.onMove = options.onMove;
    control.onEnd = options.onEnd;
    this.controls.push(control);
    this.game.addChild(control);
    cc.eventManager.addListener(new MultiTouchListener(control), control);
    return control;
  };


  /*
   * Add DPad
   *
   * @param position  cc.Point button x,y location
   * @param radius    Number button radius
   * @param color     cc.Color button color
   * @param up        events
   * @param down      events
   * @param left      events
   * @param right     events
   */

  GameController.prototype.addDPad = function(options) {
    var dpad, x, y;
    dpad = new cc.DrawNode();
    dpad.drawDot(cc.p(0, 0), options.radius, options.color);
    dpad.height = options.radius * 2;
    dpad.width = options.radius * 2;
    dpad.setPosition(options.position);
    x = options.position.x;
    y = options.position.y;
    this.controls.push(dpad);
    this.game.addChild(dpad);
    if (options.up != null) {
      this.addButton({
        position: cc.p(x - (options.radius * 0.54), y + (options.radius * 0.57)),
        width: options.radius * 1.08,
        height: options.radius * 0.81,
        color: cc.color(0, 0, 0, 255),
        onStart: options.up.onStart,
        onMove: options.up.onMove,
        onEnd: options.up.onEnd
      });
    }
    if (options.down != null) {
      this.addButton({
        position: cc.p(x - (options.radius * 0.54), y - (options.radius * 1.22)),
        width: options.radius * 1.08,
        height: options.radius * 0.81,
        color: cc.color(0, 0, 0, 255),
        onStart: options.down.onStart,
        onMove: options.down.onMove,
        onEnd: options.down.onEnd
      });
    }
    if (options.left != null) {
      this.addButton({
        position: cc.p(x - (options.radius * 1.14), y - (options.radius * 0.52)),
        width: options.radius * 0.81,
        height: options.radius * 1.08,
        color: cc.color(0, 0, 0, 255),
        onStart: options.left.onStart,
        onMove: options.left.onMove,
        onEnd: options.left.onEnd
      });
    }
    if (options.right != null) {
      this.addButton({
        position: cc.p(x + (options.radius * 0.32), y - (options.radius * 0.52)),
        width: options.radius * 0.81,
        height: options.radius * 1.08,
        color: cc.color(0, 0, 0, 255),
        onStart: options.right.onStart,
        onMove: options.right.onMove,
        onEnd: options.right.onEnd
      });
    }
    return dpad;
  };

  GameController.prototype.addJoystick = function(pos, size, radius, color) {
    var joystick;
    joystick = new cc.DrawNode();
    return joystick;
  };

  MultiTouchListener = (function() {
    MultiTouchListener.prototype.event = cc.EventListener.TOUCH_ALL_AT_ONCE;

    MultiTouchListener.prototype.swallowTouches = true;

    MultiTouchListener.prototype.control = null;

    function MultiTouchListener(control) {
      this.control = control;
      this.onTouchesEnded = __bind(this.onTouchesEnded, this);
      this.onTouchesMoved = __bind(this.onTouchesMoved, this);
      this.onTouchesBegan = __bind(this.onTouchesBegan, this);

      /*
       * onTouchBegan
       *
       * @param touch
       * @param event
       * @return none
       */
    }

    MultiTouchListener.prototype.onTouchesBegan = function(touches, event) {
      var point, rect, touch, _base;
      touch = touches[0];
      point = touch.getLocation();
      rect = this.control.getBoundingBox();
      if (this.control.drawShape === DRAW_DOT) {
        point.x += rect.width / 2;
        point.y += rect.height / 2;
      }
      if (cc.rectContainsPoint(rect, point)) {
        if (typeof (_base = this.control).onStart === "function") {
          _base.onStart(touch, point);
        }
        return true;
      }
    };


    /*
     * onTouchMoved
     *
     * @param touch
     * @param event
     * @return none
     */

    MultiTouchListener.prototype.onTouchesMoved = function(touches, event) {
      var point, rect, touch, _base;
      touch = touches[0];
      point = touch.getLocation();
      rect = this.control.getBoundingBox();
      if (this.control.drawShape === DRAW_DOT) {
        point.x += rect.width / 2;
        point.y += rect.height / 2;
      }
      if (typeof (_base = this.control).onMove === "function") {
        _base.onMove(touch, point);
      }
      return true;
    };


    /*
     * onTouchEnded
     *
     * @param touch
     * @param event
     * @return none
     */

    MultiTouchListener.prototype.onTouchesEnded = function(touches, event) {
      var point, rect, touch, _base;
      touch = touches[0];
      point = touch.getLocation();
      rect = this.control.getBoundingBox();
      if (this.control.drawShape === DRAW_DOT) {
        point.x += rect.width / 2;
        point.y += rect.height / 2;
      }
      if (typeof (_base = this.control).onEnd === "function") {
        _base.onEnd(touch, point);
      }
      return true;
    };

    return MultiTouchListener;

  })();

  return GameController;

})();

HudView = (function() {
  HudView.prototype.graphics = null;

  HudView.prototype.score = null;

  HudView.prototype.lives = null;

  HudView.prototype.x = 0;

  HudView.prototype.y = 0;

  HudView.prototype.rotation = 0;

  function HudView(game, stage) {
    this.setScore = __bind(this.setScore, this);
    this.setLives = __bind(this.setLives, this);
    var size;
    size = cc.director.getWinSize();
    this.graphics = new cc.DrawNode();
    this.graphics.drawRect(cc.p(0, size.height / 2 + 40), cc.p(30, size.height / 2 - 40), cc.color(0xc0, 0xc0, 0xc0, 127));
    game.addChild(this.graphics);
    this.score = cc.LabelTTF.create('SCORE: 0', 'opendyslexic', 18);
    this.score.setPosition(cc.p(size.width - 130, size.height - 20));
    game.addChild(this.score);
    this.setScore(0);
    this.setLives(3);
  }

  HudView.prototype.dispose = function() {
    this.graphics.removeFromParent(true);
    return this.score.removeFromParent(true);
  };

  HudView.prototype.setLives = function(lives) {};

  HudView.prototype.setScore = function(score) {
    this.score.setString("SCORE: " + score);
  };

  return HudView;

})();


/*
 * Provide user input
 */

KeyPoll = (function() {
  KeyPoll.KEY_LEFT = 37;

  KeyPoll.KEY_UP = 38;

  KeyPoll.KEY_RIGHT = 39;

  KeyPoll.KEY_Z = 90;

  KeyPoll.KEY_W = 87;

  KeyPoll.KEY_SPACE = 32;

  KeyPoll.prototype.states = null;

  KeyPoll.prototype.keys = [KeyPoll.KEY_LEFT, KeyPoll.KEY_RIGHT, KeyPoll.KEY_Z, KeyPoll.KEY_UP, KeyPoll.KEY_SPACE];

  function KeyPoll(game) {
    this.game = game;
    this.isUp = __bind(this.isUp, this);
    this.isDown = __bind(this.isDown, this);
    this.states = {};
    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed: (function(_this) {
        return function(keyCode, event) {
          _this.states[keyCode] = true;
        };
      })(this),
      onKeyReleased: (function(_this) {
        return function(keyCode, event) {
          if (_this.states[keyCode]) {
            _this.states[keyCode] = false;
          }
        };
      })(this)
    }, this.game);
  }

  KeyPoll.prototype.isDown = function(keyCode) {
    return this.states[keyCode];
  };

  KeyPoll.prototype.isUp = function(keyCode) {
    return !this.states[keyCode];
  };

  return KeyPoll;

})();

Point = (function() {
  Point.prototype.x = 0;

  Point.prototype.y = 0;

  function Point(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  Point.distance = function(point1, point2) {
    var dx, dy;
    dx = point1.x - point2.x;
    dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Point.prototype.distanceSquaredTo = function(targetPoint) {
    var dx, dy;
    dx = this.x - targetPoint.x;
    dy = this.y - targetPoint.y;
    return dx * dx + dy * dy;
  };

  Point.prototype.distanceTo = function(targetPoint) {
    var dx, dy;
    dx = this.x - targetPoint.x;
    dy = this.y - targetPoint.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return Point;

})();

SpaceshipDeathView = (function() {
  SpaceshipDeathView.prototype.shape1 = null;

  SpaceshipDeathView.prototype.shape2 = null;

  SpaceshipDeathView.prototype.vel1 = null;

  SpaceshipDeathView.prototype.vel2 = null;

  SpaceshipDeathView.prototype.rot1 = null;

  SpaceshipDeathView.prototype.rot2 = null;

  SpaceshipDeathView.prototype.first = true;

  SpaceshipDeathView.prototype.x = 0;

  SpaceshipDeathView.prototype.y = 0;

  SpaceshipDeathView.prototype.rotation = 0;

  SpaceshipDeathView.prototype.check = true;

  function SpaceshipDeathView(game) {
    this.animate = __bind(this.animate, this);
    var color, rnd, v;
    rnd = game.rnd;
    color = cc.color(255, 255, 255, 255);
    this.shape1 = new cc.DrawNode();
    game.addChild(this.shape1);
    v = [cc.p(10, 0), cc.p(-7, 7), cc.p(-4, 0), cc.p(10, 0)];
    this.shape1.drawPoly(v, color, 1, color);
    this.shape2 = new cc.DrawNode();
    game.addChild(this.shape2);
    v = [cc.p(10, 0), cc.p(-7, -7), cc.p(-4, 0), cc.p(10, 0)];
    this.shape2.drawPoly(v, color, 1, color);
    this.vel1 = new Point(rnd.nextDouble() * 10 - 5, rnd.nextDouble() * 10 + 10);
    this.vel2 = new Point(rnd.nextDouble() * 10 - 5, -(rnd.nextDouble() * 10 + 10));
    this.rot1 = rnd.nextDouble() * 300 - 150;
    this.rot2 = rnd.nextDouble() * 300 - 150;
  }

  SpaceshipDeathView.prototype.dispose = function() {
    this.shape1.removeFromParent(true);
    return this.shape2.removeFromParent(true);
  };

  SpaceshipDeathView.prototype.animate = function(time) {
    if (this.first) {
      this.first = false;
      this.shape1.setPosition(cc.p(this.x, this.y));
      this.shape2.setPosition(cc.p(this.x, this.y));
      this.shape1.setRotation(this.rotation);
      this.shape2.setRotation(this.rotation);
    }
    this.shape1.setPositionX(this.shape1.getPositionX() + this.vel1.x * time);
    this.shape1.setPositionY(this.shape1.getPositionY() + this.vel1.y * time);
    this.shape1.setRotation(this.shape1.getRotation() + this.rot1 * time);
    this.shape2.setPositionX(this.shape2.getPositionX() + this.vel2.x * time);
    this.shape2.setPositionY(this.shape2.getPositionY() + this.vel2.y * time);
    this.shape2.setRotation(this.shape2.getRotation() + this.rot2 * time);
  };

  return SpaceshipDeathView;

})();

SpaceshipView = (function() {
  SpaceshipView.prototype.graphics = null;

  function SpaceshipView(game) {
    this.game = game;
    this.graphics = new cc.DrawNode();
    this.game.addChild(this.graphics);
    this.draw(cc.color(255, 255, 255, 255));
  }

  SpaceshipView.prototype.dispose = function() {
    return this.graphics.removeFromParent(true);
  };

  SpaceshipView.prototype.draw = function(color) {
    var v;
    v = [cc.p(10, 0), cc.p(-7, 7), cc.p(-4, 0), cc.p(-7, -7), cc.p(10, 0)];
    return this.graphics.drawPoly(v, color, 1, color);
  };

  return SpaceshipView;

})();

Sound = (function() {
  Sound.volume = 0.5;

  Sound.enabled = true;

  Sound.FACTOR = 2;

  Sound.preload = function(src) {
    var audio;
    audio = new window.Audio();
    audio.src = src;
    audio.volume = 0;
    audio.play();
    return src;
  };

  Sound.prototype.src = '';

  Sound.prototype.audio = null;

  function Sound() {
    this.audio = new window.Audio();
    this.audio.src = this.src;
    this.audio.load();
  }

  Sound.prototype.loop = function() {
    return this;
  };

  Sound.prototype.play = function() {
    if (Sound.enabled) {
      this.audio.volume = Sound.volume;
      this.audio.play();
    }
    return this;
  };

  Sound.prototype.pause = function() {
    this.audio.pause();
    return this;
  };

  return Sound;

})();

WaitForStartView = (function() {
  var Signal0, isDesktop, isTouch;

  WaitForStartView.count = 0;

  Signal0 = ash.signals.Signal0;

  WaitForStartView.prototype.x = 0;

  WaitForStartView.prototype.y = 0;

  WaitForStartView.prototype.rotation = 0;

  WaitForStartView.prototype.text1 = null;

  WaitForStartView.prototype.text2 = null;

  WaitForStartView.prototype.text3 = null;

  WaitForStartView.prototype.click = null;

  isTouch = cc.sys.isMobile;

  isDesktop = !cc.sys.isMobile;

  function WaitForStartView(game) {
    var size, x;
    this.game = game;
    this.onTouchEnded = __bind(this.onTouchEnded, this);
    this.onTouchMoved = __bind(this.onTouchMoved, this);
    this.onTouchBegan = __bind(this.onTouchBegan, this);
    this.start = __bind(this.start, this);
    this.click = new Signal0();
    size = cc.director.getWinSize();
    x = Math.floor(size.width / 2);
    if ((WaitForStartView.count++) === 1) {
      this.text1 = cc.LabelTTF.create('GAME OVER', 'opendyslexic', 40);
      this.text1.setPosition(cc.p(x, 200));
    } else {
      this.text1 = cc.LabelTTF.create('ASTEROIDS', 'opendyslexic', 40);
      this.text1.setPosition(cc.p(x, 200));
    }
    this.game.addChild(this.text1);
    if (isTouch) {
      this.text2 = cc.LabelTTF.create('TOUCH TO START', 'opendyslexic', 12);
      this.text2.setPosition(cc.p(x, 175));
    } else {
      this.text2 = cc.LabelTTF.create('CLICK TO START', 'opendyslexic', 12);
      this.text2.setPosition(cc.p(x, 175));
    }
    this.game.addChild(this.text2);
    if (isDesktop) {
      this.text3 = cc.LabelTTF.create('Z ~ Fire  |  SPACE ~ Warp  |  Left/Right ~ Turn  |  Up ~ Accelerate', 'opendyslexic', 10);
      this.text3.setPosition(cc.p(x, 40));
      this.game.addChild(this.text3);
    }
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
      onTouchMoved: this.onTouchMoved,
      onTouchEnded: this.onTouchEnded
    }, this.text1);
  }

  WaitForStartView.prototype.start = function(data) {};

  WaitForStartView.prototype.onTouchBegan = function(touch, event) {
    this.game.removeChild(this.text1);
    this.game.removeChild(this.text2);
    if (this.text3 != null) {
      this.game.removeChild(this.text3);
    }
    return this.click.dispatch();
  };

  WaitForStartView.prototype.onTouchMoved = function(touch, event) {};

  WaitForStartView.prototype.onTouchEnded = function(touch, event) {};

  return WaitForStartView;

})();


/*
 * Components
 */

Components = (function() {
  var Animation, Asteroid, Audio, Bullet, Collision, DeathThroes, Display, GameState, Gun, GunControls, Hud, MotionControls, Physics, Position, Spaceship, WaitForStart;
  return {
    Animation: Animation = (function() {
      Animation.prototype.animation = null;

      function Animation(animation) {
        this.animation = animation;
      }

      return Animation;

    })(),
    Asteroid: Asteroid = (function() {
      Asteroid.prototype.fsm = null;

      function Asteroid(fsm) {
        this.fsm = fsm;
      }

      return Asteroid;

    })(),
    Audio: Audio = (function() {
      Audio.prototype.toPlay = null;

      function Audio() {
        this.toPlay = [];
      }

      Audio.prototype.play = function(sound) {
        return this.toPlay.push(sound);
      };

      return Audio;

    })(),
    Bullet: Bullet = (function() {
      Bullet.prototype.lifeRemaining = 0;

      function Bullet(lifeRemaining) {
        this.lifeRemaining = lifeRemaining;
      }

      return Bullet;

    })(),
    Collision: Collision = (function() {
      Collision.prototype.radius = 0;

      function Collision(radius) {
        this.radius = radius;
      }

      return Collision;

    })(),
    DeathThroes: DeathThroes = (function() {
      DeathThroes.prototype.countdown = 0;

      DeathThroes.prototype.body = null;

      function DeathThroes(duration) {
        this.countdown = duration;
      }

      return DeathThroes;

    })(),
    Display: Display = (function() {
      Display.prototype.graphic = 0;

      function Display(graphic) {
        this.graphic = graphic;
      }

      return Display;

    })(),
    GameState: GameState = (function() {
      function GameState() {}

      GameState.prototype.lives = 3;

      GameState.prototype.level = 0;

      GameState.prototype.hits = 0;

      GameState.prototype.bonus = 0;

      GameState.prototype.playing = false;

      GameState.prototype.setForStart = function() {
        this.lives = 3;
        this.level = 0;
        this.hits = 0;
        this.playing = true;
      };

      return GameState;

    })(),
    Gun: Gun = (function() {
      Gun.prototype.shooting = false;

      Gun.prototype.offsetFromParent = null;

      Gun.prototype.timeSinceLastShot = 0;

      Gun.prototype.offsetFromParent = null;

      function Gun(offsetX, offsetY, minimumShotInterval, bulletLifetime) {
        this.minimumShotInterval = minimumShotInterval;
        this.bulletLifetime = bulletLifetime;
        this.shooting = false;
        this.offsetFromParent = null;
        this.timeSinceLastShot = 0;
        this.offsetFromParent = new Point(offsetX, offsetY);
      }

      return Gun;

    })(),
    GunControls: GunControls = (function() {
      GunControls.prototype.trigger = 0;

      function GunControls(trigger) {
        this.trigger = trigger;
      }

      return GunControls;

    })(),
    Hud: Hud = (function() {
      Hud.prototype.view = null;

      Hud.prototype.leaderboard = false;

      function Hud(view) {
        this.view = view;
      }

      return Hud;

    })(),
    MotionControls: MotionControls = (function() {
      MotionControls.prototype.left = 0;

      MotionControls.prototype.right = 0;

      MotionControls.prototype.accelerate = 0;

      MotionControls.prototype.warp = 0;

      MotionControls.prototype.accelerationRate = 0;

      MotionControls.prototype.rotationRate = 0;

      function MotionControls(left, right, accelerate, warp, accelerationRate, rotationRate) {
        this.left = left;
        this.right = right;
        this.accelerate = accelerate;
        this.warp = warp;
        this.accelerationRate = accelerationRate;
        this.rotationRate = rotationRate;
      }

      return MotionControls;

    })(),
    Physics: Physics = (function() {
      Physics.prototype.body = null;

      Physics.prototype.previousX = 0;

      Physics.prototype.previousY = 0;

      Physics.prototype.previousAngle = 0;

      Physics.prototype.type = 0;

      Physics.prototype.entity = null;

      function Physics(body, type, entity) {
        this.body = body;
        this.type = type;
        this.entity = entity;
      }

      return Physics;

    })(),
    Position: Position = (function() {
      Position.prototype.position = null;

      Position.prototype.rotation = 0;

      function Position(x, y, rotation) {
        this.rotation = rotation != null ? rotation : 0;
        this.position = new Point(x, y);
      }

      return Position;

    })(),
    Spaceship: Spaceship = (function() {
      Spaceship.prototype.fsm = null;

      function Spaceship(fsm) {
        this.fsm = fsm;
      }

      return Spaceship;

    })(),
    WaitForStart: WaitForStart = (function() {
      WaitForStart.prototype.waitForStart = null;

      WaitForStart.prototype.startGame = false;

      function WaitForStart(waitForStart) {
        this.waitForStart = waitForStart;
        this.setStartGame = __bind(this.setStartGame, this);
        this.waitForStart.click.add(this.setStartGame);
      }

      WaitForStart.prototype.setStartGame = function() {
        this.startGame = true;
      };

      return WaitForStart;

    })()
  };
})();


/*
 * Node templates
 */

Nodes = (function() {
  var AnimationNode, AsteroidCollisionNode, AudioNode, BulletAgeNode, BulletCollisionNode, DeathThroesNode, GameNode, GunControlNode, HudNode, MovementNode, PhysicsControlNode, PhysicsNode, RenderNode, SpaceshipNode, WaitForStartNode;
  return {
    AnimationNode: AnimationNode = (function() {
      function AnimationNode() {}

      AnimationNode.prototype.animation = Components.Animation;

      return AnimationNode;

    })(),
    AsteroidCollisionNode: AsteroidCollisionNode = (function() {
      function AsteroidCollisionNode() {}

      AsteroidCollisionNode.prototype.asteroid = Components.Asteroid;

      AsteroidCollisionNode.prototype.position = Components.Position;

      AsteroidCollisionNode.prototype.collision = Components.Collision;

      AsteroidCollisionNode.prototype.audio = Components.Audio;

      AsteroidCollisionNode.prototype.physics = Components.Physics;

      return AsteroidCollisionNode;

    })(),
    AudioNode: AudioNode = (function() {
      function AudioNode() {}

      AudioNode.prototype.audio = Components.Audio;

      return AudioNode;

    })(),
    BulletAgeNode: BulletAgeNode = (function() {
      function BulletAgeNode() {}

      BulletAgeNode.prototype.bullet = Components.Bullet;

      BulletAgeNode.prototype.physics = Components.Physics;

      BulletAgeNode.prototype.display = Components.Display;

      return BulletAgeNode;

    })(),
    BulletCollisionNode: BulletCollisionNode = (function() {
      function BulletCollisionNode() {}

      BulletCollisionNode.prototype.bullet = Components.Bullet;

      BulletCollisionNode.prototype.position = Components.Position;

      BulletCollisionNode.prototype.physics = Components.Physics;

      return BulletCollisionNode;

    })(),
    DeathThroesNode: DeathThroesNode = (function() {
      function DeathThroesNode() {}

      DeathThroesNode.prototype.dead = Components.DeathThroes;

      DeathThroesNode.prototype.display = Components.Display;

      return DeathThroesNode;

    })(),
    GameNode: GameNode = (function() {
      function GameNode() {}

      GameNode.prototype.state = Components.GameState;

      return GameNode;

    })(),
    GunControlNode: GunControlNode = (function() {
      function GunControlNode() {}

      GunControlNode.prototype.audio = Components.Audio;

      GunControlNode.prototype.control = Components.GunControls;

      GunControlNode.prototype.gun = Components.Gun;

      GunControlNode.prototype.position = Components.Position;

      return GunControlNode;

    })(),
    HudNode: HudNode = (function() {
      function HudNode() {}

      HudNode.prototype.state = Components.GameState;

      HudNode.prototype.hud = Components.Hud;

      return HudNode;

    })(),
    MovementNode: MovementNode = (function() {
      function MovementNode() {}

      MovementNode.prototype.position = Components.Position;

      return MovementNode;

    })(),
    PhysicsControlNode: PhysicsControlNode = (function() {
      function PhysicsControlNode() {}

      PhysicsControlNode.prototype.control = Components.MotionControls;

      PhysicsControlNode.prototype.physics = Components.Physics;

      PhysicsControlNode.prototype.display = Components.Display;

      return PhysicsControlNode;

    })(),
    PhysicsNode: PhysicsNode = (function() {
      function PhysicsNode() {}

      PhysicsNode.prototype.position = Components.Position;

      PhysicsNode.prototype.physics = Components.Physics;

      return PhysicsNode;

    })(),
    RenderNode: RenderNode = (function() {
      function RenderNode() {}

      RenderNode.prototype.position = Components.Position;

      RenderNode.prototype.display = Components.Display;

      return RenderNode;

    })(),
    SpaceshipNode: SpaceshipNode = (function() {
      function SpaceshipNode() {}

      SpaceshipNode.prototype.spaceship = Components.Spaceship;

      SpaceshipNode.prototype.position = Components.Position;

      return SpaceshipNode;

    })(),
    WaitForStartNode: WaitForStartNode = (function() {
      function WaitForStartNode() {}

      WaitForStartNode.prototype.wait = Components.WaitForStart;

      return WaitForStartNode;

    })()
  };
})();

Entities = (function() {

  /*
   * Imports
   */
  var Animation, Asteroid, Audio, Bullet, Collision, DeathThroes, Display, Entity, EntityStateMachine, GameState, Gun, GunControls, Hud, MotionControls, Physics, Position, Spaceship, WaitForStart, get;

  Animation = Components.Animation;

  Asteroid = Components.Asteroid;

  Audio = Components.Audio;

  Bullet = Components.Bullet;

  Collision = Components.Collision;

  DeathThroes = Components.DeathThroes;

  Display = Components.Display;

  GameState = Components.GameState;

  Gun = Components.Gun;

  GunControls = Components.GunControls;

  Hud = Components.Hud;

  MotionControls = Components.MotionControls;

  Physics = Components.Physics;

  Position = Components.Position;

  Spaceship = Components.Spaceship;

  WaitForStart = Components.WaitForStart;

  Entity = ash.core.Entity;

  EntityStateMachine = ash.fsm.EntityStateMachine;

  Entities.ASTEROID = 1;

  Entities.SPACESHIP = 2;

  Entities.BULLET = 3;

  Entities.prototype.LEFT = KeyPoll.KEY_LEFT;

  Entities.prototype.RIGHT = KeyPoll.KEY_RIGHT;

  Entities.prototype.THRUST = KeyPoll.KEY_UP;

  Entities.prototype.FIRE = KeyPoll.KEY_Z;

  Entities.prototype.WARP = KeyPoll.KEY_SPACE;

  get = function(prop) {
    return parseFloat(Properties.get(prop));
  };

  Entities.prototype.game = null;

  Entities.prototype.ash = null;

  Entities.prototype.world = null;

  Entities.prototype.waitEntity = null;

  Entities.prototype.rnd = null;

  Entities.prototype.bulletId = 0;

  Entities.prototype.asteroidId = 0;

  Entities.prototype.spaceshipId = 0;

  function Entities(game) {
    this.game = game;
    this.createUserBullet = __bind(this.createUserBullet, this);
    this.createSpaceship = __bind(this.createSpaceship, this);
    this.ash = this.game.ash;
    this.rnd = this.game.rnd;
    this.world = this.game.world;
  }

  Entities.prototype.destroyEntity = function(entity) {
    this.ash.removeEntity(entity);
  };


  /*
   * Game State
   */

  Entities.prototype.createGame = function() {
    var gameEntity, hud;
    hud = new HudView(this.game);
    gameEntity = new Entity('game').add(new GameState()).add(new Hud(hud));
    this.ash.addEntity(gameEntity);
    return gameEntity;
  };


  /*
   * Start...
   */

  Entities.prototype.createWaitForClick = function() {
    var waitView;
    waitView = new WaitForStartView(this.game);
    this.waitEntity = new Entity('wait').add(new WaitForStart(waitView));
    this.waitEntity.get(WaitForStart).startGame = false;
    this.ash.addEntity(this.waitEntity);
    return this.waitEntity;
  };


  /*
   * Create an Asteroid with FSM Animation
   */

  Entities.prototype.createAsteroid = function(radius, x, y, speedFactor) {
    var asteroid, body, deathView, fsm, liveView, shape, v1, v2;
    if (speedFactor == null) {
      speedFactor = 1;
    }

    /*
     * Asteroid simulation - chipmunk
     */
    body = new cp.Body(1, cp.momentForCircle(1, 0, radius, cp.v(0, 0)));
    body.p = cc.p(x, y);
    v1 = (this.rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius);
    v2 = (this.rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius);
    v1 = v1 * speedFactor;
    v2 = v2 * speedFactor;
    body.applyImpulse(cp.v(v1, v2), cp.v(0, 0));
    this.world.addBody(body);
    shape = new cp.CircleShape(body, radius, cp.v(0, 0));
    shape.setCollisionType(SpriteAsteroid);
    shape.setSensor(true);
    this.world.addShape(shape);

    /*
     * Asteroid entity
     */
    asteroid = new Entity();
    fsm = new EntityStateMachine(asteroid);
    liveView = new AsteroidView(this.game, radius);
    fsm.createState('alive').add(Physics).withInstance(new Physics(body, Entities.ASTEROID, asteroid)).add(Collision).withInstance(new Collision(radius)).add(Display).withInstance(new Display(liveView));
    deathView = new AsteroidDeathView(this.game, radius);
    fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(3)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
    asteroid.add(new Asteroid(fsm)).add(new Position(x, y, 0)).add(new Audio());
    fsm.changeState('alive');
    body.userData = {
      type: Entities.ASTEROID,
      entity: asteroid
    };
    this.ash.addEntity(asteroid);
    return asteroid;
  };


  /*
   * Create Player Spaceship with FSM Animation
   */

  Entities.prototype.createSpaceship = function() {
    var body, deathView, fsm, liveView, shape, size, spaceship, verts, x, y;
    size = cc.director.getWinSize();
    x = this.rnd.nextInt(size.width);
    y = this.rnd.nextInt(size.height);
    verts = [10.0, 0.0, -7.0, -7.0, -7.0, 7.0];

    /*
     * Spaceship simulation
     */
    body = new cp.Body(1, cp.momentForPoly(1, verts, cp.v(0, 0)));
    body.p = cc.p(x, y);
    body.applyImpulse(cp.v(0, 0), cp.v(0, 0));
    this.world.addBody(body);
    shape = new cp.PolyShape(body, verts, cp.v(0, 0));
    shape.setCollisionType(SpriteSpaceship);
    shape.setSensor(true);
    this.world.addShape(shape);

    /*
     * Spaceship entity
     */
    spaceship = new Entity();
    fsm = new EntityStateMachine(spaceship);
    liveView = new SpaceshipView(this.game);
    fsm.createState('playing').add(Physics).withInstance(new Physics(body, Entities.SPACESHIP, spaceship)).add(MotionControls).withInstance(new MotionControls(this.LEFT, this.RIGHT, this.THRUST, this.WARP, 100, 3)).add(Gun).withInstance(new Gun(8, 0, 0.3, 2)).add(GunControls).withInstance(new GunControls(this.FIRE)).add(Collision).withInstance(new Collision(9)).add(Display).withInstance(new Display(liveView));
    deathView = new SpaceshipDeathView(this.game);
    fsm.createState('destroyed').add(DeathThroes).withInstance(new DeathThroes(5)).add(Display).withInstance(new Display(deathView)).add(Animation).withInstance(new Animation(deathView));
    spaceship.add(new Spaceship(fsm)).add(new Position(x, y, 0)).add(new Audio());
    fsm.changeState('playing');
    body.userData = {
      type: Entities.SPACESHIP,
      entity: spaceship
    };
    this.ash.addEntity(spaceship);
    return spaceship;
  };


  /*
   * Create a Bullet
   */

  Entities.prototype.createUserBullet = function(gun, parentPosition) {
    var body, bullet, bulletView, cos, shape, sin, size, v1, v2, x, y;
    cos = Math.cos(parentPosition.rotation);
    sin = Math.sin(parentPosition.rotation);
    x = cos * gun.offsetFromParent.x - sin * gun.offsetFromParent.y + parentPosition.position.x;
    y = sin * gun.offsetFromParent.x + cos * gun.offsetFromParent.y + parentPosition.position.y;
    size = cc.director.getWinSize();
    x += size.width / 2;
    y += size.height / 2;

    /*
     * Bullet simulation
     */
    body = new cp.Body(1, cp.momentForCircle(1, 0, 1, cp.v(0, 0)));
    body.p = cc.p(x, y);
    v1 = cos * get('bulletLinearVelocity');
    v2 = sin * get('bulletLinearVelocity');
    body.applyImpulse(cp.v(v1, v2), cp.v(0, 0));
    this.world.addBody(body);
    shape = new cp.CircleShape(body, 1, cp.v(0, 0));
    shape.setCollisionType(SpriteBullet);
    shape.setSensor(true);
    this.world.addShape(shape);

    /*
     * Bullet entity
     */
    bulletView = new BulletView(this.game);
    bullet = new Entity().add(new Bullet(gun.bulletLifetime)).add(new Position(x, y, 0)).add(new Collision(0)).add(new Physics(body, Entities.BULLET, bullet)).add(new Display(bulletView));
    body.userData = {
      type: Entities.BULLET,
      entity: bullet
    };
    this.ash.addEntity(bullet);
    return bullet;
  };


  /*
   * Image
   *
   * @param x
   * @param y
   * @param path
   * @return image
   */

  Entities.prototype.createImage = function(x, y, path, alpha) {
    var image;
    if (alpha == null) {
      alpha = 1;
    }
    image = new Entity();
    image.add(new Display(new BackgroundView(this.game, path)));
    image.add(new Position(x, y));
    this.ash.addEntity(image);
    return image;
  };

  return Entities;

})();

SystemPriorities = (function() {
  function SystemPriorities() {}

  SystemPriorities.preUpdate = 1;

  SystemPriorities.update = 2;

  SystemPriorities.move = 3;

  SystemPriorities.resolveCollisions = 4;

  SystemPriorities.stateMachines = 5;

  SystemPriorities.render = 6;

  SystemPriorities.animate = 7;

  return SystemPriorities;

})();

RenderSystem = (function(_super) {
  var Tau, j, k;

  __extends(RenderSystem, _super);

  RenderSystem.prototype.stage = null;

  RenderSystem.prototype.renderer = null;

  RenderSystem.prototype.nodes = null;

  k = 0;

  j = 0;

  Tau = Math.PI * 2;

  function RenderSystem(game) {
    this.update = __bind(this.update, this);
    this.nodes = game.ash.nodes;
  }

  RenderSystem.prototype.addToEngine = function(engine) {
    var node;
    this.nodes = engine.getNodeList(this.nodes.RenderNode);
    node = this.nodes.head;
    while (node) {
      this.addToDisplay(node);
      node = node.next;
    }
  };

  RenderSystem.prototype.addToDisplay = function(node) {};

  RenderSystem.prototype.removeFromDisplay = function(node) {};

  RenderSystem.prototype.removeFromEngine = function(engine) {
    this.nodes = null;
  };

  RenderSystem.prototype.update = function(time) {
    var g, node, offsetX, offsetY, pos, size;
    size = cc.director.getWinSize();
    offsetX = ~~size.width / 2;
    offsetY = ~~size.height / 2;
    node = this.nodes.head;
    while (node) {
      if ((g = node.display.graphic.graphics) != null) {
        pos = node.position.position;
        g.setPosition(cc.p(pos.x + offsetX, pos.y + offsetY));
        g.setRotation(cc.radiansToDegrees(Tau - node.position.rotation));
      }
      node = node.next;
    }
  };

  return RenderSystem;

})(ash.core.System);

AnimationSystem = (function(_super) {
  __extends(AnimationSystem, _super);

  function AnimationSystem(parent) {
    this.updateNode = __bind(this.updateNode, this);
    AnimationSystem.__super__.constructor.call(this, parent.ash.nodes.AnimationNode, this.updateNode);
  }

  AnimationSystem.prototype.updateNode = function(node, time) {
    node.animation.animation.animate(time);
  };

  return AnimationSystem;

})(ash.tools.ListIteratingSystem);

AudioSystem = (function(_super) {
  __extends(AudioSystem, _super);

  function AudioSystem(parent) {
    this.updateNode = __bind(this.updateNode, this);
    AudioSystem.__super__.constructor.call(this, parent.ash.nodes.AudioNode, this.updateNode);
  }

  AudioSystem.prototype.updateNode = function(node, time) {
    var each, sound, type, _ref;
    _ref = node.audio.toPlay;
    for (each in _ref) {
      type = _ref[each];
      sound = new type();
      sound.play(0, 1);
    }
    node.audio.toPlay = [];
  };

  return AudioSystem;

})(ash.tools.ListIteratingSystem);

BulletAgeSystem = (function(_super) {
  __extends(BulletAgeSystem, _super);

  BulletAgeSystem.prototype.entities = null;

  function BulletAgeSystem(parent) {
    this.updateNode = __bind(this.updateNode, this);
    BulletAgeSystem.__super__.constructor.call(this, parent.ash.nodes.BulletAgeNode, this.updateNode);
    this.entities = parent.entities;
  }

  BulletAgeSystem.prototype.updateNode = function(node, time) {
    var bullet;
    bullet = node.bullet;
    bullet.lifeRemaining -= time;
    if (bullet.lifeRemaining <= 0) {
      node.display.graphic.dispose();
      this.entities.destroyEntity(node.entity);
    }
  };

  return BulletAgeSystem;

})(ash.tools.ListIteratingSystem);

CollisionSystem = (function(_super) {

  /*
   * Imports
   */
  var Asteroid, AsteroidHitShip, Audio, BulletHitAsteroid, Collision, DeathThroes, Display, Physics, Position, Spaceship;

  __extends(CollisionSystem, _super);

  Asteroid = Components.Asteroid;

  Audio = Components.Audio;

  Collision = Components.Collision;

  DeathThroes = Components.DeathThroes;

  Display = Components.Display;

  Physics = Components.Physics;

  Position = Components.Position;

  Spaceship = Components.Spaceship;

  BulletHitAsteroid = 1;

  AsteroidHitShip = 2;

  CollisionSystem.prototype.world = null;

  CollisionSystem.prototype.entities = null;

  CollisionSystem.prototype.games = null;

  CollisionSystem.prototype.rnd = null;

  CollisionSystem.prototype.collisions = null;

  function CollisionSystem(game) {
    this.update = __bind(this.update, this);
    this.collisionSeperate = __bind(this.collisionSeperate, this);
    this.collisionPostSolve = __bind(this.collisionPostSolve, this);
    this.collisionPreSolve = __bind(this.collisionPreSolve, this);
    this.collisionBegin = __bind(this.collisionBegin, this);
    this.rnd = game.rnd;
    this.world = game.world;
    this.entities = game.entities;
    this.components = game.ash.components;
    this.collisions = [];
    this.world.addCollisionHandler(SpriteAsteroid, SpriteSpaceship, this.collisionBegin, null, null, null);
    this.world.addCollisionHandler(SpriteBullet, SpriteAsteroid, this.collisionBegin, null, null, null);
  }

  CollisionSystem.prototype.addToEngine = function(engine) {
    this.games = engine.getNodeList(Nodes.GameNode);
  };

  CollisionSystem.prototype.removeFromEngine = function(engine) {
    this.games = null;
  };


  /*
   * Collision Begin
   *
   * @param arbiter
   * @param space
   * @return none
   *
   * decode A/B & que up collisions
   */

  CollisionSystem.prototype.collisionBegin = function(arbiter, space) {
    var a, b;
    a = arbiter.a.body.userData;
    b = arbiter.b.body.userData;
    switch (a.type) {
      case Entities.ASTEROID:
        switch (b.type) {
          case Entities.BULLET:
            this.collisions.push({
              type: BulletHitAsteroid,
              a: b.entity,
              b: a.entity
            });
            break;
          case Entities.SPACESHIP:
            this.collisions.push({
              type: AsteroidHitShip,
              a: a.entity,
              b: b.entity
            });
        }
        break;
      case Entities.BULLET:
        if (b.type === Entities.ASTEROID) {
          this.collisions.push({
            type: BulletHitAsteroid,
            a: a.entity,
            b: b.entity
          });
        }
        break;
      case Entities.SPACESHIP:
        if (b.type === Entities.ASTEROID) {
          this.collisions.push({
            type: AsteroidHitShip,
            a: b.entity,
            b: a.entity
          });
        }
    }
  };

  CollisionSystem.prototype.collisionPreSolve = function(arbiter, space) {};

  CollisionSystem.prototype.collisionPostSolve = function(arbiter, space) {};

  CollisionSystem.prototype.collisionSeperate = function(arbiter, space) {};

  CollisionSystem.prototype.update = function(time) {

    /*
     * Process the collision queue
     */
    var a, b, body, offsetX, offsetY, points, position, radius, size, speedFactor, type, x, y, _ref;
    while (this.collisions.length) {
      _ref = this.collisions.pop(), type = _ref.type, a = _ref.a, b = _ref.b;
      if (type === BulletHitAsteroid) {
        if ((a.get(Physics) != null)) {
          this.entities.destroyEntity(a);
          a.get(Display).graphic.dispose();
        }
        if ((b.get(Physics) != null)) {
          radius = b.get(Collision).radius;
          position = b.get(Position).position;
          points = (function() {
            switch (radius) {
              case 30:
                return 20;
              case 20:
                return 50;
              case 10:
                return 100;
              default:
                return 0;
            }
          })();
          if (radius > 10) {
            size = cc.director.getWinSize();
            offsetX = ~~size.width / 2;
            offsetY = ~~size.height / 2;
            x = position.x + offsetX;
            y = position.y + offsetY;
            speedFactor = 0.25 * this.games.head.state.level;
            this.entities.createAsteroid(radius - 10, x + this.rnd.nextDouble() * 10 - 5, y + this.rnd.nextDouble() * 10 - 5, speedFactor);
            this.entities.createAsteroid(radius - 10, x + this.rnd.nextDouble() * 10 - 5, y + this.rnd.nextDouble() * 10 - 5, speedFactor);
          }
          body = b.get(Physics).body;
          b.get(Display).graphic.dispose();
          b.get(Asteroid).fsm.changeState('destroyed');
          b.get(DeathThroes).body = body;
          if (this.games.head) {
            this.games.head.state.hits += points;
            this.games.head.state.bonus += points;
            while (this.games.head.state.bonus > 5000) {
              this.games.head.state.lives++;
              this.games.head.state.bonus -= 5000;
            }
          }
        }
      } else if (type === AsteroidHitShip) {
        if ((b.get(Physics) != null)) {
          body = b.get(Physics).body;
          b.get(Display).graphic.dispose();
          b.get(Spaceship).fsm.changeState('destroyed');
          b.get(DeathThroes).body = body;
          if (this.games.head) {
            this.games.head.state.lives--;
          }
        }
      }
    }
  };

  return CollisionSystem;

})(ash.core.System);

DeathThroesSystem = (function(_super) {
  __extends(DeathThroesSystem, _super);

  DeathThroesSystem.prototype.entities = null;

  function DeathThroesSystem(game) {
    this.updateNode = __bind(this.updateNode, this);
    DeathThroesSystem.__super__.constructor.call(this, game.ash.nodes.DeathThroesNode, this.updateNode);
    this.entities = game.entities;
  }

  DeathThroesSystem.prototype.updateNode = function(node, time) {
    var dead;
    dead = node.dead;
    dead.countdown -= time;
    if (dead.countdown <= 0) {
      this.entities.destroyEntity(node.entity);
      node.display.graphic.dispose();
    }
  };

  return DeathThroesSystem;

})(ash.tools.ListIteratingSystem);


/*
 * Fixed Step Physics System
 *
 * Run the physics step every 1/60 second.
 *
 */

FixedPhysicsSystem = (function(_super) {
  var TIME_STEP, k;

  __extends(FixedPhysicsSystem, _super);

  TIME_STEP = 1 / 60;

  FixedPhysicsSystem.prototype.handle = 0;

  FixedPhysicsSystem.prototype.config = null;

  FixedPhysicsSystem.prototype.world = null;

  FixedPhysicsSystem.prototype.entities = null;

  FixedPhysicsSystem.prototype.nodes = null;

  FixedPhysicsSystem.prototype.enabled = true;

  FixedPhysicsSystem.prototype.game = null;

  FixedPhysicsSystem.prototype.width = 0;

  FixedPhysicsSystem.prototype.height = 0;

  FixedPhysicsSystem.prototype.offsetX = 0;

  FixedPhysicsSystem.prototype.offsetY = 0;

  k = 0;

  function FixedPhysicsSystem(game) {
    this.updateNode = __bind(this.updateNode, this);
    this.update = __bind(this.update, this);
    var size;
    this.world = game.world;
    this.nodes = game.ash.nodes;
    size = cc.director.getWinSize();
    this.width = size.width;
    this.height = size.height;
    this.offsetX = ~~this.width / 2;
    this.offsetY = ~~this.height / 2;
  }

  FixedPhysicsSystem.prototype.addToEngine = function(engine) {
    this.nodes = engine.getNodeList(this.nodes.PhysicsNode);
  };

  FixedPhysicsSystem.prototype.removeFromEngine = function(engine) {
    if (this.handle !== 0) {
      clearInterval(this.handle);
    }
    this.nodes = null;
  };

  FixedPhysicsSystem.prototype.update = function(time) {
    var node;
    if (!this.enabled) {
      return;
    }
    this.world.step(time);
    node = this.nodes.head;
    while (node) {
      this.updateNode(node, time);
      node = node.next;
    }
  };


  /*
   * Process the physics for this node
   */

  FixedPhysicsSystem.prototype.updateNode = function(node, time) {
    var body, physics, position, x, x1, y, y1, _ref;
    position = node.position;
    physics = node.physics;
    body = physics.body;

    /*
     * Update the position component from Box2D model
     * Asteroids uses wraparound space coordinates
     */
    _ref = body.p, x = _ref.x, y = _ref.y;
    x1 = x > this.width ? 0 : x < 0 ? this.width : x;
    y1 = y > this.height ? 0 : y < 0 ? this.height : y;
    if (x1 !== x || y1 !== y) {
      body.p = cc.p(x1, y1);
    }
    position.position.x = x1 - this.offsetX;
    position.position.y = y1 - this.offsetY;
    position.rotation = body.getAngVel();
  };

  return FixedPhysicsSystem;

})(ash.core.System);

GameManager = (function(_super) {
  __extends(GameManager, _super);

  GameManager.prototype.parent = null;

  GameManager.prototype.config = null;

  GameManager.prototype.entities = null;

  GameManager.prototype.rnd = null;

  GameManager.prototype.gameNodes = null;

  GameManager.prototype.spaceships = null;

  GameManager.prototype.asteroids = null;

  GameManager.prototype.bullets = null;

  GameManager.prototype.width = 0;

  GameManager.prototype.height = 0;

  function GameManager(game) {
    var size;
    this.game = game;
    this.update = __bind(this.update, this);
    this.entities = this.game.entities;
    this.rnd = this.game.rnd;
    this.nodes = this.game.ash.nodes;
    size = cc.director.getWinSize();
    this.width = size.width;
    this.height = size.height;
  }

  GameManager.prototype.addToEngine = function(engine) {
    this.gameNodes = engine.getNodeList(this.nodes.GameNode);
    this.spaceships = engine.getNodeList(this.nodes.SpaceshipNode);
    this.asteroids = engine.getNodeList(this.nodes.AsteroidCollisionNode);
    this.bullets = engine.getNodeList(this.nodes.BulletCollisionNode);
  };

  GameManager.prototype.update = function(time) {
    var asteroid, asteroidCount, clearToAddSpaceship, i, newSpaceshipPosition, node, position, spaceship, speedFactor;
    node = this.gameNodes.head;
    if (node && node.state.playing) {
      if (this.spaceships.empty) {
        if (node.state.lives > 0) {
          newSpaceshipPosition = new Point(this.width * 0.5, this.height * 0.5);
          clearToAddSpaceship = true;
          asteroid = this.asteroids.head;
          while (asteroid) {
            if (Point.distance(asteroid.position.position, newSpaceshipPosition) <= asteroid.collision.radius + 50) {
              clearToAddSpaceship = false;
              break;
            }
            asteroid = asteroid.next;
          }
          if (clearToAddSpaceship) {
            this.entities.createSpaceship();
          }
        } else {
          node.state.playing = false;

          /*
           * Start a new game?
           */
          this.entities.createWaitForClick();
        }
      }
      if (this.asteroids.empty && this.bullets.empty && !this.spaceships.empty) {
        spaceship = this.spaceships.head;
        node.state.level++;
        asteroidCount = 2 + node.state.level;
        speedFactor = 0.25 * node.state.level;
        i = 0;
        while (i < asteroidCount) {
          while (true) {
            position = new Point(this.rnd.nextDouble() * this.width, this.rnd.nextDouble() * this.height);
            if (!(Point.distance(position, spaceship.position.position) <= 80)) {
              break;
            }
          }
          this.entities.createAsteroid(30, position.x, position.y, speedFactor);
          ++i;
        }
      }
    }
  };

  GameManager.prototype.removeFromEngine = function(engine) {
    this.gameNodes = null;
    this.spaceships = null;
    this.asteroids = null;
    this.bullets = null;
  };

  return GameManager;

})(ash.core.System);

GunControlSystem = (function(_super) {
  __extends(GunControlSystem, _super);

  GunControlSystem.prototype.shooting = false;

  GunControlSystem.prototype.keyPoll = null;

  GunControlSystem.prototype.entities = null;

  function GunControlSystem(game) {
    this.updateNode = __bind(this.updateNode, this);
    GunControlSystem.__super__.constructor.call(this, game.ash.nodes.GunControlNode, this.updateNode);
    this.keyPoll = game.keyPoll;
    this.entities = game.entities;
    game.controller.addButton({
      text: 'FiRE',
      size: 30,
      radius: 37,
      color: cc.color(0xe8, 0xe1, 0x0e, 0x1f),
      position: cc.p(game.width - 50, 50),
      onStart: (function(_this) {
        return function(touch, point) {
          return _this.shooting = true;
        };
      })(this),
      onEnd: (function(_this) {
        return function(touch, point) {
          return _this.shooting = false;
        };
      })(this)
    });
  }


  /*
   * updateNode
   *
   * @param node
   * @param time
   * @return none
   */

  GunControlSystem.prototype.updateNode = function(node, time) {
    var control, gun, position;
    control = node.control;
    position = node.position;
    gun = node.gun;
    gun.shooting = this.shooting || this.keyPoll.isDown(control.trigger);
    gun.timeSinceLastShot += time;
    if (gun.shooting && gun.timeSinceLastShot >= gun.minimumShotInterval) {
      this.entities.createUserBullet(gun, position);
      gun.timeSinceLastShot = 0;
    }
  };

  return GunControlSystem;

})(ash.tools.ListIteratingSystem);

HudSystem = (function(_super) {
  __extends(HudSystem, _super);

  function HudSystem(parent) {
    this.updateNode = __bind(this.updateNode, this);
    HudSystem.__super__.constructor.call(this, parent.ash.nodes.HudNode, this.updateNode);
  }

  HudSystem.prototype.updateNode = function(node, time) {
    node.hud.view.setLives(node.state.lives);
    node.hud.view.setScore(node.state.hits);
  };

  return HudSystem;

})(ash.tools.ListIteratingSystem);

ShipControlSystem = (function(_super) {
  var k;

  __extends(ShipControlSystem, _super);

  ShipControlSystem.prototype.warping = 0;

  ShipControlSystem.prototype.decelerate = false;

  ShipControlSystem.prototype.accelerate = false;

  ShipControlSystem.prototype.rotateLeft = false;

  ShipControlSystem.prototype.rotateRight = false;

  ShipControlSystem.prototype.game = null;

  ShipControlSystem.prototype.keyPoll = null;

  ShipControlSystem.prototype.rnd = null;

  ShipControlSystem.prototype.width = 0;

  ShipControlSystem.prototype.height = 0;

  ShipControlSystem.prototype.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff, 0xffff00];

  k = 0;

  function ShipControlSystem(game) {
    this.game = game;
    this.updateNode = __bind(this.updateNode, this);
    ShipControlSystem.__super__.constructor.call(this, this.game.ash.nodes.PhysicsControlNode, this.updateNode);
    this.rnd = this.game.rnd;
    this.width = this.game.width;
    this.height = this.game.height;
    this.keyPoll = this.game.keyPoll;
    this.controller = this.game.controller;
    this.game.controller.addButton({
      text: 'wArp',
      size: 26,
      radius: 37,
      color: cc.color(0x10, 0x78, 0x14, 0x2f),
      position: cc.p(this.game.width - 200, 50),
      onStart: (function(_this) {
        return function(touch, point) {
          _this.warping = _this.rnd.nextInt(30) + 30;
          return true;
        };
      })(this)
    });
    this.game.controller.addDPad({
      radius: 45,
      color: cc.color(0xcc, 0xcc, 0xcc, 0x2f),
      position: cc.p(100, 50),
      up: {
        onStart: (function(_this) {
          return function(touch, point) {
            return _this.decelerate = true;
          };
        })(this),
        onEnd: (function(_this) {
          return function(touch, point) {
            return _this.decelerate = false;
          };
        })(this)
      },
      down: {
        onStart: (function(_this) {
          return function(touch, point) {
            return _this.accelerate = true;
          };
        })(this),
        onEnd: (function(_this) {
          return function(touch, point) {
            return _this.accelerate = false;
          };
        })(this)
      },
      left: {
        onStart: (function(_this) {
          return function(touch, point) {
            return _this.rotateLeft = true;
          };
        })(this),
        onEnd: (function(_this) {
          return function(touch, point) {
            return _this.rotateLeft = false;
          };
        })(this)
      },
      right: {
        onStart: (function(_this) {
          return function(touch, point) {
            return _this.rotateRight = true;
          };
        })(this),
        onEnd: (function(_this) {
          return function(touch, point) {
            return _this.rotateRight = false;
          };
        })(this)
      }
    });
  }


  /*
   * updateNode
   *
   * @param node
   * @param time
   * @return none
   */

  ShipControlSystem.prototype.updateNode = function(node, time) {
    var body, control, rotation, v, x, y;
    control = node.control;
    body = node.physics.body;
    if (this.warping !== 0) {
      this.warping--;
      x = this.rnd.nextInt(this.width);
      y = this.rnd.nextInt(this.height);
      body.p = cc.p(x, y);
      if (this.warping === 0) {
        node.display.graphic.draw(cc.color(255, 255, 255, 255));
      } else {
        node.display.graphic.draw(this.colors[this.rnd.nextInt(6)]);
      }
      return;
    }
    if (this.keyPoll.isDown(control.warp)) {
      this.warping = this.rnd.nextInt(30) + 30;
      return;
      rotation = rotation || body.getAngVel();
      v = body.getVel();
      v.x -= Math.cos(rotation) * control.accelerationRate * time;
      v.y -= Math.sin(rotation) * control.accelerationRate * time;
      if (v.x < 0) {
        v.x = 0;
      }
      if (v.y < 0) {
        v.y = 0;
      }
      body.setVel(v);
    }
    if (this.keyPoll.isDown(control.accelerate) || this.accelerate) {
      rotation = rotation || body.getAngVel();
      v = body.getVel();
      v.x += Math.cos(rotation) * control.accelerationRate * time;
      v.y += Math.sin(rotation) * control.accelerationRate * time;
      body.setVel(v);
    }
    if (this.keyPoll.isDown(control.left) || this.rotateLeft) {
      rotation = rotation || body.getAngVel();
      body.setAngVel(rotation - control.rotationRate * time);
    }
    if (this.keyPoll.isDown(control.right) || this.rotateRight) {
      rotation = rotation || body.getAngVel();
      body.setAngVel(rotation + control.rotationRate * time);
    }
  };

  return ShipControlSystem;

})(ash.tools.ListIteratingSystem);

WaitForStartSystem = (function(_super) {
  __extends(WaitForStartSystem, _super);

  WaitForStartSystem.prototype.engine = null;

  WaitForStartSystem.prototype.entities = null;

  WaitForStartSystem.prototype.gameNodes = null;

  WaitForStartSystem.prototype.waitNodes = null;

  WaitForStartSystem.prototype.asteroids = null;

  function WaitForStartSystem(game) {
    this.update = __bind(this.update, this);
    this.entities = game.entities;
  }

  WaitForStartSystem.prototype.addToEngine = function(engine) {
    this.ash = engine;
    this.waitNodes = engine.getNodeList(Nodes.WaitForStartNode);
    this.gameNodes = engine.getNodeList(Nodes.GameNode);
    this.asteroids = engine.getNodeList(Nodes.AsteroidCollisionNode);
  };

  WaitForStartSystem.prototype.removeFromEngine = function(engine) {
    this.waitNodes = null;
    this.gameNodes = null;
    this.asteroids = null;
  };

  WaitForStartSystem.prototype.update = function(time) {
    var asteroid, game, graphic, node;
    node = this.waitNodes.head;
    game = this.gameNodes.head;
    if (node && node.wait.startGame && game) {
      asteroid = this.asteroids.head;
      while (asteroid) {

        /*
         * Clean up asteroids left from prior game
         */
        graphic = asteroid.entity.get(Components.Display).graphic;
        this.entities.destroyEntity(asteroid.entity);
        graphic.dispose();
        asteroid = asteroid.next;
      }
      game.state.setForStart();
      node.wait.startGame = false;
      this.ash.removeEntity(node.entity);
    }
  };

  return WaitForStartSystem;

})(ash.core.System);

Game = cc.Layer.extend({
  ash: null,
  rnd: null,
  reg: null,
  entities: null,
  world: null,
  player: null,
  hud: null,
  keyPoll: null,
  controller: null,
  name: 'asteroids',
  properties: {
    profiler: 'on',
    leaderboard: 'off',
    player: '',
    userId: '',
    background: 'blue',
    playMusic: '50',
    playSfx: '50',
    asteroidDensity: '1.0',
    asteroidFriction: '1.0',
    asteroidRestitution: '0.2',
    asteroidDamping: '0.0',
    asteroidLinearVelocity: '4.0',
    asteroidAngularVelocity: '2.0',
    spaceshipDensity: '1.0',
    spaceshipFriction: '1.0',
    spaceshipRestitution: '0.2',
    spaceshipDamping: '0.75',
    bulletDensity: '1.0',
    bulletFriction: '0.0',
    bulletRestitution: '0.0',
    bulletDamping: '0.0',
    bulletLinearVelocity: '150'
  },
  ctor: function() {
    var n, p, _ref;
    this._super();
    Properties.init(this.name, this.properties);
    this.rnd = new ZRandom();
    this.ash = new ash.core.Engine();
    this.controller = new GameController(this, {
      fontName: 'opendyslexic'
    });
    _ref = new ash.ext.Helper(Components, Nodes);
    for (n in _ref) {
      p = _ref[n];
      this.ash[n] = p;
    }
    this.keyPoll = new KeyPoll(this);
    this.world = new cp.Space();
    this.world.gravity = cp.v(0, 0);
    this.entities = new Entities(this);
    this.entities.createImage(0, 0, res.background);
    this.ash.addSystem(new FixedPhysicsSystem(this), SystemPriorities.move);
    this.ash.addSystem(new BulletAgeSystem(this), SystemPriorities.update);
    this.ash.addSystem(new DeathThroesSystem(this), SystemPriorities.update);
    this.ash.addSystem(new CollisionSystem(this), SystemPriorities.resolveCollisions);
    this.ash.addSystem(new AnimationSystem(this), SystemPriorities.animate);
    this.ash.addSystem(new HudSystem(this), SystemPriorities.animate);
    this.ash.addSystem(new RenderSystem(this), SystemPriorities.render);
    this.ash.addSystem(new AudioSystem(this), SystemPriorities.render);
    this.ash.addSystem(new WaitForStartSystem(this), SystemPriorities.preUpdate);
    this.ash.addSystem(new GameManager(this), SystemPriorities.preUpdate);
    this.ash.addSystem(new ShipControlSystem(this), SystemPriorities.update);
    this.ash.addSystem(new GunControlSystem(this), SystemPriorities.update);
    this.entities.createWaitForClick();
    this.entities.createGame();
    this.update = this.ash.update;
    this.scheduleUpdate();
  }
});

Game.scene = function() {
  var scene;
  scene = new cc.Scene();
  scene.addChild(new Game());
  return scene;
};

//# sourceMappingURL=asteroids.js.map
