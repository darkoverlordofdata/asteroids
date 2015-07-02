#+--------------------------------------------------------------------+
#| Properties.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of abstract_game.coffee
#|
#| abstract_game.coffee is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# AbstractGame
#
# manages standard infrastructure:
#
#   Initialization
#   Settings
#
class Properties

  _db = null
  _name = ''
  _properties = null

  @init: (name, properties) ->
    _name = name
    _properties = properties

    _db = new localStorageDB(_name, cc.sys.localStorage)
    isNew = _db.isNew()
    if isNew
      _db.createTable 'settings', ['name', 'value']
      _db.createTable 'leaderboard', ['date', 'score']
      for key, val of _properties
        _db.insert 'settings', name: key, value: val
      _db.commit()


  ###
   * Get Game Property from local storage
   *
   * @param property name
   * @return property value
  ###
  @get: (prop) ->
    return _db.queryAll('settings', query: name: prop)[0].value

  ###
   * Set Game Property in local storage
   *
   * @param property name
   * @param property value
   * @return nothing
  ###
  @set: (prop, value) =>
    _db.update('settings', name: prop, (row) -> row.value = value; return row)
    _db.commit()
    return

