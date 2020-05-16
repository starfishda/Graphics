// This is a variable for managing static class-specific resources
var Resource = {};

class DrawingObject {
    static geometry = null;
    static material = null;

    mesh;
    radius = 1;
    Initialize(resource) {

    }
    Enable() {
        // Initialize when the class is first used (only one executed)
        if (Resource[this.className] == null)
        {
            Resource[this.className] = {"className": this.className};
            this.Initialize(Resource[this.className])
        }
        this.mesh = this.CreateThreeMesh(Resource[this.className])

        // Store that class in a THREE object
        this.mesh.logic = this;

        // Add to Scene
        ObjectManager.Scene.add(this.mesh);

        this.Start();
        return this.mesh;
    }
    
    // Abstract function
    Start() {
    }

    // Abstract function
    Update() {
    }

    IsCollision(object) {
        if (object == null) return false;
        var difference = new THREE.Vector3();
        difference.copy(this.mesh.position).sub(object.mesh.position);
        return difference.length() <= this.radius + object.radius;
    }
    
    Dispose() {
        ObjectManager.disposelist.push(this);
    }
}