#+--------------------------------------------------------------------+
#| entity_creator.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of asteroids.coffee
#|
#| asteroids.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# Entities
#
class Entities

  ###
   * Imports
  ###
  Animation           = Components.Animation
  Asteroid            = Components.Asteroid
  Audio               = Components.Audio
  Bullet              = Components.Bullet
  Collision           = Components.Collision
  DeathThroes         = Components.DeathThroes
  Display             = Components.Display
  GameState           = Components.GameState
  Gun                 = Components.Gun
  GunControls         = Components.GunControls
  Hud                 = Components.Hud
  MotionControls      = Components.MotionControls
  Physics             = Components.Physics
  Position            = Components.Position
  Spaceship           = Components.Spaceship
  WaitForStart        = Components.WaitForStart
  Entity              = ash.core.Entity
  EntityStateMachine  = ash.fsm.EntityStateMachine

  @ASTEROID           : 1
  @SPACESHIP          : 2
  @BULLET             : 3

  LEFT                : KeyPoll.KEY_LEFT
  RIGHT               : KeyPoll.KEY_RIGHT
  THRUST              : KeyPoll.KEY_UP
  FIRE                : KeyPoll.KEY_Z
  WARP                : KeyPoll.KEY_SPACE


  get = (prop) -> parseFloat(Properties.get(prop))
     

  game            : null  # Phaser.io
  ash             : null  # Ash Engine
  world           : null  # Box2D World
  waitEntity      : null
  rnd             : null
  bulletId        : 0
  asteroidId      : 0
  spaceshipId     : 0

  constructor: (@game) ->
    @ash = @game.ash
    @rnd = @game.rnd
    @world = @game.world

  destroyEntity: (entity) ->
    @ash.removeEntity entity
    return

  ###
   * Game State
  ###
  createGame: () ->
    hud = new HudView(@game)
    gameEntity = new Entity('game')
    .add(new GameState())
    .add(new Hud(hud))
    @ash.addEntity gameEntity
    return gameEntity

  ###
   * Start...
  ###
  createWaitForClick: () ->
    waitView = new WaitForStartView(@game)
    @waitEntity = new Entity('wait')
    .add(new WaitForStart(waitView))

    @waitEntity.get(WaitForStart).startGame = false
    @ash.addEntity(@waitEntity)
    return @waitEntity


  ###
   * Create an Asteroid with FSM Animation
  ###
  createAsteroid: (radius, x, y, speedFactor=1) ->

    ###
     * Asteroid simulation - chipmunk
    ###
    body = new cp.Body(1, cp.momentForCircle(1, 0, radius, cp.v(0, 0)))
    body.p = cc.p(x, y)
    v1 = (@rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius)
    v2 = (@rnd.nextDouble() - 0.5) * get('asteroidLinearVelocity') * (50 - radius)
    v1 = v1 * speedFactor
    v2 = v2 * speedFactor
