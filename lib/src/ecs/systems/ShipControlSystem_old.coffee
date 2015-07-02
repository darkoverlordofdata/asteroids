class ShipControlSystem extends ash.tools.ListIteratingSystem

  # implements EventListener
  event       : cc.EventListener.TOUCH_ONE_BY_ONE
  touchOrigin : null
  touchEnd    : null
  touching    : false
  warping     : 0
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


  constructor: (@game) ->
    super(@game.ash.nodes.PhysicsControlNode, @updateNode)
    @keyPoll = @game.keyPoll
    @rnd = @game.rnd
    size = cc.director.getWinSize()
    @width = size.width
    @height = size.height
    @controller = @game.controller
    sWarp = new cc.Sprite(res.warp)
    sWarp.x = size.width-200
    sWarp.y = 50
    @game.addChild(sWarp)
    cc.eventManager.addListener(this, sWarp)

  ###
   * onTouchBegan
   *
   * @param touch
   * @param event
   * @return none
  ###
  onTouchBegan: (touch, event) =>
    size = cc.director.getWinSize()
    pos = touch.getLocation()
    target = event.getCurrentTarget()
    locationInNode = target.convertToNodeSpace(pos)
    s = target.getContentSize()
    rect = cc.rect(0, 0, s.width, s.height)
    if cc.rectContainsPoint(rect, locationInNode)
      @warping = @rnd.nextInt(30)+30
      return true
    else
      if pos.x < size.width/2

        @touchOrigin = new cc.Sprite(res.touchorigin)
        @game.addChild(@touchOrigin, 0)
        @touchOrigin.setPosition(pos)

        @touchEnd = new cc.Sprite(res.touchend)
        @game.addChild(@touchEnd, 0)
        @touchEnd.setPosition(pos)

        @touching = true
        return true
    return

  ###
   * onTouchMoved
   *
   * @param touch
   * @param event
   * @return none
  ###
  onTouchMoved: (touch, event) =>
    @touchEnd.setPosition(touch.getLocation().x, @touchEnd.getPosition().y)
    return

  ###
   * onTouchEnded
   *
   * @param touch
   * @param event
   * @return none
  ###
  onTouchEnded: (touch, event) =>
    @touching = false
    @game.removeChild(@touchOrigin)
    @game.removeChild(@touchEnd)
    return

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

    if @warping
      @warping--
      x = @rnd.nextInt(@width)
      y = @rnd.nextInt(@height)
      body.p = cc.p(x, y)
      if @warping is 0
        node.display.graphic.draw(cc.color(255, 255, 255, 255))
      else
        node.display.graphic.draw(@colors[@rnd.nextInt(6)])
      return

    if @touching
      deltaX = (@touchEnd.getPosition().x - @touchOrigin.getPosition().x)

      # Rotate Left
      if deltaX < -2
        rotation = rotation or body.getAngVel()
        body.setAngVel(rotation + control.rotationRate * time)

      # Rotate Right
      else if deltaX > 2
        rotation = rotation or body.getAngVel()
        body.setAngVel(rotation - control.rotationRate * time)

      # Accelerate
      else
        rotation = rotation or body.getAngVel()
        v = body.getVel()
        v.x += (Math.cos(rotation) * control.accelerationRate * time)
        v.y += (Math.sin(rotation) * control.accelerationRate * time)

        body.setVel(v)

    else # check the keyboard
      # Warp outa here!
      if @keyPoll.isDown(control.warp) or @controller?.buttons?.warp
        @controller?.warp = false
        @warping = @rnd.nextInt(30)+30
        return

      # Speed up
      if @keyPoll.isDown(control.accelerate)
        rotation = rotation or body.getAngVel()
        v = body.getVel()
        v.x += (Math.cos(rotation) * control.accelerationRate * time)
        v.y += (Math.sin(rotation) * control.accelerationRate * time)
        body.setVel(v)

      # Rotate Left
      if @keyPoll.isDown(control.left)
        rotation = rotation or body.getAngVel()
        body.setAngVel(rotation - control.rotationRate * time)

      # Rotate Right
      if @keyPoll.isDown(control.right)
        rotation = rotation or body.getAngVel()
        body.setAngVel(rotation + control.rotationRate * time)


    return # Void

