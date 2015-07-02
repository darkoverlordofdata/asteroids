class GameController

  DRAW_DOT    = 1
  DRAW_RECT   = 2

  fontName    : 'Arial'
  controls    : null

  ###*
   * GameController
   *
   * @param game cc.Level object containing the game screen
   * @param options hash
  ###
  constructor: (@game, options) ->
    @fontName = options.fontName or @fontName
    @controls = []

  ###
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
  ###
  addButton: (options) ->
    control = new cc.DrawNode()

    if options.radius?
      control.drawDot(cc.p(0, 0), options.radius, options.color)
      control.attr
        height: options.radius*2
        width: options.radius*2
        drawShape: DRAW_DOT

    else if options.width?
      control.drawRect(cc.p(0, 0), cc.p(options.width, options.height), options.color, 1, options.color)
      control.height = options.height
      control.width = options.width
      control.drawShape = DRAW_RECT

    if options.text?
      control.addChild(new cc.LabelTTF(options.text, @fontName, options.size))

    control.setPosition(options.position)
    control.onStart = options.onStart
    control.onMove = options.onMove
    control.onEnd = options.onEnd
    @controls.push(control)
    @game.addChild(control)
    cc.eventManager.addListener(new MultiTouchListener(control), control)
    return control

  ###
   * Add DPad
   *
   * @param position  cc.Point button x,y location
   * @param radius    Number button radius
   * @param color     cc.Color button color
   * @param up        events
   * @param down      events
   * @param left      events
   * @param right     events
  ###
  addDPad: (options) ->
    dpad = new cc.DrawNode()
    dpad.drawDot(cc.p(0, 0), options.radius, options.color)
    dpad.height = options.radius*2
    dpad.width = options.radius*2
    dpad.setPosition(options.position)
    x = options.position.x
    y = options.position.y
    @controls.push(dpad)
    @game.addChild(dpad)

    if options.up?
      @addButton
        position  : cc.p(x-(options.radius * 0.54), y+(options.radius * 0.57))
        width     : options.radius * 1.08
        height    : options.radius * 0.81
        color     : cc.color(0, 0, 0, 255)
        onStart   : options.up.onStart
        onMove    : options.up.onMove
        onEnd     : options.up.onEnd

    if options.down?
      @addButton
        position  : cc.p(x-(options.radius * 0.54), y-(options.radius * 1.22))
        width     : options.radius * 1.08
        height    : options.radius * 0.81
        color     : cc.color(0, 0, 0, 255)
        onStart   : options.down.onStart
        onMove    : options.down.onMove
        onEnd     : options.down.onEnd

    if options.left?
      @addButton
        position  : cc.p(x-(options.radius * 1.14), y-(options.radius * 0.52))
        width     : options.radius * 0.81
        height    : options.radius * 1.08
        color     : cc.color(0, 0, 0, 255)
        onStart   : options.left.onStart
        onMove    : options.left.onMove
        onEnd     : options.left.onEnd

    if options.right?
      @addButton
        position  : cc.p(x+(options.radius * 0.32), y-(options.radius * 0.52))
        width     : options.radius * 0.81
        height    : options.radius * 1.08
        color     : cc.color(0, 0, 0, 255)
        onStart   : options.right.onStart
        onMove    : options.right.onMove
        onEnd     : options.right.onEnd


    return dpad

  addJoystick: (pos, size, radius, color) ->
    joystick = new cc.DrawNode()
    return joystick

  class MultiTouchListener
  
    event           : cc.EventListener.TOUCH_ALL_AT_ONCE
    swallowTouches  : true
    control         : null
  
    constructor: (@control) ->
  
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
      rect = @control.getBoundingBox()
      if @control.drawShape is DRAW_DOT
        point.x += rect.width/2
        point.y += rect.height/2
      if cc.rectContainsPoint(rect, point)
        @control.onStart?(touch, point)
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
      rect = @control.getBoundingBox()
      if @control.drawShape is DRAW_DOT
        point.x += rect.width/2
        point.y += rect.height/2
      @control.onMove?(touch, point)
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
      rect = @control.getBoundingBox()
      if @control.drawShape is DRAW_DOT
        point.x += rect.width/2
        point.y += rect.height/2
      @control.onEnd?(touch, point)
      return true
  
  
