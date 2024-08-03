
// Set up scene (see SimpleScene tutorial)

import * as THREE from 'three';
import * as OBC from 'openbim-components';
import * as WEBIFC from 'web-ifc';
// import Stats from 'stats.js/src/Stats.js';
// import * as dat from 'three/examples/jsm/libs/lil-gui.module.min';
// import { downloadZip } from 'client-zip';

var ifcModel = null;
var guidMap = {};



const container = document.getElementById('container');

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.PostproductionRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

components.renderer.postproduction.enabled = true;

const scene = components.scene.get();

components.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

components.scene.setup();

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const customEffects = components.renderer.postproduction.customEffects;
customEffects.excludedMeshes.push(grid.get());

let fragments = new OBC.FragmentManager(components);
let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

const highlighter = new OBC.FragmentHighlighter(components, fragments);



await fragmentIfcLoader.setup()


const excludedCats = [
    WEBIFC.IFCTENDONANCHOR,
    WEBIFC.IFCREINFORCINGBAR,
    WEBIFC.IFCREINFORCINGELEMENT,
];

for (const cat of excludedCats) {
    fragmentIfcLoader.settings.excludedCategories.add(cat);
}


fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

/*MD
### 🚗🔥 Loading the IFC
___
Next, let's define a function to load the IFC programmatically.
We have hardcoded the path to one of our IFC files, but feel free
to do this with any of your own files!

:::info Opening local IFCs */

async function loadIfcAsFragments() {
    // remove
    await disposeFragments();
    const filePath = "/static/ifc_data/file.ifc"
    console.log(filePath)
    const file = await fetch(filePath);
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer, "example");
    scene.add(model);
}

async function loadIfcProject(data, fileText) {
    // remove
    await disposeFragments();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer, "example");

    // Samuel: Create guid - id map
    const props = ifcModel._properties
    var modelViewData = {}

    Object.keys(props).forEach(function (key) {

        const values = props[key]
        if ("GlobalId" in values) {
            const id = Number(key);
            const guid = values.GlobalId.value;
            
            for (const fragment of ifcModel.items) {
                if (fragment.ids.has(id)) {
                    modelViewData[guid] = {}
                    modelViewData[guid]["MeshVertices"] = fragment.mesh.geometry.attributes.position.array;
                    modelViewData[guid]["MeshIndices"] = fragment.mesh.geometry.index.array; 
                }
            }

        }

        // 
    });

    modelViewData["fileText"] = fileText;
    // sendData(modelViewData)

    return JSON.stringify(modelViewData);

}
window.loadIfcProject = loadIfcProject

function sendData(data) {
    // Die zu sendenden Daten

    // AJAX-Anfrage mit Fetch API
    fetch('/upload', {
      method: 'POST', // HTTP-Methode
      headers: {
        'Content-Type': 'application/json', // Inhaltstyp der Anfrage
      },
      body: JSON.stringify(data), // Die Daten als JSON-String
    })
      .then(response => response.json()) // Die Antwort als JSON verarbeiten
      .then(data => {
        // console.log('Success:', data); // Erfolgsmeldung in der Konsole
      })
      .catch((error) => {
        // console.error('Error:', error); // Fehlermeldung in der Konsole
      });
  }

/*

Keep in mind that the browser can't access the file of your
computer directly, so you will need to use the Open File API to
open local files.

/*MD
 ### 🧠🧼 Cleaning memory
 ___
 Now, just like in the `FragmentManager` tutorial, you will need
 to dispose the memory if your user wants to reset the state of the
 scene, especially if you are using Single Page Application
 technologies like React, Angular, Vue, etc. To do that, you
 can simply call the `dispose` method:
*/

function disposeFragments() {
    fragments.dispose();
}


// Set up stats
const renderer = components.renderer;

const highlightMaterial = new THREE.MeshBasicMaterial({
    color: '#247df1',
    depthTest: false,
    opacity: 1,
    transparent: true
});

highlighter.add('default', highlightMaterial);
highlighter.outlineMaterial.color.set(0x247df1);

let lastSelection;

let singleSelection = {
    value: true,
};


function get_guid_from_id(ifcModel, id) {
    return ifcModel._properties[id].GlobalId.value;
}

function get_id_from_guid(ifcModel, guid) {
    return Number(guidMap[guid].id);
}
function get_fragid_from_guid(ifcModel, guid) {
    if (guid in guidMap) {
        return guidMap[guid].fragid;
    }
    else {
        return null;
    }
}

async function highlightFromGuid(guid) {
    var fragid = get_fragid_from_guid(ifcModel, guid);
    if (fragid == null) return;
    var id = get_id_from_guid(ifcModel, guid);
    const ids = {}
    ids[fragid] = [id];
    const result = await highlighter.highlightByID('default', ids, false);

}
async function highlightFromMultGuids(guids) {

    const ids = {}
    for (let i = 0; i < guids.length; i++) {
        var guid = guids[i];
        var fragid = get_fragid_from_guid(ifcModel, guid);
        if (fragid == null) continue;
        var id = get_id_from_guid(ifcModel, guid);
        if (fragid in ids) {
            ids[fragid].push(id)
        }
        else {
            ids[fragid] = [id];
        }

    }
    const result = await highlighter.highlightByID('default', ids, true);

}

function highlightFromGuids(guids) {
    highlightFromMultGuids(guids)
}

// Die Funktion dem globalen `window`-Objekt hinzufügen, um sie global verfügbar zu machen
window.highlightFromGuids = highlightFromGuids;


async function highlightOnClick(event) {

    const result = await highlighter.highlight('default', singleSelection.value);
    if (result) {
        lastSelection = {};
        for (const fragment of result.fragments) {
            const fragmentID = fragment.id;
            lastSelection[fragmentID] = [result.id];

            // Samuel: get guID of element:
            var guid = get_guid_from_id(ifcModel, result.id)
            console.log(guid)
            var id = get_id_from_guid(ifcModel, guid)


            update_main([guid]);

            // vertices ausprinten:
            // console.log(fragment.mesh.geometry.attributes.position.array)

            // indices ausprinten:
            // console.log(fragment.mesh.geometry.index.array)
        }
    }
    else
    {
        update_main();   
    }
}

// container.addEventListener('click', (event) => highlightOnClick(event));

// const gui = new dat.GUI();

// gui.add(settings, 'loadFragments').name('Import fragments');
// gui.add(settings, 'exportFragments').name('Export fragments');
// gui.add(settings, 'disposeFragments').name('Dispose fragments');

// For debugging

fragmentIfcLoader.onIfcLoaded.add((model) => {

    console.log(model);

    ifcModel = model;

    // Samuel: Create guid - id map
    const props = ifcModel._properties
    Object.keys(props).forEach(function (key) {

        const values = props[key]
        if ("GlobalId" in values) {
            const id = Number(key);
            const guid = values.GlobalId.value;
            // console.log(key, guid);
            guidMap[guid] = {};
            guidMap[guid]["id"] = key;

            for (const fragment of ifcModel.items) {
                if (fragment.ids.has(id)) {
                    guidMap[guid]["fragid"] = fragment.id;
                    break;
                }
            }

        }

        // 
    });


    // Samuel: Hier stecken Infos zu Elementen, z.B. global ID
    console.log(model._properties);

    highlighter.updateHighlight();
    components.renderer.postproduction.customEffects.outlineEnabled = true;
    highlighter.outlinesEnabled = true;

});

// console.log(main_data["states"].length)
loadIfcAsFragments()
