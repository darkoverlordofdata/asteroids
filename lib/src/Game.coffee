# virtual pad variables

Game = cc.Layer.extend


  ash             : null
  rnd             : null
  reg             : null
  entities        : null
  world           : null
  player          : null
  hud             : null
  keyPoll         : null
  controller      : null
  name            : 'asteroids'
  properties:
    profiler                : 'on'    # display the profiler
    leaderboard             : 'off'   # use server leaderboard
    player                  : ''      # player screen name
    userId                  : ''      # unique user id
    background              : 'blue'  # blue | stars
    playMusic               : '50'    # music volume
    playSfx                 : '50'    # soundfx volume
    asteroidDensity         : '1.0'   # asteroid mass
    asteroidFriction        : '1.0'   # asteroid friction
    asteroidRestitution     : '0.2'   # asteroid bounce
    asteroidDamping         : '0.0'   # asteroid entropy
    asteroidLinearVelocity  : '4.0'   # asteroid speed
    asteroidAngularVelocity : '2.0'   # asteroid rotation
    spaceshipDensity        : '1.0'   # spaceship mass
    spaceshipFriction       : '1.0'   # spaceship friction
    spaceshipRestitution    : '0.2'   # spaceship bounce
    spaceshipDamping        : '0.75'  # spaceship enrtopy
    bulletDensity           : '1.0'   # bullet mass
    bulletFriction          : '0.0'   # bullet friction
    bulletRestitution       : '0.0'   # bullet bounce
    bulletDamping           : '0.0'   # bullet entropy
    bulletLinearVelocity    : '150'   # bullet  speed


  ctor: ->
    @_super()
    Properties.init(@name, @properties)
    #@rnd = new MersenneTwister()
    @rnd = new ZRandom()
    @ash = new ash.core.Engine()
    @controller = new GameController(this, fontName: 'opendyslexic')
    for n, p of new ash.ext.Helper(Components, Nodes)
      @ash[n] = p

    @keyPoll = new KeyPoll(this)

    @world = new cp.Space()
    @world.gravity = cp.v(0, 0)

    @entities = new Entities(this)
    @entities.createImage(0, 0, res.background)

    @ash.addSystem(new FixedPhysicsSystem(this), SystemPriorities.move)
    @ash.addSystem(new BulletAgeSystem(this), SystemPriorities.update)
    @ash.addSystem(new DeathThroesSystem(this), SystemPriorities.update)
    @ash.addSystem(new CollisionSystem(this), SystemPriorities.resolveCollisions)

    @ash.addSystem(new AnimationSystem(this), SystemPriorities.animate)
    @ash.addSystem(new HudSystem(this), SystemPriorities.animate)
    @ash.addSystem(new RenderSystem(this), SystemPriorities.render)
    @ash.addSystem(new AudioSystem(this), SystemPriorities.render)

    @ash.addSystem(new WaitForStartSystem(this), SystemPriorities.preUpdate)
    @ash.addSystem(new GameManager(this), SystemPriorities.preUpdate)
    @ash.addSystem(new ShipControlSystem(this), SystemPriorities.update)
    @ash.addSystem(new GunControlSystem(this), SystemPriorities.update)

    @entities.createWaitForClick()
    @entities.createGame()

    @update = @ash.update
    @scheduleUpdate()
    return


Game.scene = ->
  scene = new cc.Scene()
  scene.addChild(new Game())
  return scene


