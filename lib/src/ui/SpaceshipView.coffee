class SpaceshipView

  graphics: null

  constructor: (@game) ->
    @graphics = new cc.DrawNode()
    @game.addChild(@graphics)
    @draw(cc.color(255, 255, 255, 255))

  dispose: ->
    @graphics.removeFromParent(true)

  draw: (color) ->
    v = [
      cc.p(10, 0)
      cc.p(-7, 7)
      cc.p(-4, 0)
      cc.p(-7, -7)
      cc.p(10, 0)
    ]
    @graphics.drawPoly(v, color, 1, color)
