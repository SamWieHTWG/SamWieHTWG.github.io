function get_min_max_all(data) {

  var maxAll = [0,0,0];
  var minAll = [0,0,0];
  for (let i = 0; i < Object.keys(data).length; i++) {

    var el = data[i];
    if (!el.vertices) {
      continue;
    }
    var max = el.max;
    var min = el.min;
    if(maxAll[0]<max[0]) maxAll[0] = max[0];
    if(maxAll[1]<max[1]) maxAll[1] = max[1];
    if(maxAll[2]<max[2]) maxAll[2] = max[2];
    if(minAll[0]>min[0]) minAll[0] = min[0];
    if(minAll[1]>min[1]) minAll[1] = min[1];
    if(minAll[2]>min[2]) minAll[2] = min[2];
  }

  return maxAll, minAll;
}

const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 50; // nach rechts
camera.position.y = 50; // nach oben
camera.position.z = 50; // nach hinten
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setSize(container.clientWidth, container.clientHeight);
// Setzen Sie die Hintergrundfarbe
renderer.setClearColor(0xcccccc);
container.appendChild(renderer.domElement);

var mouse = new THREE.Vector2();


renderer.render(scene, camera);
const grid = new THREE.InfiniteGridHelper(10, 100);
scene.add(grid);
renderer.render(scene, camera);

scene.add(new THREE.AmbientLight(0x222222));

renderer.render(scene, camera);

// OrbitControls hinzufügen
var controls = new THREE.OrbitControls(camera, renderer.domElement);
// var controls = new TrackballControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional: Für weicheres Dämpfungsverhalten
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.enableZoom = true;

var minmaxAll = get_min_max_all(meshJson);

main_data["colors"] = {}
main_data["viewChanged"] = {}
for (let i = 0; i < Object.keys(meshJson).length; i++) {

  if (!meshJson[i].vertices) {
    continue;
  }
  var id = meshJson[i].id;
  // Erstelle ein Three.js Mesh aus dem JSON
  const geometry_ = new THREE.BufferGeometry();
  var verts = meshJson[i].vertices.flat();
  if (verts.length == 0) continue;
  const vertices_ = new Float32Array(verts);
  var facs = meshJson[i].faces.flat();
  const faces_ = facs;
  geometry_.setIndex(faces_);
  geometry_.setAttribute('position', new THREE.BufferAttribute(vertices_, 3));

  // Erstelle ein WireframeGeometry aus deiner Geometrie
  var wireframe = new THREE.EdgesGeometry(geometry_);
  //  const material = new THREE.MeshBasicMaterial({ color: 0xFF0000});
  meshJson[i].color = '0x9c9c9c'
  var c = meshJson[i].color
  var o = meshJson[i].opacity
  main_data["colors"][meshJson[i].id] =  parseInt(c.replace('0x', ''), 16);
  var material1 = new THREE.MeshBasicMaterial({ color: parseInt(c.replace('0x', ''), 16), transparent: true, opacity: OPACITY });
  const cube = new THREE.Mesh(geometry_, material1);
  cube.rotation.x = -1 * Math.PI / 2;
  scene.add(cube)
  var material2 = new THREE.MeshBasicMaterial({ color: 0x333333 });
  cube.name = meshJson[i].id
  var line = new THREE.LineSegments(wireframe, material2);
  line.rotation.x = -1 * Math.PI / 2;
  scene.add(line);

  main_data["viewChanged"][id] = false

}

function onMouseClickThree(event) {

  console.time('Raycast')

  const rect = renderer.domElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  mouse.x = (x / rect.width) * 2 - 1;
  mouse.y = (y / rect.height) * - 2 + 1

  // Initialisiere den Raycaster und den Mausvektor
  var raycaster = new THREE.Raycaster();

  // Aktualisiere den Raycaster mit der Kamera und der Mausposition
  raycaster.setFromCamera(mouse, camera);

  // Führe den Raycast aus und erhalte die getroffenen Objekte
  var intersects = raycaster.intersectObjects(scene.children);

  var state_changed = false
  var intersections_ids = []
  // Verarbeite alle getroffenen Objekte
  for (var i = 0; i < intersects.length; i++) {
    var obj = intersects[i].object;
    // Zum Beispiel: Ändere die Farbe des getroffenen Objekts
    if (intersects[i].object.type == 'Mesh') {
      c = intersects[i].object.material.color
      if (!c) {
        continue;
      }

      state_changed = true
      intersections_ids.push(obj.name)
      // var jsonEl = get_json_el_from_id(obj.name, elements)
      // var meshEl = get_json_el_from_id(obj.name, meshJson)
      // jsonEl.changed = true;
      // if (jsonEl.is_selected) {
      //   var orig_color = meshEl.color
      //   // intersects[i].object.material.color.set(parseInt(orig_color.replace('0x', ''), 16));
      //   jsonEl.is_selected = 0

      // }
      // else {
      //   // intersects[i].object.material.color.set(0xff0000);
      //   jsonEl.is_selected = 1
      //   scroll_to_node(obj.name)
      // }
      break;
    }
  }

  console.timeEnd('Raycast')

  if (state_changed) {
    update_main(intersections_ids = intersections_ids);
  }
  else {
    update_main(null, null, null)
  }
}

// Füge den Event-Listener hinzu
container.addEventListener('click', onMouseClick, false);


function animate() {
  // update_main();
  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  renderer.render(scene, camera);
}

animate();


function get_scene_object_from_id(id) {
  var scene_obj = null
  // Iterieren über die direkt der Szene untergeordneten Objekte
  for (let i = 0; i < scene.children.length; i++) {
    const obj = scene.children[i];
    if (obj.name == id) {
      scene_obj = obj;
      break;
    }
  }
  return scene_obj;
}

function updateSceneByIds(ids) {
  var scene_obj = null
  var elementSelected = ids.length

  console.time('ViewSub')

  // Iterieren über die direkt der Szene untergeordneten Objekte
  for (let i = 0; i < scene.children.length; i++) {
    const obj = scene.children[i];

    if (obj) {

      if (!("name" in obj)) continue;

      var id = obj.name;
      if (id.length != 22) continue; // no guid

      var scene_obj = obj;

      if (ids.includes(id)) {
        scene_obj.material.color.set(0xff0000);
        scene_obj.material.opacity = 0.7;
      }
      else {
        console.time('getJsonEl')
        // var meshEl = get_json_el_from_id(id, meshJson)
        // var c = parseInt(meshEl.color.replace('0x', ''), 16);
        var c = main_data["colors"][id]
        console.timeEnd('getJsonEl')    
        console.time('adaption')
        if (!elementSelected) {
          scene_obj.material.color.set(c);
          scene_obj.material.opacity = OPACITY;
        }
        else {
          scene_obj.material.opacity = OPACITY * 0.5;
          scene_obj.material.color.set(0xc5c9c6);
        }
        console.timeEnd('adaption')
      }
    }
  }
  renderer.render(scene, camera);
  console.timeEnd('ViewSub')
}