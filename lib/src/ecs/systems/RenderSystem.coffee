class RenderSystem extends ash.core.System

  stage     : null
  renderer  : null
  nodes     : null  # NodeList
  k = 0
  j = 0

  Tau = Math.PI*2

  constructor: (game) ->
    @nodes = game.ash.nodes

  addToEngine: (engine) ->
    @nodes = engine.getNodeList(@nodes.RenderNode)
    node = @nodes.head

    while node
      @addToDisplay node
      node = node.next
#    @nodes.nodeAdded.add @addToDisplay, this
#    @nodes.nodeRemoved.add @removeFromDisplay, this
    return # Void

  addToDisplay:(node) ->

  removeFromDisplay: (node) ->


  removeFromEngine: (engine) ->
    @nodes = null
    return # Void

  update: (time) =>

    size = cc.director.getWinSize()
    offsetX = ~~size.width/2
    offsetY = ~~size.height/2
    node = @nodes.head

    while node
      if (g = node.display.graphic.graphics)?
        pos = node.position.position
        g.setPosition(cc.p(pos.x + offsetX, pos.y + offsetY))
        g.setRotation(cc.radiansToDegrees(Tau-node.position.rotation))

      node = node.next

    return

