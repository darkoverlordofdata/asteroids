class WaitForStartView

  @count = 0

  Signal0 = ash.signals.Signal0

  x: 0
  y: 0
  rotation: 0
  text1: null
  text2: null
  text3: null

  click: null

  isTouch = cc.sys.isMobile
  isDesktop = not cc.sys.isMobile
  
  constructor: (@game) ->
    @click = new Signal0()
    size = cc.director.getWinSize()

    x = Math.floor(size.width/2)

    if (WaitForStartView.count++) is 1
      @text1 = cc.LabelTTF.create('GAME OVER', 'opendyslexic', 40)
      @text1.setPosition(cc.p(x, 200))
    else
      @text1 = cc.LabelTTF.create('ASTEROIDS', 'opendyslexic', 40)
      @text1.setPosition(cc.p(x, 200))

    @game.addChild(@text1)

    if isTouch
      @text2 = cc.LabelTTF.create('TOUCH TO START', 'opendyslexic', 12)
      @text2.setPosition(cc.p(x, 175))
    else
      @text2 = cc.LabelTTF.create('CLICK TO START', 'opendyslexic', 12)
      @text2.setPosition(cc.p(x, 175))

    @game.addChild(@text2)

    if isDesktop
      @text3 = cc.LabelTTF.create('Z ~ Fire  |  SPACE ~ Warp  |  Left/Right ~ Turn  |  Up ~ Accelerate', 'opendyslexic', 10)
      @text3.setPosition(cc.p(x, 40))

      @game.addChild(@text3)

    cc.eventManager.addListener(
      event: cc.EventListener.TOUCH_ONE_BY_ONE
      swallowTouches: true
      onTouchBegan: @onTouchBegan
      onTouchMoved: @onTouchMoved
      onTouchEnded: @onTouchEnded
    , @text1)


#    @circle = new cc.DrawNode()
#    @circle.drawDot(cc.p(0, 0), 100, cc.color(255, 255, 255, 255))
#    @game.addChild(@circle)

  start: (data) =>

  onTouchBegan: (touch, event) =>
    @game.removeChild(@text1)
    @game.removeChild(@text2)
    @game.removeChild(@text3) if @text3?
    @click.dispatch()
#    size = cc.director.getWinSize()
#    @circle.setPosition(cc.p(size.width / 2, size.height / 2))

  onTouchMoved: (touch, event) =>
  onTouchEnded: (touch, event) =>