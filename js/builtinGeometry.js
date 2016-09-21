// Globális változók
var WIDTH, HEIGHT, aspectRatio;
var renderer;
var scene, camera;
var controls;
// Creating some basic object
var Model = function (model, material, mesh) {
    this.model = model || {};
    this.material = material || {};
    this.mesh = mesh || {};
}


/**
 * Will set everything up which needed for creating any basic geometry
 *
 * @param  {String} type            Could be box, sphere or cone
 * @param  {Array} dimensionArray   Size of the model
 * @param  {Object=} wireframe      Optional parameter to define material
 * @return {Object}                 A new Model object
 */
var BasicGeometry = function (type, dimensionArray, wireframe) {
    var object = {};
    this._type = type || 'box';
    this._wireframe = wireframe || false;
    this._dimensionArray = dimensionArray || [5, 5, 5];

    switch (this._type.toLowerCase()) {
        case 'plane':
            object.model = new THREE.PlaneGeometry(
                this._dimensionArray[0],
                this._dimensionArray[1]
             );
            break;
        case 'sphere':
            object.model = new THREE.SphereGeometry(
                this._dimensionArray[0],
                this._dimensionArray[1],
                this._dimensionArray[2]
             );
            break;
        case 'cone':
            object.model = new THREE.ConeGeometry(
                this._dimensionArray[0],
                this._dimensionArray[1],
                this._dimensionArray[2]
            );
            break;
        default:
            object.model = new THREE.BoxGeometry(
                this._dimensionArray[0],
                this._dimensionArray[1],
                this._dimensionArray[2]
            );
    }

    if (this._wireframe) {
        object.material = new THREE.MeshBasicMaterial(
            this._wireframe
        );
    } else {
        object.material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
    }


    object.mesh = new THREE.Mesh( object.model, object.material );

    return new Model(
        object.model,
        object.material,
        object.mesh
    );
}


function init() {
    // Böngésző ablakméret lekérése és méretarány számítása
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    aspectRatio = WIDTH / HEIGHT;

    // Renderer létrehozása és DOM-hoz adása
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( WIDTH, HEIGHT );
    renderer.setClearColor( 0x000000 );
    document.body.appendChild( renderer.domElement );

    // Színtér létrehozása
    scene = new THREE.Scene();

    // Kamera létrehozása és vetítési paramétereinek beállítása
    camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 1000 );
    camera.position.set( 0, 10, 20 );
    camera.lookAt( scene.position );

    // Objektumok létrehozása

    // Talaj
    var ground = new BasicGeometry(
        'plane',
        [30, 30],
        {
            color: 0x008000,
            wireframe: false,
            side: THREE.DoubleSide
        }
    );
    ground.mesh.rotation.x = -1.0 * THREE.Math.degToRad( 90 );
    scene.add( ground.mesh );

    // Box
    var box = new BasicGeometry('box', [6, 6, 6]);
    box.mesh.position.set(-7, 3, -5);
    scene.add(box.mesh);
    // Sphere
    var sphere = new BasicGeometry(
        'sphere',
        [16, 16, 16],
        {
            color: 0x257cc7,
            wireframe: true
        }
    );
    sphere.mesh.scale.set(0.2, 0.2, 0.2);
    sphere.mesh.position.set(2, 3.2, 2);
    scene.add(sphere.mesh);
    // Cone, rotated 180 degree
    var cone = new BasicGeometry(
        'cone',
        [10, 10, 10],
        {
            color: 0xefea63,
            wireframe: true
        }
    );
    cone.mesh.rotation.x += (180 * Math.PI / 180);
    cone.mesh.scale.set(0.5, 0.5, 0.5);
    cone.mesh.position.set(10, 2.5, 10);
    scene.add( cone.mesh );



    // Az ablak későbbi átméretezése esetén visszahívható függvény megadása
    window.addEventListener( 'resize', handleWindowResize, false );

    // Kamera vezérlés
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 5.0;
    controls.panSpeed = 1.0;

    // Első képkocka rajzolása
    render();
}

function handleWindowResize() {
    // Az ablak átméretezése esetén a kamera vetítési paraméterek újraszámolása
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    console.log( 'WIDTH=' + WIDTH + '; HEIGHT=' + HEIGHT );
    renderer.setSize( WIDTH, HEIGHT );
    aspectRatio = WIDTH / HEIGHT;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
}

var render = function () {
    // Újabb képkocka rajzolásának kérése.
    // Maximálisan 60 FPS-t biztosít a rendszer.
    requestAnimationFrame( render );

    // Kamera vezérlés
    controls.update();

    // 3D -> 2D vetített kép kiszámítása.
    // scene 3D színtér képe a camera kamera szemszögéből.
    renderer.render( scene, camera );
};
