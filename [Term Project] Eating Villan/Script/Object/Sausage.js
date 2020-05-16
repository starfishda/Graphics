class Sausage extends MoveObject {
    static livesContainer = document.getElementById('lives');
    radius = 0.25 * 1.25;
    speed = 1.5
    className = "Sausage"

    createSausageModel(color1, back_color)
    {
        var model = new THREE.Group();
        var boxGeometry = new THREE.BoxGeometry(1, 1, 1);

        // Set material (for sausage color)
        var boxMaterial = [null, 
            new THREE.MeshLambertMaterial({ color: color1}), 
            new THREE.MeshLambertMaterial({ color: 'white' }),
            new THREE.MeshLambertMaterial({ color: 'black' }),
            new THREE.MeshLambertMaterial({ color: back_color})
        ];
        for(var y = 0; y < 14; y++) {
            for(var x = 0; x < 14; x++) {
                if (CHARACTER[y][x] != 0) {
                    var box = new THREE.Mesh(boxGeometry, boxMaterial[CHARACTER[y][x]]);
                    box.position.set(x - 7, y - 7, 0);
                    model.add(box)
                
                    var box = new THREE.Mesh(boxGeometry, boxMaterial[4]);
                    box.position.set(x - 7, y - 7, 1);
                    model.add(box)}
            }
        }
        model.scale.set(0.04, 0.04, 0.06)
        model.rotation.set(Math.PI * 1.5, Math.PI * 1.5,0)

        // Store the initial rotation value in a variable
        model.origin_rotation = new THREE.Vector3(Math.PI * 1.5, Math.PI * 1.5,0)

        // Map the object to a group (reason to separate the group-> scale, rotation to work independently)
        var group = new THREE.Group();
        group.add(model)
        return group;
    }

    CreateThreeMesh(resource) {
        // Give each ghost it's own material so we can change the colors of individual ghosts.
        var random = Math.ceil(Math.random() * 4)
        var mesh;
        if (random == 0)
            mesh = this.createSausageModel(0xE53A27, 0xCB3322)
        if (random == 1)
            mesh = this.createSausageModel(0xFE8B30, 0xDE7C2E)
        if (random == 2)
            mesh = this.createSausageModel(0x34E4E6, 0x2DCACC)
        else 
            mesh = this.createSausageModel(0xD78FB1, 0xB67292)
        return mesh;
    }

    Start() {
        this.mesh.direction = new THREE.Vector3(-1, 0, 0);
    }

    Update() {
        var previousPosition = new THREE.Vector3();
        var currentPosition = new THREE.Vector3();
        var leftTurn = new THREE.Vector3();
        var rightTurn = new THREE.Vector3();
        previousPosition.copy(this.mesh.position).addScaledVector(this.mesh.direction, 0.5).round();
        this.mesh.translateOnAxis(this.mesh.direction, ObjectManager.delta * this.speed);
        currentPosition.copy(this.mesh.position).addScaledVector(this.mesh.direction, 0.5).round();
        
        // Calculation of rotation direction
        var v1 = this.mesh.children[0].origin_rotation;
        var d = 0
        if (this.mesh.direction.x == -1)
            d = 2
        if (this.mesh.direction.x == 1)
            d = 0
        if (this.mesh.direction.y == 1)
            d = -1
        if (this.mesh.direction.y == -1)
            d = 1
        this.mesh.children[0].rotation.set(v1.x, v1.y + Math.PI * (d * 0.5), v1.z)
        
        // If the sausage is transitioning from one cell to the next, see if they can turn.
        if (!currentPosition.equals(previousPosition)) {
            leftTurn.copy(this.mesh.direction).applyAxisAngle(this.UP, Math.PI / 2);
            rightTurn.copy(this.mesh.direction).applyAxisAngle(this.UP, -Math.PI / 2);

            var forwardWall = this.isWall(currentPosition);
            var leftWall = this.isWall(currentPosition.copy(this.mesh.position).add(leftTurn));
            var rightWall = this.isWall(currentPosition.copy(this.mesh.position).add(rightTurn));

            if (!leftWall || !rightWall) {
                // If the ghsot can turn, randomly choose one of the possible turns.
                var possibleTurns = [];
                if (!forwardWall) possibleTurns.push(this.mesh.direction);
                if (!leftWall) possibleTurns.push(leftTurn);
                if (!rightWall) possibleTurns.push(rightTurn);

                var newDirection = possibleTurns[Math.floor(Math.random() * possibleTurns.length)];
                this.mesh.direction.copy(newDirection);

                // Snap ghost to center of current cell and start moving in new direction.
                this.mesh.position.round().addScaledVector(this.mesh.direction, ObjectManager.delta);
            }
        }

        // Check for collision between Pacman and ghost.
        if (this.IsCollision(pacman.logic)) {
                this.Dispose();
                numSausages -= 1;
                nnumSausagesEaten +=1;

                light.distance += change_value;

                var life = document.createElement('img');
                life.src = 'pinkghost.png';
                life.className = 'life';
                Sausage.livesContainer.appendChild(life);
        }
        
        super.Update();
    }
}