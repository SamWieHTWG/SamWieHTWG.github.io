


function get_columns_from_data(data) {

  if(main_data.state != "material")
  {
    var col_list = keys = ["IfcTyp", "Name","Material" ,"Geschoss","Volumen[m³]","GlobalId"];
    table_cols = get_columns_from_str_list(col_list); 
    return table_cols;
  }
  else
  {
    var col_list = keys = ["Material","Volumen[m³]","Preis[€/m³]" ,"Kosten[€]","CO2[t/m³]","CO2[t]","Geschoss","IfcTyp","GlobalId"];
    table_cols = get_columns_from_str_list(col_list); 
    return table_cols;
  }


  if(data==undefined)return null;
  var table_cols = [];
  for (let i = 0; i < Object.keys(data[0]).length; i++) {
    var key = Object.keys(data[0])[i]
    if (key == 'id') { continue }
    table_cols.push({ title: key, field: key, responsive: 0 })
  }
  return table_cols
}

function get_columns_from_str_list(list) {

  if(data==undefined)return null;
  var table_cols = [];
  for (let i = 0; i < list.length; i++) {
    var key = list[i]
    if (key == 'id') { continue }
    table_cols.push({ title: key, field: key, responsive: 1 })
  }
  return table_cols
}

function unselect_table_all(table) {

  table.deselectRow(); 

  var rows = table.rowManager.rows;

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    table.deselectRow(row)
  }
}

function select_table_row_by_id(table, id) {

  var rows = table.rowManager.rows;
  var success = false;
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var rowData = row.getData();
    if (rowData.id == id) {
      // row.select();
      table.scrollToRow(row, 'center')
      table.selectRow(row)
      success = true;
      break;
    }
  }
  return success;
}


//define data array
function table_init(data) {

  var table_cols = get_columns_from_data(data);

  var expanded, tree;
  if(main_data.state != "material")
  {
    expanded = [];
    tree = false;
  }
  else
  {
    expanded = [true, true];
    tree = true;
  }
  var table = new Tabulator("#element-table", {
    // maxHeight: "calc(0.8*var(--left-container-height))",
    dataTreeStartExpanded:expanded, 
    data: data,
    columns: table_cols,
    selectableRows: true,
    dataTree:tree,
    dataTreeCollapseElement:"<i class='fas fa-minus'></i>",
    dataTreeExpandElement: "<i class='fas fa-plus'></i>",
    dataTreeBranchElement: ""
  });

  table.on("rowClick", function (e, row) {
    //e - the click event object
    //row - row component
    table.deselectRow(); 
    table.selectRow(row);
    onTableRowClick([row._row.data.id]);

  });

  adapt_table_col_padding();
  return table;

}

function adapt_table_header() {
  // Wählen Sie alle Elemente mit der Klasse .tabulator-col-content aus
  var table_elements = document.querySelectorAll('.tabulator-col-content');
  // Durchlaufen Sie die NodeList und setzen Sie das Padding jedes Elements auf 0
  table_elements.forEach(function (element) {
    element.style.padding = '4px';
  });
}
function clear_table() {
  var table = main_data["table"]
  // table.setColumns([])
  table.setData([]);
}
function update_table_from_data(table, data) {

  main_data["table"] = table_init(data);
  return;
}

function adapt_table_col_padding()
{
  // Wählen Sie alle Elemente mit der Klasse .tabulator-col-content aus
  var table_elements = document.querySelectorAll('.tabulator-col-content');
  // Durchlaufen Sie die NodeList und setzen Sie das Padding jedes Elements auf 0
  table_elements.forEach(function (element) {
    element.style.padding = '4px';
  });
}

function update_table_from_ids(ids) {

  var table = main_data["table"];
  
  var tableData = main_data["table_storage"][main_data["state"]];
  if(tableData== '0' || tableData == undefined) return;

  if (ids.length == 0) {
    unselect_table_all(table);
  }
  
  var actualData = []
  for (let i = 0; i < Object.keys(tableData).length; i++) {
    var stop = 1;
    if (ids.includes(tableData[i].id)) {
      actualData.push(tableData[i])
    }
    // if("_children" in tableData[i])
    // {
    //   var childs = tableData[i]._children;
    //   for(let j =0; j<childs.length; j++)
    //   {
    //     var c = childs[j];
    //     if (ids.includes(c.id)) {
    //       push whole main node to table data
    //       actualData.push(tableData[i])
    //       break;
    //     }
    //   }
    // }
  }

  if(main_data["state"]=="material")
  {
    // table should not be updated
    return;
  }
  if (actualData.length == 0) {
    /* set empty and return */
    table.setData(actualData);
    return;
  }

  update_table_from_data(table, actualData);


}
