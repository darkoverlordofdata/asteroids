class MultiTouchListener

  event           : cc.EventListener.TOUCH_ALL_AT_ONCE
  swallowTouches  : true
  object          : null

  constructor: (@object) ->

    ###
     * onTouchBegan
     *
     * @param touch
     * @param event
     * @return none
    ###
  onTouchesBegan: (touches, event) =>
    touch = touches[0]
    point = touch.getLocation()
    rect = @object.getBoundingBox()
    if @object.drawShape is GameController.DRAW_DOT
      point.x += rect.width/2
      point.y += rect.height/2
    if cc.rectContainsPoint(rect, point)
      @object.onStart?(touch, point)
      return true
    return

  ###
   * onTouchMoved
   *
   * @param touch
   * @param event
   * @return none
  ###
  onTouchesMoved: (touches, event) =>
    touch = touches[0]
    point = touch.getLocation()
    rect = @object.getBoundingBox()
    if @object.drawShape is GameController.DRAW_DOT
      point.x += rect.width/2
      point.y += rect.height/2
    @object.onMove?(touch, point)
    return true

  ###
   * onTouchEnded
   *
   * @param touch
   * @param event
   * @return none
  ###
  onTouchesEnded: (touches, event) =>
    touch = touches[0]
    point = touch.getLocation()
    rect = @object.getBoundingBox()
    if @object.drawShape is GameController.DRAW_DOT
      point.x += rect.width/2
      point.y += rect.height/2
    @object.onEnd?(touch, point)
    return true


