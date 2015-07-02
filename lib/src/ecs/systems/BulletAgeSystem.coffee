class BulletAgeSystem extends ash.tools.ListIteratingSystem

  entities: null

  constructor: (parent) ->
    super(parent.ash.nodes.BulletAgeNode, @updateNode)
    @entities = parent.entities

  updateNode: (node, time) =>

    bullet = node.bullet
    bullet.lifeRemaining -= time
    if bullet.lifeRemaining <= 0
      node.display.graphic.dispose()
      @entities.destroyEntity node.entity
    return # Void

