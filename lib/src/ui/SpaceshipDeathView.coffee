class SpaceshipDeathView

  shape1: null
  shape2: null
  vel1: null
  vel2: null
  rot1: null
  rot2: null
  first: true
  x: 0
  y: 0
  rotation: 0
  check: true

  constructor: (game) ->

    rnd = game.rnd
    color = cc.color(255, 255, 255, 255)

    @shape1 = new cc.DrawNode()
    game.addChild(@shape1)

    v = [
      cc.p(10, 0)
      cc.p(-7, 7)
      cc.p(-4, 0)
      cc.p(10, 0)
    ]
    @shape1.drawPoly(v, color, 1, color)

    @shape2 = new cc.DrawNode()
    game.addChild(@shape2)

    v = [
      cc.p(10, 0)
      cc.p(-7, -7)
      cc.p(-4, 0)
      cc.p(10, 0)
    ]
    @shape2.drawPoly(v, color, 1, color)

    @vel1 = new Point(rnd.nextDouble() * 10 - 5, rnd.nextDouble() * 10 + 10)
    @vel2 = new Point(rnd.nextDouble() * 10 - 5, - (rnd.nextDouble() * 10 + 10))
    
    @rot1 = rnd.nextDouble() * 300 - 150
    @rot2 = rnd.nextDouble() * 300 - 150

  dispose: ->
    @shape1.removeFromParent(true)
    @shape2.removeFromParent(true)


  animate: (time) =>

    if @first
      @first = false
      @shape1.setPosition(cc.p(@x, @y))
      @shape2.setPosition(cc.p(@x, @y))
      @shape1.setRotation(@rotation)
      @shape2.setRotation(@rotation)

    @shape1.setPositionX(@shape1.getPositionX() + @vel1.x * time)
    @shape1.setPositionY(@shape1.getPositionY() + @vel1.y * time)
    @shape1.setRotation(@shape1.getRotation() + @rot1 * time)

    @shape2.setPositionX(@shape2.getPositionX() + @vel2.x * time)
    @shape2.setPositionY(@shape2.getPositionY() + @vel2.y * time)
    @shape2.setRotation(@shape2.getRotation() + @rot2 * time)

    return


