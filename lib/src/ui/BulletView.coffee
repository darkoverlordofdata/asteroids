class BulletView

  graphics: null

  constructor: (game) ->

    @graphics = new cc.DrawNode()
    game.addChild(@graphics)
    color = cc.color(255, 255, 255, 255)
    @graphics.drawDot(cc.p(0, 0), 2, color)

  dispose: ->
    @graphics.removeFromParent(true)