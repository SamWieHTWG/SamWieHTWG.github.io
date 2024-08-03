function get_json_el_from_id(id, jsonList) {
    var ifc_obj = null;
    for (var i = 0; i < Object.keys(jsonList).length; i++) {
      if (jsonList[i].id == id) {
        ifc_obj = jsonList[i];
        break;
      }
    }
    return ifc_obj;
  }

  function sleep(miliseconds) {
    var currentTime = new Date().getTime();
 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
 }