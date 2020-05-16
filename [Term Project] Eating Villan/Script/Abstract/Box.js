class Box extends DrawingObject {
    className = "Box"
    Initialize(resource, textureUrl=null) {
        resource.geometry = new THREE.BoxGeometry(this.radius, this.radius, this.radius);
        resource.material = new THREE.MeshPhongMaterial({ color: 'white' });

        // Load if texture is needed
        if (textureUrl != null) {
            var textureload = new THREE.TextureLoader()
            var this_object = this;
            textureload.load(textureUrl, function (texture) 
            {
                // When loading is complete, set texture options
                this_object.TextureOption(texture)
                // Texture is applied from next object
                resource.material = new THREE.MeshPhongMaterial({ color: 'white', map:texture });

                // Update Material on existing objects
                ObjectManager.Scene.children.forEach(object => {
                    if (object.logic != undefined && object.logic.className == resource.className)
                        object.material = resource.material;
                });
            });
        }
    }

    // Abstract function
    TextureOption(texture) {

    }

    CreateThreeMesh(resource) {
        var mesh = new THREE.Mesh(resource.geometry, resource.material)
        return mesh;
    }
}