// Crear el lienzo para el autómata
const canvas = new joint.dia.Paper({
  el: $('#canvas'),
  width: 800,
  height: 400,
  gridSize: 10,
  model: new joint.dia.Graph()
});

// Función para crear un nuevo estado
function createNode(x, y, label) {
  if(nodes.some(n => n.label == label)){
    alert("Ya existe un estado con ese nombre");
    return;
  };
  return new joint.shapes.standard.Circle({
    position: { x, y },
    size: { width: 60, height: 60 },
    attrs: {
      circle: { fill: '#3498db' },
      text: { text: label, fill: 'white' },
      body: {  fill: '#FFFFFF', stroke: '#000000', strokeWidth: 2 }
    }
  });
}

// Función para crear una nueva transición
function createLink(source, target, label) {
  if(links.some(l => l.source == source && l.target == target && l.label == label)){
    alert("Ya existe una transición con esos valores");
    return;
  }
  const link = new joint.shapes.standard.Link({
    source: { id: source },
    target: { id: target },
    router: { name: 'manhattan' },
    connector: { name: 'smooth' },
    attrs: {
      line: { stroke: '#e67e22', strokeWidth: 2, targetMarker: { type: 'path', d: 'M 10 -5 0 0 10 5 Z' } },
    }
  });
  
  link.appendLabel({
    attrs: {
      text: { text: label, fontSize: 12, fill: 'black' }    }
  });
  
  return link;
}

// Crear nodos iniciales


const nodesView = [];
const nodes = []
// Crear transiciones iniciales

const linksView = [];
const links = []
// Añadir nodos y transiciones al canvas

// Evento de clic para agregar un nuevo nodo
canvas.on('blank:pointerclick', function(evt, x, y) {
  const label = prompt('Ingrese el nombre del nuevo estado:');
  if (label) {
    const newNode = createNode(x, y, label);
    if(newNode == null) return;
    nodes.push({label: label, estado: "normal"});
    canvas.model.addCell(newNode);
    nodesView.push(newNode);
    console.log(nodes);
  }
});


// Evento de doble clic en un nodo para agregar una nueva transición
canvas.on('element:pointerclick', function(cellView, evt) {
  if(evt.shiftKey || evt.ctrlKey) return;
  const sourceNode = cellView.model;
  const label = prompt('Ingrese el valor de la transición:');

  const addLink = (source, target, label) =>{
      source = nodesView.find(n =>  source === n.attributes.attrs.text.text);
      target = nodesView.find(n =>  target === n.attributes.attrs.text.text);
      links.push({source: source.attributes.attrs.text.text, target: target.attributes.attrs.text.text, label: label});
  }

  if (label) {
    let targetNode = prompt('Ingrese el nombre del estado destino:')
    targetNode = nodesView.find(n =>  targetNode === n.attributes.attrs.text.text); 
    if(targetNode == null) {
      alert("No existe un estado con ese nombre");
      return;
    };
    
    // Buscar enlace existente entre los mismos nodos de origen y destino
    const existingLink = canvas.model.getConnectedLinks(sourceNode, { outbound: true })
    .find(link => link.getTargetCell() === targetNode);
  
  if (existingLink) {
    // Actualizar el label del enlace existente
    const existingLabels = existingLink.prop('labels');
    const updatedLabel = existingLabels.length > 0 ? `${existingLabels[0].attrs.text.text}, ${label}` : label;
    existingLink.prop('labels', [{ attrs: { text: { text: updatedLabel } } }]);
  } else {
    // Crear un nuevo enlace
    const newLink = createLink(sourceNode.id, targetNode.id, label);
    linksView.push(newLink);
    canvas.model.addCell([targetNode, newLink]);
  }
  addLink(sourceNode.attributes.attrs.text.text, targetNode.attributes.attrs.text.text, label);
  console.log(links);
}
});

//Evento de clic derecho en un enlace para eliminarlo
canvas.on('link:contextmenu', function(cellView, evt) {
  const link = cellView.model;
  const sourceNode = link.getSourceCell();
  const targetNode = link.getTargetCell();
  const labels = link.prop('labels');
  const label = labels.length > 0 ? labels[0].attrs.text.text : '';
  const confirm = window.confirm(`¿Está seguro de eliminar la transición ${label} de ${sourceNode.attributes.attrs.text.text} a ${targetNode.attributes.attrs.text.text}?`);
  if (confirm) {
    canvas.model.removeCells([link]);
    links.splice(linksView.indexOf(link), 1);
    linksView.splice(linksView.indexOf(link), 1);
    
  }
  console.log(links);
});

//Evento de doble clic derecho en un nodo para eliminarlo
canvas.on('element:contextmenu', function(cellView, evt) {
  const node = cellView.model;
  const confirm = window.confirm(`¿Está seguro de eliminar el estado ${node.attributes.attrs.text.text}?`);
  if (confirm) {
    canvas.model.removeCells([node]);
    nodes.splice(nodesView.indexOf(node), 1);
    nodesView.splice(nodesView.indexOf(node), 1);
    
  }
  console.log(nodes);
});

//Evento de clik izquierdo mas shift para volverlo un estado inicial
canvas.on('element:pointerclick', function(cellView, evt) {
  
  const node = cellView.model;
  if (evt.shiftKey) {
    if(nodes.some(n => n.estado == "inicial")) {
      alert("Ya existe un estado inicial");
      return;
    };
    if(nodes[nodesView.indexOf(node)].estado == "inicial"){
      node.attr('body/stroke', '#000000');
      node.attr('body/strokeWidth', 2);
      nodes[nodesView.indexOf(node)].estado = "normal";
      return;
    }

    const confirm = window.confirm(`¿Está seguro de volver el estado ${node.attributes.attrs.text.text} inicial?`);
    if (confirm) {
      node.attr('body/stroke', '#3498db');
      node.attr('body/strokeWidth', 4);
      nodes[nodesView.indexOf(node)].estado = "inicial";
    }
    console.log(nodes);
  }
})

//Evento de clik izquierdo mas Ctrl para volverlo un estado final
canvas.on('element:pointerclick', function(cellView, evt) {
  const node = cellView.model;
  if (evt.ctrlKey) {
    if(nodes[nodesView.indexOf(node)].estado == "final"){
      node.attr('body/stroke', '#000000');
      node.attr('body/strokeWidth', 2);
      nodes[nodesView.indexOf(node)].estado = "normal";
      return;
    }
    const confirm = window.confirm(`¿Está seguro de volver el estado ${node.attributes.attrs.text.text} final?`);
    if (confirm) {
      node.attr('body/stroke', '#f2ff00');
      node.attr('body/strokeWidth', 7);
      nodes[nodesView.indexOf(node)].estado = "final";
    }
  }
});