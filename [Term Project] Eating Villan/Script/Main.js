var pacman;
var light;

var won = false;
var numSausages = 0;
var nnumSausagesEaten = 0;

var change_value = 1; // easy = 3 , normal = 2, hard = 1

var map = {};
window.onload = function () {
    
    var getParameters = function (paramName) {
        var returnValue;
        var url = location.href;
        var parameters = (url.slice (url.indexOf ( '?') + 1, url.length)). split ( '&');
        for (var i = 0; i <parameters.length; i ++) {
            var varName = parameters [i] .split ( '=') [0];
            if (varName.toUpperCase () == paramName.toUpperCase ()) {
                returnValue =parameters[i] .split ( '=') [1];
                return decodeURIComponent (returnValue);
            }
        }
    };

    var UP = new THREE.Vector3(0, 0, 1);

    var createMap = function (scene) {
        map.bottom = -(mapDesign.length - 1);
        map.top = 0;
        map.left = 0;
        map.right = 0;
        map.numDots = 0;
        map.pacmanSpawn = null;
        map.ghostSpawn = null;

        var x, y;
        // Create Map using (map Design)
        for (var row = 0; row < mapDesign.length; row++) {
            y = -row;


            map[y] = {};

            var length = Math.floor(mapDesign[row].length / 2);
            map.right = Math.max(map.right, length);

            for (var column = 0; column < mapDesign[row].length; column += 2) {
                x = Math.floor(column / 2);
                
                // Check object (placed this)
                var cell = mapDesign[row][column];

                if (cell === '0') {
                    var wall = new Wall();
                    var mesh = wall.Enable();
                    mesh.position.set(x, y, 0);
                    map[y][x] = mesh;
                } else if (cell === 'P') {
                    map.pacmanSpawn = new THREE.Vector3(x, y, 0);
                } else if (cell === 'G') {
                    map.ghostSpawn = new THREE.Vector3(x, y, 0);
                }
                
            }
        }
		var finishDialog = document.getElementById('finish-dialog');
		finishDialog.style.visibility = 'hidden';

        map.centerX = (map.left + map.right) / 2;
        map.centerY = (map.bottom + map.top) / 2;

        // Create ground
        x = Math.abs(map.left - map.right);
        y = Math.abs(map.bottom - map.top);

        var mesh = new Ground().Enable();
        mesh.geometry = new THREE.BoxGeometry(x, y, 1);
        mesh.position.set(x/2 , -y / 2, -1)
        
        return map;
    };

    var renderHud = function (renderer, hudCamera, scene) {
        // Increase size to display (to minimap)
        scene.children.forEach(function (object) {
            if (object.isWall !== true)
                object.scale.set(2.5, 2.5, 2.5);
        });

        // render 200x200 square of the screen
        renderer.enableScissorTest(true);
        renderer.setScissor(10, 10, 200, 200);
        renderer.setViewport(10, 10, 200, 200);
        renderer.render(scene, hudCamera);
        renderer.enableScissorTest(false);

        // Reset scales.
        scene.children.forEach(function (object) {
            object.scale.set(1, 1, 1);
        });
    };

    var animationLoop = function (callback, requestFrameFunction) {
        requestFrameFunction = requestFrameFunction || requestAnimationFrame;

        var previousFrameTime = window.performance.now();

        // How many seconds the animation has progressed in total.
        var animationSeconds = 0;

        var render = function () {
            var now = window.performance.now();
            var animationDelta = (now - previousFrameTime) / 1000;
            previousFrameTime = now;
            
            animationDelta = Math.min(animationDelta, 1/30);

            // Keep track of how many seconds of animation has passed.
            animationSeconds += animationDelta;

            callback(animationDelta, animationSeconds);

            requestFrameFunction(render);
        };

        requestFrameFunction(render);
    };

    var main = function () {
        // Start Object Manager (It managed other object)
        ObjectManager.Initialize();
        var renderer = ObjectManager.Renderer;
        var scene = ObjectManager.Scene;

        map = createMap(scene);

        // Camera Setting
        var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.up.copy(UP);
        camera.targetPosition = new THREE.Vector3();
        camera.targetLookAt = new THREE.Vector3();
        camera.lookAtPosition = new THREE.Vector3();

        
        var halfWidth = (map.right - map.left) / 2, halfHeight = (map.top - map.bottom) / 2;
        var hudCamera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 1, 100);
        hudCamera.position.copy(new THREE.Vector3(map.centerX, map.centerY, 10));
        hudCamera.lookAt(new THREE.Vector3(map.centerX, map.centerY, 0));


        pacman = new Pacman().Enable();
        pacman.position.copy(map.pacmanSpawn)
        pacman.direction = new THREE.Vector3(-1, 0, 0);


        light = new PlayerLight().Enable();
        
        var ghostSpawnTime = -8;

        // Create life images
        var home = document.getElementById('livehome');
		var ghosthome = document.createElement('img');
		ghosthome.src = 'ghosthouse.png'
		home.appendChild(ghosthome);
        
        // Main game logic
        var update = function (delta, now) {
            ObjectManager.Update(delta, now);

            // Check for win.
            if (!won && nnumSausagesEaten == 4) {
                won = true;
                var finishDialog = document.getElementById('finish-dialog');
                finishDialog.style.display = 'block';
                finishDialog.style.visibility = 'visible';
            }

            updateCamera(delta, now);

            // Spawn a ghost every 8 seconds, up to 4 ghosts.
            if (numSausages + nnumSausagesEaten < 4 && now - ghostSpawnTime > 8) {
                new Sausage().Enable().position.copy(map.ghostSpawn);
                new Item().Enable();
                numSausages += 1;
                ghostSpawnTime = now;
            }
        };

        var updateCamera = function (delta, now) {
            camera.targetPosition.copy(pacman.position).addScaledVector(UP, 1.5).addScaledVector(pacman.direction, -1);
            camera.targetLookAt.copy(pacman.position).add(pacman.direction);

            // Move camera slowly during win/lose animations.
            var cameraSpeed = (won) ? 1 : 10;
            camera.position.lerp(camera.targetPosition, delta * cameraSpeed);
            camera.lookAtPosition.lerp(camera.targetLookAt, delta * cameraSpeed);
            camera.lookAt(camera.lookAtPosition);
        };

        // Main game loop
        animationLoop(function (delta, now) {
            update(delta, now);

            // Render main view
            renderer.setViewport(0, 0, renderer.domElement.width, renderer.domElement.height);
            renderer.render(scene, camera);

            // Render HUD
            renderHud(renderer, hudCamera, scene);
        });
    };

    main();

    var level = getParameters("level");
    if (level == "easy")
        change_value = 3
    else if (level == "normal")
        change_value = 2
    else 
        change_value = 1

    console.log("level" + level + " value:"+ change_value)
}
