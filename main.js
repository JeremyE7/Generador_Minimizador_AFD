// Crear el lienzo para el autómata
const canvas = new joint.dia.Paper({
  el: $('#canvas'),
  width: 800,
  height: 600,
  gridSize: 10,
  model: new joint.dia.Graph()
});

// Función para crear un nuevo estado
function createNode(x, y, label) {
  return new joint.shapes.standard.Circle({
    position: { x, y },
    size: { width: 60, height: 60 },
    attrs: {
      circle: { fill: '#3498db' },
      text: { text: label, fill: 'white' }
    }
  });
}

// Función para crear una nueva transición
function createLink(source, target, label) {
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
const node1 = createNode(100, 100, 'A');
const node2 = createNode(300, 150, 'B');

const nodes = [node1, node2];

// Crear transiciones iniciales
const link1 = createLink(node1.id, node2.id, '0');
const link2 = createLink(node2.id, node1.id, '1');
const links = [link1, link2];
// Añadir nodos y transiciones al canvas
canvas.model.addCell([node1, node2, link1, link2]);

// Evento de doble clic para agregar un nuevo nodo
canvas.on('blank:pointerclick', function(evt, x, y) {
  const label = prompt('Ingrese el nombre del nuevo estado:');
  if (label) {
    const newNode = createNode(x, y, label);
    canvas.model.addCell(newNode);
    nodes.push(newNode);
  }
});


// Evento de doble clic en un nodo para agregar una nueva transición
canvas.on('element:pointerclick', function(cellView) {
  const sourceNode = cellView.model;
  const label = prompt('Ingrese el valor de la transición:');
  if (label) {
    let targetNode = prompt('Ingrese el nombre del estado destino:')
    targetNode = nodes.find(n =>  targetNode === n.attributes.attrs.text.text); 
    if(targetNode == null) return;
    
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
    links.push(newLink);
    canvas.model.addCell([targetNode, newLink]);
  }
}
});

