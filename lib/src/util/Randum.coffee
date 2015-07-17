class Randum
  ###
   * Generates a random boolean value.
  ###
  nextBool: -> ((~~(Math.random() * 32767)) & 1) is 1

  ###
   * Generates a random real value from 0.0, inclusive, to 1.0, exclusive.
  ###
  nextDouble: -> Math.random()

  ###
   * Generates a random int value from 0, inclusive, to max, exclusive.
  ###
  nextInt: (max) -> ~~(Math.random() * max)

