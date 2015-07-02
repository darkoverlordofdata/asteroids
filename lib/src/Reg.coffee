# Static Registry Class & Blackboard
#
# global variables
# events
# preferences

class Reg extends Properties # static inheritance!

  _action = new Phaser.Signal()
  _create = new Phaser.Signal()
  _drop = new Phaser.Signal()
  _reset = new Phaser.Signal()
  _scored = new Phaser.Signal()
  _timer = new Phaser.Signal()
  _upgrade = new Phaser.Signal()
  _rnd = new MersenneTwister()
  _level = 0
  _music = true
  _sfx = true
  _puzzle = null
  _gems = []
  _type = ''
  _difficulty = 0
  _score = 0


  Object.defineProperties @,

    # Constant values
    SFX_COUNT:  get: -> 19
    GEMSIZE:    get: -> 48
    GEMTYPES:   get: -> [
      'blue'
      'cyan'
      'green'
      'magenta'
      'orange'
      'pink'
      'red'
      'yellow'
    ]

    # Events
    scored:     get: -> _scored
    upgrade:    get: -> _upgrade
    drop:       get: -> _drop
    createGems: get: -> _create
    reset:      get: -> _reset
    timer:      get: -> _timer

    # Properties
    rnd:        get: -> _rnd
    gems:       get: -> _gems
    puzzle:     get: -> _puzzle
    difficulty: get: -> _difficulty
    score:      get: -> _score
    sfx:        get: -> _sfx
    volume:     get: -> if _sfx then 0.5 else 0
    type:       get: -> _type

    # Level
    level:
      get: -> _level
      set: (value) ->
        _level = value
        _upgrade.dispatch(value)
        return value


  ###
   * Start new game
   *
   * @param type - GameType
   * @param score - starting score
   * @return none
  ###
  @start: (type, score) =>
    _type = type
    _score = score
    if score is 0
      _difficulty = 0
    else
      _difficulty += 1
    return

  ###
   * Update score
   *
   * @param points
   * @return none
  ###
  @updateScore: (points) ->
    _score += points
    _scored.dispatch(points)
    return

  ###
   * Create Puzzle
   *
   * @param options
   * @return none
  ###
  @createPuzzle: (options) ->
    _puzzle = new jMatch3.Grid(options)
    return
