class Item extends Box {
    static first_item = true;
    className = "Item"
    radius = 0.3;

    random = function(f,l) {
        if (f > l) {
            t = f
            f = l
            l = t
        }
        return Math.floor(Math.random() * (l-f) + f)
    }

    Start() {
        // The location is randomly determined.
        while(true) {
            var x = this.random(map.left, map.right)
            var y = this.random(map.bottom, map.top)
            if (Item.first_item) {
                Item.first_item = false
                x = 11
                y = -23
            }
            if (map[y][x] == undefined) {
                this.mesh.position.set(x, y, 0)
                break;
            }
        }
    }

    Update() {
        // Effect when colliding with Pacman
        if (this.IsCollision(pacman.logic)) {
            var time = 0;
            var timer = window.setInterval(function(){
                time += 1;
                if (time <=100)
                    light.distance += 0.1; // Light up
                else
                    light.distance -= 0.1; // Light down
                if (time == 200) 
                    clearInterval(timer)
            }, 16);
            this.Dispose();
        }
    }
}