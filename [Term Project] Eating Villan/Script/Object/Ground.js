class Ground extends Box {
    className = "Ground"

    // Apply texture via override
    Initialize(resource) {
        super.Initialize(resource, 'Assets/Texture/ground_texture.png')
    }
    
    // Make the texture repeat
    // When this function is removed, the texture is applied in a scaler.
    TextureOption(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
    }
}