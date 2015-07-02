###
 * Provide user input
###
class KeyPoll

  @KEY_LEFT         = 37    # turn left
  @KEY_UP           = 38    # accelerate
  @KEY_RIGHT        = 39    # turn right
  @KEY_Z            = 90    # fire
  @KEY_W            = 87    # warp
  @KEY_SPACE        = 32    # warp

  states: null
  keys: [@KEY_LEFT, @KEY_RIGHT, @KEY_Z, @KEY_UP, @KEY_SPACE]

  constructor:(@game) ->
    @states = {}
    cc.eventManager.addListener
      event: cc.EventListener.KEYBOARD
      onKeyPressed: (keyCode, event) =>
        @states[keyCode] = true
        return
      onKeyReleased: (keyCode, event) =>
        @states[keyCode] = false if @states[keyCode]
        return
    , @game

  isDown: (keyCode) =>
    return @states[keyCode]

  isUp: (keyCode) =>
    return not @states[keyCode]

