class GunControlSystem extends ash.tools.ListIteratingSystem

  shooting    : false
  keyPoll     : null  # Keyboard
  entities    : null  # EntityCreator

  constructor: (game) ->

    super(game.ash.nodes.GunControlNode, @updateNode)
    @keyPoll = game.keyPoll
    @entities = game.entities

    game.controller.addButton
      text      : 'FiRE'
      size      : 30
      radius    : 37
      color     : cc.color(0xe8, 0xe1, 0x0e, 0x1f)
      position  : cc.p(game.width-50, 50)
      onStart   : (touch, point) => @shooting = true
      onEnd     : (touch, point) => @shooting = false


  ###
   * updateNode
   *
   * @param node
   * @param time
   * @return none
  ###
  updateNode: (node, time) =>
    control = node.control
    position = node.position
    gun = node.gun
    # Fire!
    gun.shooting = @shooting or @keyPoll.isDown(control.trigger) # or @buttons?.fire
    gun.timeSinceLastShot += time
    if gun.shooting and gun.timeSinceLastShot >= gun.minimumShotInterval
      @entities.createUserBullet gun, position
      #node.audio.play(ShootGun);
      gun.timeSinceLastShot = 0
    return # Void

