
// Crear el lienzo para el autómata
const canvas = new joint.dia.Paper({
  el: $('#canvas'),
  width: 800,
  height: 600,
  gridSize: 1,
  model: new joint.dia.Graph()
});

// Función para crear un nuevo estado
function createNode(x, y, label, state) {
  if (nodes.some(n => n.label == label)) {
    alert("Ya existe un estado con ese nombre");
    return;
  };
  let color, body = '#FFFFFF', stroke;

  switch (state) {
    case 'inicial':
      color = '#3498db';
      stroke = 4;
      break;
    case 'final':
      color = '#f2ff00';
      stroke = 7;
      break;
    case 'inicial y final':
      color = '#f2ff00';
      body = '#3498db';
      stroke = 7;
      break;
    default:
      stroke = 2;
      color = '#000000';
      break
  }
  return new joint.shapes.standard.Circle({
    position: { x, y },
    size: { width: 60, height: 60 },
    attrs: {
      circle: { fill: '#3498db' },
      text: { text: label, fill: 'white' },
      body: { fill: body, stroke: color, strokeWidth: stroke }
    }
  });
}

// Función para crear una nueva transición 
function createLink(source, target, label) {
  if (links.some(l => l.source == source && l.target == target && l.label == label)) {
    alert("Ya existe una transición con esos valores");
    return;
  }
  const link = new joint.shapes.standard.Link({
    source: { id: source },
    target: { id: target },
    router: { name: 'orthogonal' },
    connector: { name: 'smooth' },
    attrs: {
      line: { stroke: '#e67e22', strokeWidth: 2, targetMarker: { type: 'path', d: 'M 10 -5 0 0 10 5 Z' } },
    },
  });

  link.appendLabel({
    attrs: {
      text: { text: label, fontSize: 12, fill: 'black' }
    }
  });

  return link;
}

const nodesView = [];
const nodes = [];
q0n = { label: 'q0', estado: 'inicial y final' };
q1n = { label: 'q1', estado: 'final' };
q2n = { label: 'q2', estado: 'final' };
q3n = { label: 'q3', estado: 'final' };
q4n = { label: 'q4', estado: 'normal' };

q0 = createNode(100, 250, 'q0', 'inicial y final');
q1 = createNode(300, 50, 'q1', 'final');
q2 = createNode(300, 300, 'q2', 'final');
q3 = createNode(500, 50, 'q3', 'final');
q4 = createNode(500, 300, 'q4', 'normal');
nodes.push(q0n);
nodes.push(q1n);
nodes.push(q2n);
nodes.push(q3n);
nodes.push(q4n);
nodesView.push(q0);
nodesView.push(q1);
nodesView.push(q2);
nodesView.push(q3);
nodesView.push(q4);
canvas.model.addCell([q0, q1, q2, q3, q4]);
// Crear nodos iniciales


const linksView = [];
const links = []

// Crear transiciones iniciales
const link1 = createLink(q0.id, q1.id, '0');
const link2 = createLink(q0.id, q2.id, '1');
const link3 = createLink(q1.id, q3.id, '1');
const link4 = createLink(q1.id, q1.id, '0');
const link5 = createLink(q2.id, q1.id, '0');
const link6 = createLink(q2.id, q4.id, '1');
const link7 = createLink(q3.id, q1.id, '0');
const link8 = createLink(q3.id, q4.id, '1');
const link9 = createLink(q4.id, q4.id, '0');
const link10 = createLink(q4.id, q4.id, '1');
const link1s = { source: 'q0', target: 'q1', label: '0' };
const link2s = { source: 'q0', target: 'q2', label: '1' };
const link3s = { source: 'q1', target: 'q3', label: '1' };
const link4s = { source: 'q1', target: 'q1', label: '0' };
const link5s = { source: 'q2', target: 'q1', label: '0' };
const link6s = { source: 'q2', target: 'q4', label: '1' };
const link7s = { source: 'q3', target: 'q1', label: '0' };
const link8s = { source: 'q3', target: 'q4', label: '1' };
const link9s = { source: 'q4', target: 'q4', label: '0' };
const link10s = { source: 'q4', target: 'q4', label: '1' };
links.push(link1s, link2s, link3s, link4s, link5s, link6s, link7s, link8s, link9s, link10s);
linksView.push(link1, link2, link3, link4, link5, link6, link7, link8, link9, link10);
canvas.model.addCell([q1, link1]);
canvas.model.addCell([q2, link2]);
canvas.model.addCell([q3, link3]);
canvas.model.addCell([q1, link4]);
canvas.model.addCell([q1, link5]);
canvas.model.addCell([q4, link6]);
canvas.model.addCell([q1, link7]);
canvas.model.addCell([q4, link8]);
canvas.model.addCell([q4, link9]);
canvas.model.addCell([q4, link10]);

