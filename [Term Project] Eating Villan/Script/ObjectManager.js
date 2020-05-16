class ObjectManager {
    static Scene = new THREE.Scene();
    static Renderer;
    static disposelist = [];
    static keyState = {};
    static delta = 0;
    static now = 0;

    static Initialize() {
        this.CreateRenderer();
        this.CreateKeyState();
    }

    static CreateRenderer() {
        this.Renderer = new THREE.WebGLRenderer({ antialias: true });
        this.Renderer.setClearColor('black', 1.0);
        this.Renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.Renderer.domElement);
    }

    static Update(delta, now) {
        this.delta = delta;
        this.now = now;

        // Update each object
        this.Scene.children.forEach(object => {

            // Check It is Only DrawingObject
            if (object.logic != undefined)
                object.logic.Update();
        });

        // Compute Dispose object (because remove is not working in foreach instruction)
        this.disposelist.forEach(element => {
            this.Scene.remove(element.mesh);
        });
        this.disposelist = [];
    }

    static CreateKeyState() {
        // Add 'receved event' (key) -> Store to ObjectManager.keyState
        document.body.addEventListener('keydown', function (event) {
            ObjectManager.keyState[event.keyCode] = true;
            ObjectManager.keyState[String.fromCharCode(event.keyCode)] = true;
        });
        document.body.addEventListener('keyup', function (event) {
            ObjectManager.keyState[event.keyCode] = false;
            ObjectManager.keyState[String.fromCharCode(event.keyCode)] = false;
        });
        document.body.addEventListener('blur', function (event) {
            for (var key in ObjectManager.keyState) {
                if (ObjectManager.keyState.hasOwnProperty(key))
                    ObjectManager.keyState[key] = false;
            }
        });
    }

    static KeyDown(code) {
        return this.keyState[code];
    }
}