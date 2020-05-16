class Pacman extends MoveObject {
    radius = 0.25;
    speed = 2
    className = "Pacman"

    distanceMoved = 0
    Initialize(resource) {
        resource.geometry = [];
        var numFrames = 40;
        var offset;
        for (var i = 0; i < numFrames; i++) {
            offset = (i / (numFrames - 1)) * Math.PI;
            resource.geometry.push(new THREE.SphereGeometry(this.radius, 16, 16, offset, Math.PI * 2 - offset * 2));
            resource.geometry[i].rotateX(Math.PI / 2);
        }
        resource.material = new THREE.MeshPhongMaterial({ color: 'yellow', side: THREE.DoubleSide });
    }

    CreateThreeMesh(resource) {
        var mesh = new THREE.Mesh(resource.geometry[0], resource.material)
        mesh.frames = resource.geometry;
        mesh.currentFrame = 0;
        return mesh;
    }

    Start() {
        // Initialize pacman facing to the left.
        this.mesh.direction = new THREE.Vector3(-1, 0, 0);
    }

    Update() {
        // Otherwise, show eating animation based on how much pacman has moved.
        var maxAngle = Math.PI / 4;
        var angle = (this.distanceMoved * 2) % (maxAngle * 2);
        if (angle > maxAngle)
            angle = maxAngle * 2 - angle;
        var frame = Math.floor(angle / Math.PI * this.mesh.frames.length);
        this.mesh.geometry = this.mesh.frames[frame];

        var delta = ObjectManager.delta;
        if (!won) { 
            pacman.up.copy(pacman.direction).applyAxisAngle(this.UP, -Math.PI / 2);
            pacman.lookAt(pacman.position.clone().add(this.UP));

            // Move based on current keys being pressed.
            if (ObjectManager.KeyDown(0x26)) {
                // W - move forward
                pacman.translateOnAxis(this.LEFT, this.speed * delta);
                this.distanceMoved += this.speed * delta;
            }
            if (ObjectManager.KeyDown(0x25)) {
                // A - rotate left
                pacman.direction.applyAxisAngle(this.UP, Math.PI / 2 * delta);
            }
            if (ObjectManager.KeyDown(0x27)) {
                // D - rotate right
                pacman.direction.applyAxisAngle(this.UP, -Math.PI / 2 * delta);
            }
            if (ObjectManager.KeyDown(0x28)) {
                // S - move backward
                pacman.translateOnAxis(this.LEFT, -this.speed * delta);
                this.distanceMoved += this.speed * delta;
            }
            this.VaildPosition();
        }
        super.Update();
    }
}