class AsteroidView

  graphics: null

  constructor: (game, radius) ->

    rnd = game.rnd

    @graphics = new cc.DrawNode()
    game.addChild(@graphics)
    color = cc.color(255, 255, 255, 255)

    angle = 0
    v = [cc.p(radius, 0)]
    while angle < Math.PI * 2
      length = (0.75 + rnd.nextDouble() * 0.25) * radius
      posX = Math.cos(angle) * length
      posY = Math.sin(angle) * length
      v.push(cc.p(posX, posY))
      angle += rnd.nextDouble() * 0.5
    v.push(cc.p(radius, 0))
    @graphics.drawPoly(v, color, 1, color)

  dispose: ->
    @graphics.removeFromParent(true)