#    v1 = 0
#    v2 = 0
    body.applyImpulse(cp.v(v1, v2), cp.v(0, 0))
    @world.addBody(body)
    shape = new cp.CircleShape(body, radius, cp.v(0, 0))
    shape.setCollisionType(SpriteAsteroid)
    shape.setSensor(true)
    @world.addShape(shape)
    ###
     * Asteroid entity
    ###
    asteroid = new Entity()

    fsm = new EntityStateMachine(asteroid)

    liveView = new AsteroidView(@game, radius)
    fsm.createState('alive')
    .add(Physics).withInstance(new Physics(body, Entities.ASTEROID, asteroid))
    .add(Collision).withInstance(new Collision(radius))
    .add(Display).withInstance(new Display(liveView))

    deathView = new AsteroidDeathView(@game, radius)
    fsm.createState('destroyed')
    .add(DeathThroes).withInstance(new DeathThroes(3))
    .add(Display).withInstance(new Display(deathView))
    .add(Animation).withInstance(new Animation(deathView))

    asteroid
    .add(new Asteroid(fsm))
    .add(new Position(x, y, 0))
    .add(new Audio())

    fsm.changeState('alive')
    body.userData =
      type: Entities.ASTEROID
      entity: asteroid
    @ash.addEntity asteroid
    return asteroid

  ###
   * Create Player Spaceship with FSM Animation
  ###
  createSpaceship: =>

    size = cc.director.getWinSize()

    x = @rnd.nextInt(size.width)
    y = @rnd.nextInt(size.height)
    # Simplify shape to triangle
    verts = [
      10.0, 0.0
      -7.0, -7.0
      -7.0, 7.0
    ]
    ###
     * Spaceship simulation
    ###
    body = new cp.Body(1, cp.momentForPoly(1, verts, cp.v(0, 0)))
    body.p = cc.p(x, y)
    body.applyImpulse(cp.v(0, 0), cp.v(0, 0))
    @world.addBody(body)
    shape = new cp.PolyShape(body, verts, cp.v(0, 0))
    shape.setCollisionType(SpriteSpaceship)
    shape.setSensor(true)
    @world.addShape(shape)
    ###
     * Spaceship entity
    ###
    spaceship = new Entity()

    fsm = new EntityStateMachine(spaceship)

    liveView = new SpaceshipView(@game)

    fsm.createState('playing')
    .add(Physics).withInstance(new Physics(body, Entities.SPACESHIP, spaceship))
    .add(MotionControls).withInstance(new MotionControls(@LEFT, @RIGHT, @THRUST, @WARP, 100, 3))
    .add(Gun).withInstance(new Gun(8, 0, 0.3, 2 ))
    .add(GunControls).withInstance(new GunControls(@FIRE))
    .add(Collision).withInstance(new Collision(9))
    .add(Display).withInstance(new Display(liveView))

    deathView = new SpaceshipDeathView(@game)
    fsm.createState('destroyed')
    .add(DeathThroes).withInstance(new DeathThroes(5))
    .add(Display).withInstance(new Display(deathView))
    .add(Animation).withInstance(new Animation(deathView))

    spaceship
    .add(new Spaceship(fsm))
    .add(new Position(x, y, 0))
    .add(new Audio())

    fsm.changeState('playing')
    body.userData =
      type: Entities.SPACESHIP
      entity: spaceship
    @ash.addEntity spaceship

    return spaceship


  ###
   * Create a Bullet
  ###
  createUserBullet: (gun, parentPosition) =>

    cos = Math.cos(parentPosition.rotation)
    sin = Math.sin(parentPosition.rotation)

    x = cos * gun.offsetFromParent.x - sin * gun.offsetFromParent.y + parentPosition.position.x
    y = sin * gun.offsetFromParent.x + cos * gun.offsetFromParent.y + parentPosition.position.y

    size = cc.director.getWinSize()
    x += size.width/2
    y += size.height/2

    ###
     * Bullet simulation
    ###
    body = new cp.Body(1, cp.momentForCircle(1, 0, 1, cp.v(0, 0)))
    body.p = cc.p(x, y)
    v1 = cos * get('bulletLinearVelocity')
    v2 = sin * get('bulletLinearVelocity')
    body.applyImpulse(cp.v(v1, v2), cp.v(0, 0))
    @world.addBody(body)
    shape = new cp.CircleShape(body, 1, cp.v(0, 0))
    shape.setCollisionType(SpriteBullet)
    shape.setSensor(true)
    @world.addShape(shape)
    ###
     * Bullet entity
    ###
    bulletView = new BulletView(@game)
    bullet = new Entity()
    .add(new Bullet(gun.bulletLifetime))
    .add(new Position(x, y, 0))
    .add(new Collision(0))
    .add(new Physics(body, Entities.BULLET, bullet))
    .add(new Display(bulletView))

    body.userData =
      type: Entities.BULLET
      entity: bullet

    @ash.addEntity(bullet)

    return bullet


  ###
   * Image
   *
   * @param x
   * @param y
   * @param path
   * @return image
  ###
  createImage: (x, y, path, alpha=1) ->

    image = new Entity()
    image.add(new Display(new BackgroundView(@game, path)))
    image.add(new Position(x, y))
    @ash.addEntity(image)
    return image



#  createDpad: (x, y) ->
#    dpad = new Entity()
#    dpad.add(new Display(new DpadController(@game)))
#    dpad.add(new Position(x, y))
#    @ash.addEntity(dpad)
#    return dpad
#
#  createWarp: (x, y) ->
#    warp = new Entity()
#    warp.add(new Display(new FireButton(@game)))
#    warp.add(new Position(x, y))
#    @ash.addEntity(warp)
#    return warp
#
#  createFire: (x, y) ->
#    fire = new Entity()
#    fire.add(new Display(new FireButton(@game)))
#    fire.add(new Position(x, y))
#    @ash.addEntity(fire)
#    return fire
#
