class HudView

  graphics: null
  score: null
  lives: null
  x: 0
  y: 0
  rotation: 0


  constructor: (game, stage) ->

    size = cc.director.getWinSize()

    @graphics = new cc.DrawNode()
    @graphics.drawRect(cc.p(0, size.height/2 + 40), cc.p(30, size.height/2 - 40), cc.color(0xc0, 0xc0, 0xc0, 127))
    game.addChild(@graphics)

    @score = cc.LabelTTF.create('SCORE: 0', 'opendyslexic', 18)
    @score.setPosition(cc.p(size.width-130, size.height-20))
    game.addChild(@score)

    @setScore(0)
    @setLives(3)

  dispose: ->
    @graphics.removeFromParent(true)
    @score.removeFromParent(true)

  setLives: (lives) =>
#    @graphics.clear()
#    @graphics.beginFill(0xc0c0c0)
#    @graphics.drawRect(0, 0, 30, 40)
#    @graphics.endFill()
#    @graphics.beginFill( 0x000000 )
#    for i in [0...lives]
#      c = i*10+10
#      @graphics.moveTo( 10 + 10, c)
#      @graphics.lineTo( -7 + 10, 7 + c)
#      @graphics.lineTo( -4 + 10, c)
#      @graphics.lineTo( -7 + 10, -7 + c)
#      @graphics.lineTo( 10 + 10, c)
#
#    @graphics.endFill()
#    @graphics.alpha = 0.5
    return
#
  setScore: (score) =>
    @score.setString("SCORE: #{score}")
    return
#
#
