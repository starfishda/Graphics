
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // Four Vertices
    
    var vertices = [
        vec2(-0.66, 0), //v0
        vec2(0,0), //v1
        vec2(-0.33, -0.57), //v2

		vec2(-0.33, -0.57), //v0
        vec2(0,0), //v1
        vec2(0.33, -0.57), //v2

		vec2(0.33, -0.57), //v0
        vec2(0,0), //v1
        vec2(0.66, 0), //v2

		vec2(0.66, 0), //v0
        vec2(0,0), //v1
        vec2(0.33, 0.57), //v2

		vec2(0.33, 0.57), //v0
        vec2(0,0), //v1
        vec2(-0.33, 0.57), //v2

		vec2(-0.33, 0.57), //v0
        vec2(0,0), //v1
        vec2(-0.66, 0), //v2
    ];

	var colors = [
		vec4( 0.0,1.0,1.0,1), // GB
        vec4( 1.0,1.0,1.0,1),
        vec4( 0.0,0.0,1.0,1),  // B

		vec4( 0.0,0.0,1.0,1), // B
        vec4( 1.0,1.0,1.0,1),
        vec4( 1.0,0.0,1.0,1), //RB

		vec4( 1.0,0.0,1.0,1), //RB
        vec4( 1.0,1.0,1.0,1),
        vec4( 1.0,0.0,0.0,1), // R

		vec4( 1.0,0.0,0.0,1), // R
        vec4( 1.0,1.0,1.0,1),
        vec4( 1.0,1.0,0.0,1), // Y

		vec4( 1.0,1.0,0.0,1), // Y
        vec4( 1.0,1.0,1.0,1),
        vec4( 0.0,1.0,0.0,1), // G

		vec4( 0.0,1.0,0.0,1), // G
        vec4( 1.0,1.0,1.0,1),
        vec4( 0.0,1.0,1.0,1), // GB
	];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var vertexPositionBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexPositionBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


	var vertexColorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexColorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 18 );
}
