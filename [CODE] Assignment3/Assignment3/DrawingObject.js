
//  This is a abstract class, designed to make it easy to draw images.
class DrawingObject {
    // Object list that requested to be deleted during the update().
    static disposelist = [];

    // All Object (drawable)
    static Object = [];

    // This is necessary to integrate the vertices of each object. (integrate -> send gl at first)
    static vertices = [];
    static colors = [];

    // This is the starting point of range for vertices each class can access.
    static vertexStartIndex;
    static colorStartIndex;

    // rander request
    static drawlist = [];

    offsetcolor = vec4(1, 1, 1, 1);
    z = 0; // If this has big z, display front.
    rotation = 0; // It have 0~360 of range
    outline = false;
    first_start = true; // It is used to execute Start() before Update().
    click_area_scale = vec2(1, 1); // It don't change (drawing)scale, but click_area changed.(+-)
    scale = vec2(1, 1);
    disposed = false; // If this is disposed object, this value change true.
    static bottom = 0;

    // Create a new instance.
    static Instance(classtype, position = vec2(1, 1), scale = vec2(1, 1)) {
        var instance = new classtype();
        instance.position = position;
        instance.scale = scale;

        // Make the static value accessible to each instance.
        instance.prototype = classtype;

        // Include that object in the next rendering.
        DrawingObject.Object.push(instance);

        return instance;
    }

    // Must Implement in sub class
    static GetVertex(arrayPointer) {
    }

    // Must Implement in sub class
    static GetColor(arrayPointer) {
    }

    // Must Implement in sub class
    static GetDraw() {
    }

    // Must Implement in sub class (It sub class had been to implement this function, 'GetVertex' and 'GetColor' don't used)
    static GetVertexColor(arrayPointer) {
        return false;
    }

    // If each object need to change color, It is useful.
    ColorUpdate(colors) {
        return false;
    }

    static DrawCycle(VertexColor, ox, oy, r, m_color, out_color, count = 362) {
        VertexColor.push(vec2(ox, oy), m_color);
        count -= 1;
        // From circle, move the angle 60 degrees to get the x, y. And add them to the array of vertexs.
        for (var i = 0; i < count; i++) {
            var agree = i * (360 / (count - 1));
            var vx = Math.cos(agree * Math.PI / 180.0) * r + ox;
            var vy = Math.sin(agree * Math.PI / 180.0) * r + oy;
            VertexColor.push(vec2(vx, vy), out_color);
        }
    }

    static Init(ClassName) {
        // Each class first executes this function.

        var v = []; // arrayPointer
        var c = []; // arrayPointer
        var vc = []; // arrayPointer
        var ImplementGetVertexColor = ClassName.GetVertexColor(vc);
        if (ImplementGetVertexColor === false) {
            // Load the vertex of that class.
            ClassName.GetVertex(v);
            ClassName.GetColor(c);
        } else {
            for (var i = 0; i < vc.length; i += 2) {
                v.push(vc[i]);
                c.push(vc[i + 1]);
            }
        }

        // Setting Vertex Range to this class(not super class)
        ClassName.VertexStart = DrawingObject.vertices.length;
        ClassName.ColorStart = DrawingObject.colors.length;

        // Add vertex to super class
        DrawingObject.vertices = DrawingObject.vertices.concat(v);
        DrawingObject.colors = DrawingObject.colors.concat(c);

        var d = [];
        ClassName.GetDraw(d);
        ClassName.drawlist = d;

        for (var i = 0; i < v.length; i++) {
            if (ClassName.bottom < v[i][1]) {
                ClassName.bottom = v[i][1];
            }
        }
        console.log(ClassName.bottom);
    }

    Dispose() {
        if (!this.disposed) {
            this.disposed = true;
            DrawingObject.disposelist.push(this);
        }
    }

