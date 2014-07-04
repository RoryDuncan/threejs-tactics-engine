
###
      utilities
###

module.exports.extend = (objs...) ->
  return objs[0] if objs.length < 2

  extended = objs[0]

  for obj in objs
      
    base = obj

    for key of base
      extended[key] = base[key]

  return extended



