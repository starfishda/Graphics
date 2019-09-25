
var gl;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height);
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );    

    //  Load shaders and initialize 
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );

	gl.useProgram( program );   

    // create a buffer on gpu and bind point    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); 

    // Associate out shader variables with our data buffer   	
	// attribute variable
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition );

	// uniform variable
	var fColor = gl.getUniformLocation(program, "fColor");	
	var vScale = gl.getUniformLocation(program, "vScale");	
	var vOffset = gl.getUniformLocation(program, "vOffset");

	// clear buffer bit
    gl.clear( gl.COLOR_BUFFER_BIT );

	//draw rain - random and loop
	for(var i = 0; i < 70; i++)
	{
		draw_rain([Math.random() * 1.9 - 0.15, - Math.random() + 0.15,0,0], fColor, vOffset, vScale, [1,1,1,1]);	
	}

	// vertex
	var all = new Float32Array([
		-1, -0.4, -1, -1, 1, -0.4, 1, -1, // Ground

		-0.6, -0.4, 0.4, -0.4, 0.4, 0.1, -0.6, 0.1, // house + body
		-0.8, 0.1, -0.4, 0.4, -0.1, 0.1,
		-0.1, 0.1, 0.6, 0.1, 0.2 , 0.4,
		-0.4, 0.4, 0.2, 0.4, -0.1, 0.1, // house + roof

		-0.45, -0.4, -0.25, -0.4, -0.3, -1, 
		-0.3, -1, -0.25, -0.4, 0.1, -1,//road

		-0.45, -0.4, -0.3, -1,
		-0.25, -0.4, 0.1, -1 // road outline
		]);

	gl.bufferData(gl.ARRAY_BUFFER, all, gl.STATIC_DRAW );	

	gl.uniform4fv(vScale, [1,1,1,1]);
	gl.uniform4f(fColor,1,0.7,0.7,1);
	gl.uniform4fv(vOffset,[0,0,0,0]);
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 ); // Ground

	gl.uniform4fv(vScale, [1,1,1,1]);
	gl.uniform4f(fColor,1,1,1,0.4);
	gl.uniform4fv(vOffset,[0,0,0,0]);
	gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 ); // house + body

	gl.uniform4fv(vScale, [1,1,1,1]);
	gl.uniform4f(fColor,0.95,0.9,0.5,1);
	gl.uniform4fv(vOffset,[0,0,0,0]);
	gl.drawArrays( gl.TRIANGLES, 8, 9 ); // house + roof

	gl.uniform4fv(vScale, [1,1,1,1]);
	gl.uniform4f(fColor,0.35, 0.25, 0.25, 1);
	gl.uniform4fv(vOffset,[0,0,0,0]);
	gl.drawArrays( gl.TRIANGLES, 17, 6 ); // road

	gl.uniform4fv(vScale, [1,1,1,1]);
	gl.uniform4f(fColor,0, 0, 0, 1);
	gl.uniform4fv(vOffset,[0,0,0,0]);
	gl.drawArrays(gl.LINES, 23, 4); //road outline

	//draw window and door with draw_window function
	draw_window([0,0,0,0], fColor, vOffset, vScale, [1,1,1,1], 0, 0.76, 0.71,0.23, 1);
	draw_window([0,0,0,0], fColor, vOffset, vScale, [1,1,1,1], 4, 0.4, 0.6, 1, 1);
	draw_window([0,0,0,0], fColor, vOffset, vScale, [1,1,1,1], 8, 0.76, 0.71,0.23, 1);
	draw_window([0,0,0,0], fColor, vOffset, vScale, [1,1,1,1], 12, 0, 0,0.2, 1);

	//design roof with roof_line function
	for (var i = 0; i <= 16; i+=2 )
	{
		roof_line([0,0,0,0], fColor, vOffset, vScale, [1,1,1,1], i);
	}

	//draw thunder with scale and position
	thunder([-0.9,0.8,0,0], fColor, vOffset, vScale, [1,1,1.2,1.2], 0);
	thunder([0.8,0.4,0,0], fColor, vOffset, vScale, [1,1.2,1.2,1.2], 0);
	thunder([0.1,1.4,0,0], fColor, vOffset, vScale, [0.7,0.7,1.2,1.2], 0);

	//draw three with scale and position
	draw_tree([1.2,0.5,0,0], fColor, vOffset, vScale, [1.2,2.0,1.2,1.2]);
	draw_tree([1.4,0.2,0,0], fColor, vOffset, vScale, [1,1,1,1]);
	draw_tree([0,0,0,0], fColor, vOffset, vScale, [1,1,1,1]);
	draw_tree([1.1,-0.1,0,0], fColor, vOffset, vScale, [1,1,1,1.2]);
	
};

