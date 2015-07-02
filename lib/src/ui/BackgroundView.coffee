class BackgroundView

  graphics: null

  constructor: (game, path) ->

    @graphics = new cc.Sprite(path)
    game.addChild(@graphics)

  dispose: ->
    @graphics.removeFromParent(true)