    GraphicUpdate() {
        if (this.first_start) {
            this.first_start = false;
            this.Start();
        }
        // Run the Update statement for each object. (It can modify X, Y, Z, ,Scale ,etc...)
        this.Update();

        // Check Mouse Over
        if (this.CheckIncluded(mouse.position[0], mouse.position[1])) {

            this.onMouseOver();
            if (mouse.clicked == true)
                this.onMousePress();
        }
        // Setting uniform by using each object value
        gl.uniform4f(gl.offset, this.position[0], this.position[1], 0, 0);
        gl.uniform4f(gl.scale, this.scale[0], this.scale[1], 0, 0);
        gl.uniform4fv(gl.offsetcolor, this.offsetcolor);

        gl.uniform1f(gl.rotation, this.rotation * Math.PI / 180.0);

        // If this object implemented 'ColorUpdate' function, Updated buffer on frame.
        var color_list = [];
        var color_list_ok = this.ColorUpdate(color_list);
        if (color_list_ok !== false) {
            var new_color = [];
            // Add dummy data for matching the vertex buffer's index
            for (var i = 0; i < this.prototype.VertexStart; i++) {
                new_color.push(vec4(0, 0, 0, 0));
            }
            new_color = new_color.concat(color_list);
            gl.changeBuffer("vCustomColor", new_color, 4);
            gl.uniform1f(gl.useCustomColor, 1);
        }
        else
            gl.uniform1f(gl.useCustomColor, 0);

        if (this.outline == true) {
            // Save offsetcolor to temp.
            var temp = this.offsetcolor;

            // Black Color
            this.offsetcolor = vec4(0, 0, 0, 1);
            gl.uniform4fv(gl.offsetcolor, this.offsetcolor);
            for (var x = -1; x <= 1; x++) {
                for (var y = -1; y <= 1; y++) {
                    gl.uniform4f(gl.outlineOffset, x, y, 0, 0);
                    // Draw
                    var drawlist = this.prototype.drawlist;
                    for (var i = 0; i < drawlist.length; i++) {
                        var now = drawlist[i];
                        gl.drawArrays(now[0], now[1] + this.prototype.VertexStart, now[2]);
                    }
                }
            }

            // Reset outlineOffset, offsetColor
            gl.uniform4f(gl.outlineOffset, 0, 0, 0, 0);
            this.offsetcolor = temp;
            gl.uniform4fv(gl.offsetcolor, this.offsetcolor);
        }
        // Draw
        var drawlist = this.prototype.drawlist;
        for (var i = 0; i < drawlist.length; i++) {
            var now = drawlist[i];
            gl.drawArrays(now[0], now[1] + this.prototype.VertexStart, now[2]);
        }
    }

    Move(vector, mul = 1) {
        this.position = vec2(this.position[0] + vector[0] * mul, this.position[1] + vector[1] * mul);
    }

    CheckIncluded(mx, my) {
        var x1 = this.position[0] - 500 * this.scale[0] * this.click_area_scale[0];
        var x2 = this.position[0] + 500 * this.scale[0] * this.click_area_scale[0];
        var y1 = this.position[1] - 500 * this.scale[1] * this.click_area_scale[1];
        var y2 = this.position[1] + 500 * this.scale[1] * this.click_area_scale[1];
        return x1 <= mx && x2 >= mx && y1 <= my && y2 >= my;
    }

    // abstract functions..
    Start() {
    }

    Update() {
    }

    onMouseClick() {
    }

    onMousePress() {
    }

    onMouseOver() {
    }

    onMouseUp() {
    }
}
function DrawingSetup() {
    // Merge Vertex
    DrawingObject.Init(Sky); // Sky를 가장 위에 두는게 CPU 부하 작음 (ColorUpdate 함수 호출시)
    DrawingObject.Init(Ground);
    DrawingObject.Init(Wall);
    DrawingObject.Init(Bush);
    DrawingObject.Init(Fruit);
    DrawingObject.Init(Star);
    DrawingObject.Init(StreetLamp);
    DrawingObject.Init(LampLight);
    DrawingObject.Init(StarEffect);
    DrawingObject.Init(Line);
    DrawingObject.Init(Cloud);
    DrawingObject.Init(Light);
    DrawingObject.Init(StarMouse);
	DrawingObject.Init(Animal);
    DrawingObject.Init(Box);
    DrawingObject.Init(SmallBox);

    // Create first object.
    DrawingObject.Instance(Ground, vec2(500, 900), vec2(1, 1));
    DrawingObject.Instance(Wall, vec2(500, 500), vec2(1, 1));
	DrawingObject.Instance(Animal, vec2(197, 162), vec2(0.12, 0.12));
    DrawingObject.Instance(LampLight, vec2(500, 500), vec2(1, 1));
    DrawingObject.Instance(StreetLamp, vec2(500, 500), vec2(1, 1));
    DrawingObject.Instance(Sky, vec2(500, 500), vec2(1, 1));
    DrawingObject.Instance(Light, vec2(1000, 0), vec2(1, 1));
    var bush_x = 0;
    for (var i = 0; i < 80; i++) {
        var j = 50;
        bush_x = bush_x + j;
        var y = Math.random();
        DrawingObject.Instance(Bush, vec2(bush_x, y * 140 + 395), vec2(0.9, 0.9));
        if (bush_x >= 1000) {
            bush_x = -50;
            j = j + 25
        }
    }

    var fruit_x = 0
    for (var i = 0; i < 25; i++) {
        //var x = Math.random();
        var j = 50;
        fruit_x = fruit_x + j;
        var y = Math.random();
        DrawingObject.Instance(Fruit, vec2(fruit_x, y * 110 + 395), vec2(0.1, 0.1));
        if (fruit_x >= 1000) {
            fruit_x = -50;
            j = j + 25
        }
    }
}
