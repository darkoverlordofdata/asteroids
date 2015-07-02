class CollisionSystem extends ash.core.System

  ###
   * Imports
  ###
  Asteroid            = Components.Asteroid
  Audio               = Components.Audio
  Collision           = Components.Collision
  DeathThroes         = Components.DeathThroes
  Display             = Components.Display
  Physics             = Components.Physics
  Position            = Components.Position
  Spaceship           = Components.Spaceship

  BulletHitAsteroid   = 1
  AsteroidHitShip     = 2


  world               : null #  Physics World
  entities            : null #  Entities
  games               : null #  NodeList
  rnd                 : null
  collisions          : null #  collision que

  constructor: (game) ->
    @rnd = game.rnd
    @world = game.world
    @entities = game.entities
    @components = game.ash.components
    @collisions = []
    @world.addCollisionHandler(SpriteAsteroid, SpriteSpaceship, @collisionBegin, null, null, null)
    @world.addCollisionHandler(SpriteBullet, SpriteAsteroid, @collisionBegin, null, null, null)

  addToEngine: (engine) ->
    @games = engine.getNodeList(Nodes.GameNode)
    return # Void

  removeFromEngine: (engine) ->
    @games = null
    return # Void
  ###
   * Collision Begin
   *
   * @param arbiter
   * @param space
   * @return none
   *
   * decode A/B & que up collisions
  ###
  collisionBegin: (arbiter, space) =>

    a = arbiter.a.body.userData
    b = arbiter.b.body.userData

    switch (a.type)
      when Entities.ASTEROID
        switch(b.type)
          when Entities.BULLET
            @collisions.push(type: BulletHitAsteroid, a: b.entity, b: a.entity)
          when Entities.SPACESHIP
            @collisions.push(type: AsteroidHitShip, a: a.entity, b: b.entity)
      when Entities.BULLET
        if (b.type is Entities.ASTEROID)
          @collisions.push(type: BulletHitAsteroid, a: a.entity, b: b.entity)

      when Entities.SPACESHIP
        if (b.type is Entities.ASTEROID)
          @collisions.push(type: AsteroidHitShip, a: b.entity, b: a.entity)
    return

  collisionPreSolve: (arbiter, space) =>
  collisionPostSolve: (arbiter, space) =>
  collisionSeperate: (arbiter, space) =>

  update:(time) =>

    ###
     * Process the collision queue
    ###
    while @collisions.length
      {type, a, b} = @collisions.pop()

      if (type is BulletHitAsteroid)

        if (a.get(Physics)?) # already been killed?
          @entities.destroyEntity a
          a.get(Display).graphic.dispose()

        if (b.get(Physics)?) # already been killed?
          radius = b.get(Collision).radius
          position = b.get(Position).position
          points = switch radius
            when 30 then 20   # large
            when 20 then 50   # medium
            when 10 then 100  # small
            else 0

          if (radius > 10)
            size = cc.director.getWinSize()
            offsetX = ~~size.width/2
            offsetY = ~~size.height/2
            x = position.x + offsetX
            y = position.y + offsetY
            speedFactor = 0.25 * @games.head.state.level

            @entities.createAsteroid(radius - 10, x + @rnd.nextDouble() * 10 - 5, y + @rnd.nextDouble() * 10 - 5, speedFactor)
            @entities.createAsteroid(radius - 10, x + @rnd.nextDouble() * 10 - 5, y + @rnd.nextDouble() * 10 - 5, speedFactor)
          body = b.get(Physics).body
          b.get(Display).graphic.dispose()
          b.get(Asteroid).fsm.changeState('destroyed')
          b.get(DeathThroes).body = body
#          b.get(Audio).play(ExplodeAsteroid)
          if (@games.head)
            @games.head.state.hits += points
            @games.head.state.bonus += points
            while (@games.head.state.bonus > 5000)
              @games.head.state.lives++
              @games.head.state.bonus -= 5000


      else if (type is AsteroidHitShip)

        if (b.get(Physics)?) # already been killed?
          body = b.get(Physics).body
          b.get(Display).graphic.dispose()
          b.get(Spaceship).fsm.changeState('destroyed')
          b.get(DeathThroes).body = body
          # todo: ExplodeShip
#          b.get(Audio).play(ExplodeShip)
          if (@games.head)
            @games.head.state.lives--

    return



