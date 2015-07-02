###
 * Fixed Step Physics System
 *
 * Run the physics step every 1/60 second.
 *
###
class FixedPhysicsSystem extends ash.core.System

  TIME_STEP = 1/60

  handle      : 0     # handle for setInterval
  config      : null  # GameConfig
  world       : null  # Box2D World
  entities    : null  # EntityCreator
  nodes       : null  # PhysicsNode
  enabled     : true
  game        : null
  width       : 0
  height      : 0
  offsetX     : 0
  offsetY     : 0
#  @deadPool   : []    # dead bodies waiting to recycle

  k = 0

  constructor: (game) ->
    @world = game.world
    @nodes = game.ash.nodes
    size = cc.director.getWinSize()
    @width = size.width
    @height = size.height
    @offsetX = ~~@width/2
    @offsetY = ~~@height/2

  addToEngine: (engine) ->
    @nodes = engine.getNodeList(@nodes.PhysicsNode)
    return # Void

  removeFromEngine: (engine) ->
    clearInterval(@handle) unless @handle is 0
    @nodes = null
    return # Void

  update: (time) =>
#    return if @game.paused
    return unless @enabled
    @world.step(time)

    node = @nodes.head
    while node
      @updateNode node, time
      node = node.next

    return # Void

  ###
   * Process the physics for this node
  ###
  updateNode: (node, time) =>

    position = node.position
    physics = node.physics
    body = physics.body

    ###
     * Update the position component from Box2D model
     * Asteroids uses wraparound space coordinates
    ###
    {x, y} = body.p

    x1 = if x > @width then 0 else if x < 0 then @width else x
    y1 = if y > @height then 0 else if y < 0 then @height else y
    body.p = cc.p(x1, y1) if x1 isnt x or y1 isnt y
    position.position.x = x1-@offsetX
    position.position.y = y1-@offsetY
    position.rotation = body.getAngVel()
    return # Void

