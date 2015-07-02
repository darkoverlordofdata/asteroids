class TouchableButton extends TouchableArea

  uniqueId = 0

  constructor: (controller, options) -> #x, y, radius, backgroundColor )
    for property, value of options
      if property is 'x'
        @[property] = controller.getPixels(value, 'x')
      else if property is 'x' or property is 'radius'
        @[property] = controller.getPixels(value, 'y')
      else
        @[property] = value

    super controller
    @sprite = @createSprite(controller.game)

  sprite: null
  type: 'button'
  fontFamily: 'opendyslexic'
  id: -1

  ###
  Checks if the touch is within the bounds of this direction
  ###
  check: (touchX, touchY) ->
    return true  if (Math.abs(touchX - @x) < @radius + (@controller.options.touchRadius / 2)) and (Math.abs(touchY - @y) < @radius + (@controller.options.touchRadius / 2))
    false

  draw: ->
    return

  setActive: (active) =>
    @sprite.setVisible(active)
    return

  createSprite: () ->
    sprite = new cc.DrawNode()
    color = switch @backgroundColor or 'white'
      when 'blue'   then cc.color(123, 181, 197, 153)
      when 'green'  then cc.color(29, 201, 36, 153)
      when 'red'    then cc.color(165, 34, 34, 153)
      when 'yellow' then cc.color(219, 217, 59, 153)
      when 'white'  then cc.color(255, 255, 255, 75)
    sprite.drawDot(cc.p(x, y), @radius, color)
    sprite.height = @radius
    sprite.width = @radius
    sprite.setPosition(cc.p(@x, @y))
    sprite.addChild(new cc.LabelTTF('FiRE', @fontFamily, 30))
    sprite.addChild(text)
    @controller.game.addChild(sprite)
    return

