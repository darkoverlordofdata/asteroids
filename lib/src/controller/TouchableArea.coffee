###
Superclass for touchable stuff
###
class TouchableArea

  # Called when this direction is being touched
  touchStart: null

  # Called when this direction is being moved
  touchMove: null

  # Called when this direction is no longer being touched
  touchEnd: null
  type: 'area'
  id: false
  active: false

  constructor: (@controller) ->
  ###
  Sets the user-specified callback for this direction being touched
  @param {function} callback
  ###
  setTouchStart: (callback) ->
    @touchStart = callback
    return


  ###
  Called when this direction is no longer touched
  ###
  touchStartWrapper: (e) ->

    # Fire the user specified callback
    @touchStart()  if @touchStart

    # Mark this direction as active
    @setActive?(true)
    @active = true
    return


  ###
  Sets the user-specified callback for this direction no longer being touched
  @param {function} callback
  ###
  setTouchMove: (callback) ->
    @touchMove = callback
    return


  ###
  Called when this direction is moved. Make sure it's actually changed before passing to developer
  ###
  lastPosX: 0
  lastPosY: 0
  touchMoveWrapper: (touch, event) ->

    # Fire the user specified callback
    pos = touch.getLocation()
    if @touchMove and (pos.x isnt TouchableArea::lastPosX or pos.y isnt TouchableArea::lastPosY)
      @touchMove()
      @lastPosX = pos.x
      @lastPosY = pos.y

    # Mark this direction as active
    @active = true
    @setActive?(true)
    return


  ###
  Sets the user-specified callback for this direction no longer being touched
  @param {function} callback
  ###
  setTouchEnd: (callback) ->
    @touchEnd = callback
    return


  ###
  Called when this direction is first touched
  ###
  touchEndWrapper: (e) ->

    # Fire the user specified callback
    @touchEnd()  if @touchEnd

    # Mark this direction as inactive
    @active = false
    @setActive?(false)
    @controller.render()
    return