// Crear alfabetarget inicial
const alphabet = ["0", "1"];

// Eventarget de clic para agregar un nuevo nodo
canvas.on('blank:pointerclick', function (evt, x, y) {
  const label = prompt('Ingrese el nombre del nuevo estado:');
  if (label) {
    const newNode = createNode(x, y, label);
    if (newNode == null) return;
    nodes.push({ label: label, estado: "normal" });
    canvas.model.addCell(newNode);
    nodesView.push(newNode);
    console.log(nodes);
  }
});


// Eventarget de clic en un nodo para agregar una nueva transición
canvas.on('element:pointerclick', function (cellView, evt) {
  if (evt.shiftKey || evt.ctrlKey) return;
  const sourceNode = cellView.model;
  const label = prompt('Ingrese el valor de la transición:');

  const addLink = (source, target, label) => {
    source = nodesView.find(n => source === n.attributes.attrs.text.text);
    target = nodesView.find(n => target === n.attributes.attrs.text.text);
    links.push({ source: source.attributes.attrs.text.text, target: target.attributes.attrs.text.text, label: label });
  }

  if (label) {
    let targetNode = prompt('Ingrese el nombre del estado destino:')
    targetNode = nodesView.find(n => targetNode === n.attributes.attrs.text.text);
    if (targetNode == null) {
      alert("No existe un estado con ese nombre");
      return;
    };

    //Comprobar que ya no exista una transición con los mismos valores hacia el mismo estado
    if (links.some(l => l.source == sourceNode.attributes.attrs.text.text && l.target == targetNode.attributes.attrs.text.text && l.label == label)) {
      alert("Ya existe una transición con esos valores");
      return;
    }

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
    if (alphabet.indexOf(label) == -1) alphabet.push(label);
    console.log(links);
  }
});

//Eventarget de clic derecho en un enlace para eliminarlo
canvas.on('link:contextmenu', function (cellView, evt) {
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

//Eventarget de clic derecho en un nodo para eliminarlo
canvas.on('element:contextmenu', function (cellView, evt) {
  const node = cellView.model;
  const confirm = window.confirm(`¿Está seguro de eliminar el estado ${node.attributes.attrs.text.text}?`);
  if (confirm) {
    //Eliminar transiciones del nodo
    const linksToDelete = canvas.model.getConnectedLinks(node);
    linksToDelete.forEach(link => {
      links.splice(linksView.indexOf(link), 1);
      linksView.splice(linksView.indexOf(link), 1);
    }
    );
    canvas.model.removeCells([node]);
    nodes.splice(nodesView.indexOf(node), 1);
    nodesView.splice(nodesView.indexOf(node), 1);
    
  }
  console.log(nodes);
});

//Eventarget de clik izquierdo mas shift para volverlo un estado inicial
canvas.on('element:pointerclick', function (cellView, evt) {

  const node = cellView.model;
  if (evt.shiftKey) {

    if (nodes[nodesView.indexOf(node)].estado == "inicial" || nodes[nodesView.indexOf(node)].estado == "inicial y final") {
      node.attr('body/stroke', '#000000');
      node.attr('body/strokeWidth', 2);
      node.attr('body/fill', '#FFFFFF')
      nodes[nodesView.indexOf(node)].estado = "normal";
      return;
    }
    if (nodes.some(n => n.estado == "inicial" || n.estado == "inicial y final")) {
      alert("Ya existe un estado inicial");
      return;
    };

    const confirm = window.confirm(`¿Está seguro de volver el estado ${node.attributes.attrs.text.text} inicial?`);
    if (confirm) {
      node.attr('body/stroke', '#3498db');
      node.attr('body/strokeWidth', 4);
      nodes[nodesView.indexOf(node)].estado = "inicial";
    }
    console.log(nodes);
  }
})

//Eventarget de clik izquierdo mas Ctrl para volverlo un estado final
canvas.on('element:pointerclick', function (cellView, evt) {
  const node = cellView.model;
  if (evt.ctrlKey) {
    if (nodes[nodesView.indexOf(node)].estado == "final" || nodes[nodesView.indexOf(node)].estado == "inicial y final") {
      node.attr('body/stroke', '#000000');
      node.attr('body/strokeWidth', 2);
      node.attr('body/fill', '#FFFFFF')
      nodes[nodesView.indexOf(node)].estado = "normal";
      return;
    }
    if (nodes[nodesView.indexOf(node)].estado == "inicial") {
      const aux = window.confirm(`¿Está seguro de volver el estado ${node.attributes.attrs.text.text} final e inicial?`);
      if (aux) {
        node.attr('body/stroke', '#f2ff00');
        node.attr('body/fill', '#3498db')
        node.attr('body/strokeWidth', 7);
        nodes[nodesView.indexOf(node)].estado = "inicial y final";

        return;
      }

    }
    const confirm = window.confirm(`¿Está seguro de volver el estado ${node.attributes.attrs.text.text} final?`);
    if (confirm) {
      node.attr('body/stroke', '#f2ff00');
      node.attr('body/strokeWidth', 7);
      nodes[nodesView.indexOf(node)].estado = "final";
    }
  }
});

//Función para minimizar el autómata
function minimizar() {
  console.log("sad");
  //Separar en estados finales y no finales
  const finales = nodes.filter(n => n.estado === "final" || n.estado === "inicial y final");
  const transitions = {};

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const { source, target, label } = link;
    if (!transitions[source]) {
      transitions[source] = {};
    }
    transitions[source][label] = target;
  }
  //Obtener nodo inicial
  const startState = nodes.find(n => n.estado === "inicial" || n.estado === "inicial y final").label;
  automata = minimizeDFA(nodes.map(n => n.label), alphabet, transitions, startState , finales.map(n => n.label));
  console.log("a continuacion automata y enviandolo a python");
  console.log(JSON.stringify(automata));
  fetch('http://127.0.0.1:5000/minimize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(automata)
})
  .then(response => response.json())
  .then(data => {
    console.log("A continuación, los datos:");
    console.log(data);
    automata = data;
    limpiarYDibujarAutomata(automata);
  })
  .catch(error => {
    console.error('Error en la solicitud:', error);
  });
}

