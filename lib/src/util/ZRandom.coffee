class ZRandom
  ###
   * Generates a random boolean value.
  ###
  nextBool: ->
    return ((~~(Math.random() * 32767)) & 1) is 1

  ###
   * Generates a random real value from 0.0, inclusive, to 1.0, exclusive.
  ###
  nextDouble: ->
    return Math.random()

  ###
   * Generates a random int value from 0, inclusive, to max, exclusive.
  ###
  nextInt: (max) ->
    return ~~(Math.random() * max)

