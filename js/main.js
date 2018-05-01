var container;
var camera, scene, renderer, controls;
var line;
var point_1 = new Point(0, 0, 0);
var point_2 = new Point(10, -7, 10);

window.onload = function () {
    init();
    animate();
    init_gui();
};

function init() {
    init_renderer();
    init_scene();
    init_camera();
    init_controls();
    init_light();
    init_miscellaneous();

    line = draw_line(point_1, point_2);
    scene.add(line);
}

function init_renderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function init_scene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    scene.remove(line);
    line = draw_line(point_1, point_2);
    scene.add(line);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function init_camera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(50, 50, 50);
}

function init_controls() {
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.minDistance = 50;
    controls.maxDistance = 500;
}


function init_light() {
    scene.add(new THREE.AmbientLight(0x222222));
    var light = new THREE.PointLight(0xffffff);
    light.position.set(100, 200, 500);
    scene.add(light);
}


function init_miscellaneous() {
    window.addEventListener('resize', onWindowResize, false);
    var axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

}

function draw_line(point1, point2) {
    var group = new THREE.Group();
    var mesh;
    var x1 = point1.x, y1 = point1.y, z1 = point1.z;
    var x2 = point2.x, y2 = point2.y, z2 = point2.z;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dz = z2 - z1;
    var x_inc = (dx < 0) ? -1 : 1;
    var l = Math.abs(dx);
    var y_inc = (dy < 0) ? -1 : 1;
    var m = Math.abs(dy);
    var z_inc = (dz < 0) ? -1 : 1;
    var n = Math.abs(dz);
    var dx2 = l * 2;
    var dy2 = m * 2;
    var dz2 = n * 2;

    var x = x1, y = y1, z = z1;

    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var material = new THREE.MeshNormalMaterial();

    if ((l >= m) && (l >= n)) {
        var err_1 = dy2 - l;
        var err_2 = dz2 - l;
        for (var i = 0; i < l; i++) {
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.position.z = z;
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
            group.add(mesh);
            if (err_1 > 0) {
                y += y_inc;
                err_1 -= dx2;
            }
            if (err_2 > 0) {
                z += z_inc;
                err_2 -= dx2;
            }
            err_1 += dy2;
            err_2 += dz2;
            x += x_inc;
        }
    } else if ((m >= l) && (m >= n)) {
        err_1 = dx2 - m;
        err_2 = dz2 - m;
        for (i = 0; i < m; i++) {
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.position.z = z;
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
            group.add(mesh);
            if (err_1 > 0) {
                x += x_inc;
                err_1 -= dy2;
            }
            if (err_2 > 0) {
                z += z_inc;
                err_2 -= dy2;
            }
            err_1 += dx2;
            err_2 += dz2;
            y += y_inc;
        }
    } else {
        err_1 = dy2 - n;
        err_2 = dx2 - n;
        for (i = 0; i < n; i++) {
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.position.z = z;
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
            group.add(mesh);
            if (err_1 > 0) {
                y += y_inc;
                err_1 -= dz2;
            }
            if (err_2 > 0) {
                x += x_inc;
                err_2 -= dz2;
            }
            err_1 += dy2;
            err_2 += dx2;
            z += z_inc;
        }
    }
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    group.add(mesh);
    return group;
}


function Point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function init_gui() {
    var gui = new dat.GUI();
    var folder_point_1 = gui.addFolder('Point 1');
    var folder_point_2 = gui.addFolder('Point 2');
    folder_point_1.add(point_1, "x");
    folder_point_1.add(point_1, "y");
    folder_point_1.add(point_1, "z");
    folder_point_2.add(point_2, "x");
    folder_point_2.add(point_2, "y");
    folder_point_2.add(point_2, "z");
}

