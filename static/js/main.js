
// events:
function onMouseClick(event) {
  // call raycaster of three
  onMouseClickThree(event)
}
function onNodeSelect(node) {
  // no action if update is running -> node was 
  // selected automatically
  if(main_data["update_running"]) return;

  update_main(null, node, null);
}
function onNodeUnSelect(node) {
  // no action if update is running -> node was 
  // selected automatically
  if(main_data["update_running"]) return;
  update_main(null, null, null);
}
function onTableRowClick(ids){
  update_main(null, null, ids);
}

function update_node_tree(state)
{
  setNodeTreeData(main_data["node_storage"][state])
}
function check_model_loaded()
{
  
  if(main_data.states.length==0) return false;
  return true;
}
function activateListView() {
  model_loaded = check_model_loaded();
  if(model_loaded==false) return;
  
  // update_table_from_data(tableData)
  var treeDiv = document.getElementById("treeview1");
  treeDiv.style.display = "block";
  
  treeDiv = document.getElementById("chart-container");
  treeDiv.style.display = "none";

  sleep(50); 
  clear_table();
  sleep(50); 
  main_data["state"] = "excel";
  update_node_tree(main_data["state"]);
  nodeTreeCollapseAll();
  table_init(main_data["table_storage"][main_data["state"]]) 
  update_table_from_ids([])
}
function activateGeneralView() {
  // update_table_from_data(tableData)
  if(check_model_loaded()==false) return;
  
  var treeDiv = document.getElementById("treeview1");
  treeDiv.style.display = "block";

  treeDiv = document.getElementById("chart-container");
  treeDiv.style.display = "none";

  main_data["state"] = "general";
  sleep(50); 
  clear_table();
  sleep(50); 
  table_init(main_data["table_storage"][main_data["state"]]) 
  sleep(50); 
  update_node_tree(main_data["state"]);
  nodeTreeCollapseAll();
}
function activatMaterialView() {
  // update_table_from_data(tableData)
  if(check_model_loaded()==false) return;

  var treeDiv = document.getElementById("treeview1");
  treeDiv.style.display = "none";

  treeDiv = document.getElementById("chart-container");
  treeDiv.style.display = "flex";


  main_data["state"] = "material";
  sleep(50); 
  clear_table();
  sleep(50); 
  table_init(main_data["table_storage"][main_data["state"]]) 
  sleep(50); 
  update_node_tree(main_data["state"]);
  nodeTreeCollapseAll();

  
  // var costSpan = document.getElementById('cost-value');
  // var co2Span = document.getElementById('co2-value');
  // var costs = main_data["table_storage"].material[0]["Kosten[€]"]
  // var C02 = main_data["table_storage"].material[0]["CO2[t]"]

  // // Ändern des Textes
  // costSpan.innerHTML = costSpan.innerHTML.replace("$COST$", costs)
  // co2Span.innerHTML = co2Span.innerHTML.replace("$CO2$", C02)

  init_chart();
  init_statistik_chart();

}

function init_main()
{
  if( check_model_loaded() == false)return;

  var settingsButton = document.getElementById("settings-button"); 
  settingsButton.style.display = "block";


  main_data["table"] =  table_init(main_data["table_storage"][main_data["state"] ])
  init_node_tree(main_data["node_storage"][main_data["state"] ])

  main_data["tableSelect"] = [];
  main_data["update_running"] = false

  var statsButton = document.getElementById("stats-button"); 
  if(!statsButton==null)
    statsButton.style.display = "block";
}

function update_main(intersect_ids = null, selectedNode = null, selectTable=null) {

  // drei Fälle:
  // - Knoten angeklickt
  //   - alle Unterelemente + Element werden visualisert
  //   - alle Unterelemente + Element erscheinen in Tabelle
  //   - Knoten wird aufgeklappt

  // - Table angeklickt
  //   - Knoten kann bleiben, da ja scheinbar schon angewählt
  //   - Nur das eine Element erscheint in Viewer
  //   - AKtuelle Tabellenansicht wird erhalten

  // - Viewer angeklickt
  //   - Übergeordneter Knoten aufklappen
  //   - alle Elemente des übergeordneten Elements in Tabelle
  //   - Nur einzelnes Element in Viewer sichtbar

  // --> Identifikation, welches Element visualisiert wird
  // --> Identifikation des Knotens -> Gibt Tabellenansicht vor
  console.log("Update main")

  main_data["update_running"] = true

  var actualNode = null
  var active_ids = [];
  var isNodeSelection = false

  // console.time('reset')
  /* reset -> no node select */
  if (intersect_ids == null && selectedNode == null && selectTable == null) {
    // updateSceneByIds([])
    highlightFromGuids([]) 
    update_table_from_ids([]) 
    unselectAllNodes();
    main_data["update_running"] = false
    return;
  }
  // console.timeEnd('reset')

  /* selection by raycast */
  if (intersect_ids != null) {
    /* identifikation des (uebergeordneten) Knotens */
    actualNode = getNodeById(intersect_ids[0])
    main_data["tableSelect"] = actualNode.id
  }

  /* selection by nodetree */
  if (selectedNode != null) {
    actualNode = selectedNode
    isNodeSelection = true
    main_data["tableSelect"] = actualNode.id
  }

  /* selection by table */
  if (selectTable != null) {
    actualNode = getNodeById(selectTable)
  }


  console.time('table')
  /* update table by node */
  var tableNode = actualNode
  if (!("nodes" in tableNode)) {
    tableNode = get_node_parent(tableNode);
  }
  childs = get_child_nodes(tableNode)
  for (let i = 0; i < childs.length; i++) {
    active_ids.push(childs[i].id)
  }
  active_ids.push(tableNode.id)
  update_table_from_ids( active_ids);
  console.timeEnd('table')


  /* update view by nodes */
  console.time('View')
  active_ids = []
  active_ids.push(actualNode.id)
  childs = get_child_nodes(actualNode)
  for (let i = 0; i < childs.length; i++) {
    active_ids.push(childs[i].id)
  }
  // Irgendwo in einem nicht-modularen JavaScript-File
  highlightFromGuids(active_ids);

  // updateSceneByIds(active_ids)
  console.timeEnd('View')

  console.time('NodeSelection')
  if (!isNodeSelection) {
    selectNodeById(actualNode.id, 1)
    scroll_to_node(actualNode.id)
  }
  if(selectTable==null)
  {
    /* hier muss gewartet werden, bis Table geladen -> Timeout*/ 
    function setTableId() {
      var success = select_table_row_by_id(main_data["table"], main_data["tableSelect"]);
      if(success == false) setTimeout(setTableId,10)
    }
    setTimeout(setTableId,10)
  }

  console.timeEnd('NodeSelection')

  main_data["update_running"] = false

}