function minimizeDFA(states, alphabet, transitions, startState, finalStates) {
  return {
    states,
    alphabet,
    transitions,
    startState,
    finalStates
  };
}

function iniciar() {
  document.getElementById("btnI").style.display = 'none';
  document.getElementById("Botones").style.display = '';
  document.getElementById("Botones").style.display = '';
  document.getElementById("Container").style.display = '';
  document.getElementById("Inicio").style.display = 'none';

}
function mostrar() {
  var divAyuda = document.getElementById("Ayuda");

  if (divAyuda.style.display === 'none') {
    divAyuda.style.display = ''; // Muestra el div si está oculto
  } else {
    divAyuda.style.display = 'none'; // Oculta el div si está visible
  }
}

function regresar() {
  location.reload();
}

function reproducirAudio() {
  var audio = new Audio('IMG/sound.mp3'); // Reemplaza 'ruta_del_audio.mp3' por la ubicación de tu archivo de audio
  audio.volume = 0.1;
  // Reproduce el audio
  audio.play();
}

window.addEventListener('load', reproducirAudio);
// Llama a la función para reproducir el audio cuando la página se haya cargado completamente


function limpiarYDibujarAutomata(automata) {

  // Limpiar el canvas
  canvas.model.clear();
  nodesView.length = 0;
  nodes.length = 0;
  linksView.length = 0;
  links.length = 0;

  // Dibujar los nodos
  const states = automata.states;

  for (let i = 0; i < states.length; i++) {
    const x = 100 + i * 150;
    const y = 100 + i * 50;

    let state = ""
    if(automata.finalStates.includes(states[i])){
      if(automata.startState == states[i]){
        state = 'inicial y final';
        console.log("inicio y final");
      }
      else{
        state = 'final';
        console.log("final");
      }
    }
    else if(automata.startState == states[i]){
      state = 'inicial';
      console.log("inicial");
    }
    else{
      state = 'normal';
      console.log("normal");
    }

    const node = createNode(x, y, states[i], state);
    nodesView.push(node);

    canvas.model.addCell(node);
  }

  // Dibujar las transiciones
  const transitions = automata.transitions;
  console.log(transitions);
  for (const transition in transitions) {
    
    const stateTransitions = transitions[transition];
    console.log(stateTransitions);
    for (const symbol in stateTransitions) {
      const toState = stateTransitions[symbol];

      const fromNode = nodesView.find(n => n.attributes.attrs.text.text === transition);
      const toNode = nodesView.find(n => n.attributes.attrs.text.text === toState);

      const link = createLink(fromNode.id, toNode.id, symbol);
      linksView.push(link);
      canvas.model.addCell(link);
    }
  }
}