function thunder(index, fColor, vOffset, vScale, scale, x_index) {
	var all = new Float32Array([
			0 , 0, 0.1, 0, 0.2, 0.2,
			0, 0, 0.2, 0, 0.1, -0.05,
			0.1, -0.05, 0.2, 0, -0.05, -0.35
		]);
	
	gl.bufferData(gl.ARRAY_BUFFER, all, gl.STATIC_DRAW );	
	
	gl.uniform4fv(vScale, scale);
	//gl.uniform4f(fColor,1, 0.9,0, 1);
	gl.uniform4f(fColor,0, 0, 0, 0.7);
	gl.uniform4fv(vOffset, index);
	gl.drawArrays(gl.TRIANGLES, x_index, 9);
}

//square function - window and door and door handle
function draw_window(index, fColor, vOffset, vScale, scale, x_index, color1, color2, color3, color4) {
	var all = new Float32Array([	
			-0.05, 0, 0.25, 0, -0.05, -0.2, 0.25, -0.2, // window outline

			-0.03, -0.02, 0.23, -0.02, -0.03, -0.18, 0.23, -0.18, // window inline

			-0.45,-0.1, -0.25, -0.1, -0.45,-0.4, -0.25, -0.4, // door
			-0.43, -0.26, -0.41, -0.26, -0.43, -0.24, -0.41, -0.24 //door handle
		]);
	
	gl.bufferData(gl.ARRAY_BUFFER, all, gl.STATIC_DRAW );	
	
	gl.uniform4fv(vScale, scale);
	gl.uniform4f(fColor, color1, color2, color3, color4);
	gl.uniform4fv(vOffset,index);
	gl.drawArrays( gl.TRIANGLE_STRIP, x_index, 4 );
}

//line function - house version
function roof_line(index, fColor, vOffset, vScale, scale, x_index) {
	var all = new Float32Array([
			-0.5, 0.1, -0.6 , 0.25, // roof line
			-0.2, 0.1, -0.4 , 0.4,
			0.1, 0.1 , -0.1 , 0.4,
			0.4, 0.1, 0.2, 0.4,
			-0.5, 0.1, -0.1, 0.4,
			-0.2, 0.1, 0.2, 0.4,
			0.1, 0.1, 0.35, 0.29,

			-0.05, -0.1, 0.25, -0.1, //window line
			0.1, 0 , 0.1, -0.2
		]);
	
	gl.bufferData(gl.ARRAY_BUFFER, all, gl.STATIC_DRAW );	
	
	gl.uniform4fv(vScale, scale);
	gl.uniform4f(fColor,0.76, 0.71,0.23, 1);
	gl.uniform4fv(vOffset,index);
	gl.drawArrays(gl.LINES, x_index, 2);
}

//line function - rain version
function draw_rain(index, fColor, vOffset, vScale, scale) {
	var all = new Float32Array([
			-0.8, 0.8, -0.8, 0.6
		]);

	gl.bufferData(gl.ARRAY_BUFFER, all, gl.STATIC_DRAW );	
	
	gl.uniform4fv(vScale, scale);
	gl.uniform4f(fColor,0.35,0.5,1,1);
	gl.uniform4fv(vOffset,index);
	gl.drawArrays(gl.LINES, 0, 2);
}

//tree function - tree leaf and node
function draw_tree(index, fColor, vOffset, vScale, scale) {
	var all = new Float32Array([
		-0.8, -0.6, -0.8, -0.85, -0.6, -0.6, -0.6, - 0.85, //tree node
		-0.95, -0.6, -0.45, -0.6, -0.7, -0.4, //tree leaf
		-0.95, -0.45, -0.45, -0.45, -0.7, -0.2 //tree leaf
		]);

	gl.bufferData(gl.ARRAY_BUFFER, all, gl.STATIC_DRAW );	
	
	gl.uniform4fv(vScale, scale);
	gl.uniform4fv(vOffset,index);
	gl.uniform4f(fColor, 0.5, 0.3, 0, 1);
	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 ); // node

	gl.uniform4fv(vScale, scale);
	gl.uniform4fv(vOffset,index);
	gl.uniform4f(fColor, 0.1, 0.6, 0.1, 1);
	gl.drawArrays( gl.TRIANGLES, 4, 6 ); // leaf
}
