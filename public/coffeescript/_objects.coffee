
module.exports.Selector = class Selector

  constructor: (options, @scene) ->

    return unless options.size and options.position
    number = options.size if typeof options.size is "number"
    @position = new THREE.Vector3 options.position.x, options.position.y, options.position.z
    @geometry = new THREE.BoxGeometry(options.size.x, options.size.y, options.size.z)
    @isSelected = false

    unless options.material 
      @material = new THREE.MeshBasicMaterial({opacity: 0.01, transparent: true, color: 0xffffff, wireframe: true})
    else if options.material.id is undefined # tell if it is a THREE material 
      @material = material or new THREE.MeshBasicMaterial({opacity: 0.0, transparent: true, color: 0x008888, wireframe: false})

    @mesh = new THREE.Mesh @geometry, @material
    @mesh.position = @position
    @mesh.wrapper = @
    that = @

    @mesh.addEventListener "hover", that.hover
    @mesh.addEventListener "leave", that.leave
    @mesh.addEventListener "click", that.click
    @mesh.addEventListener "clear", that.clear

    unless @scene is undefined then @addToScene @scene

  addToScene: (scene) ->
    @scene = scene
    scene.add @mesh

  hover: () ->
    return if @isSelected is true
    if @oldmaterial is undefined
      @oldmaterial = @material
    @material = @hovermaterial or new THREE.MeshBasicMaterial({opacity: 0.45, transparent: true, color: 0x00aa88, wireframe: true})

  leave: () ->
    if @isSelected
      return
    else
      @material = @oldmaterial or new THREE.MeshBasicMaterial({color: 0x00aa88})

  click: () ->
    @isSelected = not @isSelected

    if @isSelected
      #@oldmaterial = @material
      @material = @selectedmaterial or new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
    else
      @material = @oldmaterial

  clear: () ->
    @isSelected = false
    @material = @oldmaterial or new THREE.MeshBasicMaterial({color: 0x008888})


module.exports.Skybox = class Skybox
  constructor:
    console.log "wow"






   
