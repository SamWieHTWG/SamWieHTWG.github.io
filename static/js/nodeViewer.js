function get_child_nodes(node) {
  if (node.nodes === undefined) return [];
  var childrenNodes = node.nodes;
  node.nodes.forEach(function (n) {
    childrenNodes = childrenNodes.concat(get_child_nodes(n));
  });
  return childrenNodes;
}


function get_child_node_ids(node) {
  childs = get_child_nodes(node);

  var ids = [];
  childs.forEach(function (c) {
    ids.push(c.id)
  });

  return ids;
}

function getNodeById(id) {
  var treeViewObject = $('#treeview1').data('treeview'),
    allCollapsedNodes = treeViewObject.getCollapsed(),
    allExpandedNodes = treeViewObject.getExpanded(),
    allNodes = allCollapsedNodes.concat(allExpandedNodes);
  var node = null;
  for (var i = 0; i < allNodes.length; i++) {
    if (allNodes[i].id != id) continue;
      node = allNodes[i];
      break;
  }
  return node;
}


function unselectAllNodes() {
  var treeViewObject = $('#treeview1').data('treeview'),
    allCollapsedNodes = treeViewObject.getCollapsed(),
    allExpandedNodes = treeViewObject.getExpanded(),
    allNodes = allCollapsedNodes.concat(allExpandedNodes);
  var node = null;
  for (var i = 0; i < allNodes.length; i++) {
      node = allNodes[i];
      if(node.state.selected)
      {
        treeViewObject.unselectNode(node.nodeId);
      }
  }
  return node;
}

function get_node_parent(node)
{
  var treeViewObject = $('#treeview1').data('treeview');
  return  treeViewObject.getParent(node);
}

function expandNodeById(id, expand = true) {
  var treeViewObject = $('#treeview1').data('treeview'),
    allCollapsedNodes = treeViewObject.getCollapsed(),
    allExpandedNodes = treeViewObject.getExpanded(),
    allNodes = allCollapsedNodes.concat(allExpandedNodes);
  for (var i = 0; i < allNodes.length; i++) {
    if (allNodes[i].id != id) continue;

    var node = allNodes[i];
    var childs = get_child_nodes(node);
    var parent = treeViewObject.getParent(node);
    while (parent != null) {
      treeViewObject.expandNode(parent.nodeId);
      parent = treeViewObject.getParent(parent);
    }
  }
  return [node, childs];
}

function selectNodeById(id, select = true) {
  var treeViewObject = $('#treeview1').data('treeview');
  var [node, _] = expandNodeById(id, true);

  if (select) {
    // node.state.selected = true
    treeViewObject.selectNode(node.nodeId);
  }
  else {
    // node.state.selected = false
    treeViewObject.unselectNode(node.nodeId);
  }

}

function scroll_to_node(id) {
  var div = document.getElementById("treeview1");
  var listEls = div.getElementsByTagName("li");
  var [node, _] = expandNodeById(id, true);
  if (!node) return;

  for (var i = 0; i < listEls.length; i++) {
    var a = listEls[i];
    if (a.attributes["data-nodeid"].value == node.nodeId.toString()) {

      /* funktioniert leider nicht mit Chrome */
      // a.scrollIntoView({ behavior: "smooth", block: 'center'});
      a.scrollIntoView({ block: 'center' });
    }
  }
}

function nodeTreeCollapseAll() {
  var treeViewObject = $('#treeview1').data('treeview');
  treeViewObject.collapseAll();
}


function setNodeTreeData(data) {
  $('#treeview1').treeview({
    data: data,
    collapseIcon: 'fas fa-minus',
    expandIcon: 'fas fa-plus',
    expanded: false,    // Alle Knoten werden von Anfang an ausgeklappt
    collapsed: true,
    onNodeSelected: function (event, node) {
      onNodeSelect(node)
    },
    onNodeUnselected: function (event, node) {
      onNodeUnSelect(node);
    }
  });
}

function init_node_tree(data)
{
  setNodeTreeData(data)
}

