class GunControlSystem extends ash.tools.ListIteratingSystem

  # implements EventListener
  event       : cc.EventListener.TOUCH_ONE_BY_ONE
  shooting    : false
  game        : null
  keyPoll     : null  # KeyPoll
  entities    : null  # EntityCreator
  buttons     : null


  constructor: (@game) ->
    super(@game.ash.nodes.GunControlNode, @updateNode)
    @keyPoll = @game.keyPoll
    @entities = @game.entities
    @buttons = @game.controller?.buttons
    size = cc.director.getWinSize()
    sFire = new cc.Sprite(res.fire)
    sFire.x = size.width-50
    sFire.y = 50
    @game.addChild(sFire)
    cc.eventManager.addListener(this, sFire)

  ###
   * onTouchBegan
   *
   * @param touch
   * @param event
   * @return none
  ###
  onTouchBegan: (touch, event) =>
    target = event.getCurrentTarget()
    locationInNode = target.convertToNodeSpace(touch.getLocation())
    s = target.getContentSize()
    rect = cc.rect(0, 0, s.width, s.height)
    if cc.rectContainsPoint(rect, locationInNode)
      @shooting = true
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
    return

  ###
   * onTouchEnded
   *
   * @param touch
   * @param event
   * @return none
  ###
  onTouchEnded: (touch, event) =>
    @shooting = false
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
    position = node.position
    gun = node.gun
    # Fire!
    gun.shooting = @shooting or @keyPoll.isDown(control.trigger) # or @buttons?.fire
    gun.timeSinceLastShot += time
    if gun.shooting and gun.timeSinceLastShot >= gun.minimumShotInterval
      @entities.createUserBullet gun, position
      #node.audio.play(ShootGun);
      gun.timeSinceLastShot = 0
    return # Void

