
module.exports.Cube = class Cube

  constructor: (size, position, material, @scene) ->
    # This is a constructor for the Tile object
    number = size if typeof size is "number"
    @position = new THREE.Vector3 position.x, position.y, position.z
    @geometry = new THREE.BoxGeometry((number or size.x), (number or size.y), (number or size.z))

    unless material # tell if it is a THREE material 
      @material = new THREE.MeshBasicMaterial({color: 0x008888, wireframe: true})
    else if material.id is undefined
      @material = material or new THREE.MeshBasicMaterial({color: 0x008888, wireframe: false})
    @cube = new THREE.Mesh @geometry, @material
    @cube.position = @position

    unless @scene is undefined then @addToScene @scene
  addToScene: (scene) ->
    @scene = scene
    scene.add @cube

module.exports.Skybox = class Skybox
  constructor:
    console.log "wow"






   
