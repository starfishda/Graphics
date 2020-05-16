class Wall extends Box {
    className = "Wall"

    // Apply texture via override
    Initialize(resource) {
        super.Initialize(resource, 'Assets/Texture/wall_texture.png')
    }

    Start() {
        this.mesh.isWall = true;
    }
}