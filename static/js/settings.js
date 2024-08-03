function updateMaterialCosts(materialData) {
  const treeData = materialData.nodes;
  let nestedTableData = materialData.table;
  const generalMaterials = materialData.general;

  // create cost / co2 map
  const valMap = {
    cost: {},
    co2: {},
  };

  for (const mat in generalMaterials) {
    const cost = generalMaterials[mat].Costs;
    const co2 = generalMaterials[mat]["CO2[t]"];
    valMap.cost[mat] = cost;
    valMap.co2[mat] = co2;
    for (const subEl of generalMaterials[mat].Materials) {
      valMap.cost[subEl] = cost;
      valMap.co2[subEl] = co2;
    }
  }

  function subVals(el) {
    let subCostAll = 0;
    let subCO2All = 0;

    // redefine values:
    const material = el.Material;
    if (material in valMap.cost) {
      el["Preis[€/m³]"] = valMap.cost[material];
    }
    if (material in valMap.co2) {
      el["CO2[t/m³]"] = valMap.co2[material];
    }

    if (el._children) {
      for (const subEl of el._children) {
        const [subCost, subCO2] = subVals(subEl);
        subCostAll += subCost;
        subCO2All += subCO2;
      }
      el["Kosten[€]"] = subCostAll;
      el["CO2[t]"] = subCO2All;
    } else {
      el["Kosten[€]"] = el["Volumen[m³]"] * el["Preis[€/m³]"];
      el["CO2[t]"] = el["Volumen[m³]"] * el["CO2[t/m³]"];
    }

    return [el["Kosten[€]"], el["CO2[t]"]];
  }

  for (const el of nestedTableData) {
    subVals(el);
  }

  // You might need to return or process nestedTableData as needed
}

// JavaScript function to add an input field with dynamic attributes
function addInputField(id, labelText, placeholder, rowElement) {
  // Create a new input element
  const newInput = document.createElement("input");

  // Set attributes for the new input
  newInput.setAttribute("type", "text");
  newInput.setAttribute("class", "form-control");
  newInput.setAttribute("id", id);
  newInput.setAttribute("name", id);
  newInput.setAttribute("value", placeholder);
  newInput.setAttribute("required", "");
  newInput.setAttribute("type", "number");

  // Create a new div and label for the input
  const newDiv = document.createElement("div");
  newDiv.className = "col-md-6"; // Matching your existing columns

  const newLabel = document.createElement("label");
  newLabel.setAttribute("for", id); // Ensure the 'for' attribute matches the input's ID
  newLabel.textContent = labelText; // Set the label text from parameter
  newDiv.appendChild(newLabel); // Add the label to the div

  newDiv.appendChild(newInput); // Add the input to the div

  // Append the new div to the existing row
  rowElement.appendChild(newDiv);
}

function submit_settings(event) {
  event.preventDefault(); // Prevent the default form submission
  const form = document.getElementById("settingsForm");
  const formData = new FormData(form);

  console.log("Processing form data");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  var matData = main_data["input"]["material"];
  for (const material in matData["general"]) {
    const currentMaterialData = matData["general"][material];

    // Handle potential missing form data gracefully
    const costVal = parseFloat(formData.get(material + "-cost")) || 0;
    const co2Val = parseFloat(formData.get(material + "-co2")) || 0;

    // Update costs and CO2 values within the nested structure
    currentMaterialData["Costs"] = costVal;
    currentMaterialData["CO2[t]"] = co2Val;
  }

  main_data["input"]["material"] = updateMaterialCosts(matData);

    const modalElement = document.getElementById("exampleModalFullscreen");
    modalElement.dispatchEvent(new Event("closeModal"));
    
    const closeButton = document.getElementById("settingCloseButton");
    // Choose your preferred method:
    // Method 1 (using click()):
    closeButton.click();

}

// Example usage: Adding a field dynamically with specific attributes
// You can call this function with the desired ID, label, and placeholder

// function submit_settings() {
//   // send back input data
//   document.getElementById("hiddenInputSettings").value = JSON.stringify(
//     main_data["input"]
//     );

//     main_data["input"]["material"];
// }
function init_settings_modal() {
  // input = cost-data
  materials = main_data["input"]["material"]["general"];

  // Locate the fieldset where you want to add the new input
  const fieldset = document.getElementById("material-cost-settings");

  var keys = Object.keys(materials);
  for (var i = 0; i < keys.length; i++) {
    const row = document.createElement("div");
    row.className = "row mb-3";
    material = keys[i];
    vals = materials[material];
    addInputField(
      material + "-cost",
      "Kosten " + material + " [€]",
      vals["Costs"],
      row
    );
    addInputField(
      material + "-co2",
      "CO2 " + material + " [t]",
      vals["CO2[t]"],
      row
    );
    fieldset.appendChild(row);
  }
}
