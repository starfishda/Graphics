class MoveObject extends DrawingObject {
    UP = new THREE.Vector3(0, 0, 1);
    LEFT = new THREE.Vector3(-1, 0, 0);
    TOP = new THREE.Vector3(0, 1, 0);
    RIGHT = new THREE.Vector3(1, 0, 0);
    BOTTOM = new THREE.Vector3(0, -1, 0);

    getAt(position) {
        var x = Math.round(position.x), y = Math.round(position.y);
        return map[y] && map[y][x];
    }

    isWall(position) {
        var cell = this.getAt(position);
        return cell && cell.isWall === true;
    }

    VaildPosition() {
        // Check for collision with walls.
        var leftSide = this.mesh.position.clone().addScaledVector(this.LEFT, this.radius).round();
        var topSide = this.mesh.position.clone().addScaledVector(this.TOP, this.radius).round();
        var rightSide = this.mesh.position.clone().addScaledVector(this.RIGHT, this.radius).round();
        var bottomSide = this.mesh.position.clone().addScaledVector(this.BOTTOM, this.radius).round();

        if (this.isWall(leftSide))
            this.mesh.position.x = leftSide.x + 0.5 + this.radius;
        if (this.isWall(rightSide))
            this.mesh.position.x = rightSide.x - 0.5 - this.radius;
        if (this.isWall(topSide)) 
            this.mesh.position.y = topSide.y - 0.5 - this.radius;
        if (this.isWall(bottomSide)) 
            this.mesh.position.y = bottomSide.y + 0.5 + this.radius;
    }

    Update() {
        var object = this.mesh;
        if (object.position.x < map.left)
            object.position.x = map.right;
        else if (object.position.x > map.right)
            object.position.x = map.left;
        if (object.position.y > map.top)
            object.position.y = map.bottom;
        else if (object.position.y < map.bottom)
            object.position.y = map.top;
    }
}