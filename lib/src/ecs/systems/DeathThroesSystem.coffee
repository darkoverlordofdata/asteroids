class DeathThroesSystem extends ash.tools.ListIteratingSystem

  entities: null

  constructor: (game) ->
    super(game.ash.nodes.DeathThroesNode, @updateNode)
    @entities = game.entities

  updateNode: (node, time) =>

    dead = node.dead
    dead.countdown -= time
    if (dead.countdown <= 0)
      @entities.destroyEntity(node.entity)
      node.display.graphic.dispose()

    return # Void
