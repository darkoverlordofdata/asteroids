class ShipControlSystem extends ash.tools.ListIteratingSystem

  warping     : 0
  decelerate  : false
  accelerate  : false
  rotateLeft  : false
  rotateRight : false
  game        : null
  keyPoll     : null
  rnd         : null
  width       : 0
  height      : 0
  colors      : [
    0xff0000
    0x00ff00
    0x0000ff
    0xff00ff
    0x00ffff
    0xffff00
  ]
  k = 0


  constructor: (@game) ->
    super(@game.ash.nodes.PhysicsControlNode, @updateNode)
    @rnd = @game.rnd
    @width = @game.width
    @height = @game.height
    @keyPoll = @game.keyPoll
    @controller = @game.controller

    @game.controller.addButton
      text      : 'wArp'
      size      : 26
      radius    : 37
      color     : cc.color(0x10, 0x78, 0x14, 0x2f)
      position  : cc.p(@game.width-200, 50)
      onStart   : (touch, point) =>
        @warping = @rnd.nextInt(30)+30
        return true

    @game.controller.addDPad
      radius    : 45
      color     : cc.color(0xcc, 0xcc, 0xcc, 0x2f)
      position  : cc.p(100, 50)
      up:
        onStart : (touch, point) => @decelerate = true
        onEnd   : (touch, point) => @decelerate = false
      down:
        onStart : (touch, point) => @accelerate = true
        onEnd   : (touch, point) => @accelerate = false
      left:
        onStart : (touch, point) => @rotateLeft = true
        onEnd   : (touch, point) => @rotateLeft = false
      right:
        onStart : (touch, point) => @rotateRight = true
        onEnd   : (touch, point) => @rotateRight = false


  ###
   * updateNode
   *
   * @param node
   * @param time
   * @return none
  ###
  updateNode: (node, time) =>

    control = node.control
    body = node.physics.body

    if @warping isnt 0
      @warping--
      x = @rnd.nextInt(@width)
      y = @rnd.nextInt(@height)
      body.p = cc.p(x, y)
      if @warping is 0
        node.display.graphic.draw(cc.color(255, 255, 255, 255))
      else
        node.display.graphic.draw(@colors[@rnd.nextInt(6)])
      return

    # Warp outa here!
    if @keyPoll.isDown(control.warp)
      @warping = @rnd.nextInt(30)+30
      return

    # Speed up
#    if @decelerate
#      if (k++) is 1
#        jsb.reflection.callStaticMethod(
#          'org/cocos2dx/javascript/AppActivity',
#          'updateLeaderboard',
#          '(Ljava/lang/String;I)V',
#          'asteroids', 42)


      rotation = rotation or body.getAngVel()
      v = body.getVel()
      v.x -= (Math.cos(rotation) * control.accelerationRate * time)
      v.y -= (Math.sin(rotation) * control.accelerationRate * time)
      v.x = 0 if v.x < 0
      v.y = 0 if v.y < 0
      body.setVel(v)

    if @keyPoll.isDown(control.accelerate) or @accelerate
      rotation = rotation or body.getAngVel()
      v = body.getVel()
      v.x += (Math.cos(rotation) * control.accelerationRate * time)
      v.y += (Math.sin(rotation) * control.accelerationRate * time)
      body.setVel(v)

    # Rotate Left
    if @keyPoll.isDown(control.left) or @rotateLeft
      rotation = rotation or body.getAngVel()
      body.setAngVel(rotation - control.rotationRate * time)

    # Rotate Right
    if @keyPoll.isDown(control.right) or @rotateRight
      rotation = rotation or body.getAngVel()
      body.setAngVel(rotation + control.rotationRate * time)


    return # Void

