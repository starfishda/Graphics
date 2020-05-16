class PlayerLight extends DrawingObject {
    static LIGHT_SCALE = 3;
    className = "PlayerLight"
    CreateThreeMesh(resource) {
        var mesh = new THREE.PointLight('white', 0.8, PlayerLight.LIGHT_SCALE)
        return mesh;
    }

    Update() {
        // Follow the player's position.
        this.mesh.position.set(pacman.position.x, pacman.position.y, 2);
    }
}