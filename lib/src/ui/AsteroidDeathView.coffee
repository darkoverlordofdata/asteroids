class AsteroidDeathView

  dots: null
  x: 0
  y: 0
  rotation: 0
  stage: null
  first: true

  constructor: (game, radius) ->
    @dots = []
    for i in [0...8]
      dot = new Dot(game, game.rnd, radius)
      @dots.push(dot)

  animate: (time) =>
    if @first
      @first = false
      for dot in @dots
        dot.graphics.x = @x
        dot.graphics.y = @y

    for dot in @dots
      dot.graphics.x += dot.velocity.x * time
      dot.graphics.y += dot.velocity.y * time

  dispose: () ->
    for dot in @dots
      dot.graphics.removeFromParent(true)

class Dot

  velocity: null
  graphics: null
  x: 0
  y: 0

  constructor: (game, rnd, maxDistance) ->
    @graphics = new cc.DrawNode()
    game.addChild(@graphics)
    color = cc.color(255, 255, 255, 255)
    angle = rnd.nextDouble() * 2 * Math.PI
    distance = rnd.nextDouble() * maxDistance
    x = Math.cos(angle) * distance
    y = Math.sin(angle) * distance
    @graphics.drawDot(cc.p(x, y), 1, color)

    speed = rnd.nextDouble() * 10 + 10
    @velocity = new Point(Math.cos(angle)*speed, Math.sin(angle)*speed)
#    @stage.addChild(@graphics)