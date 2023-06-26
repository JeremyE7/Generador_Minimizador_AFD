// Definición de las estructuras de datos
const Node = function(label, estado) {
  this.label = label;
  this.estado = estado;
};

const Link = function(source, target, label) {
  this.source = source;
  this.target = target;
  this.label = label;
};

// Función para minimizar un AFD
function minimizarAFD(nodes, links, alphabet) {
  let partition = [[], []];
  let newPartition = [];

  // Separar los nodos iniciales de los no iniciales
  nodes.forEach(node => {
    if (node.estado === 'inicial' || node.estado === 'inicial y final') {
      partition[0].push(node);
    } else {
      partition[1].push(node);
    }
  });

  do {
    newPartition = partition.map(group => {
      let newGroups = [];

      group.forEach(state => {
        let transitions = {};

        alphabet.forEach(symbol => {
          let f_s_a = links.filter(link => link.source === state.label && link.label === symbol
          ).map(link => link.target);
          transitions[symbol] = f_s_a;
        });

        let found = false;
        for (let i = 0; i < newGroups.length; i++) {
          let existingGroup = newGroups[i];
          let isEqual = true;

          alphabet.forEach(symbol => {
            if (!areSetsEqual(transitions[symbol], existingGroup.transitions[symbol])) {
              isEqual = false;
            }
          });

          if (isEqual) {
            existingGroup.states.push(state);
            found = true;
            break;
          }
        }

        if (!found) {
          newGroups.push({ states: [state], transitions });
        }
      });

      return newGroups;
    });

    partition = newPartition;
  } while (!arePartitionsEqual(partition, newPartition));

  let reducedNodes = [];
  let reducedLinks = [];

  partition.forEach(group => {
    let representativeState = group.states[0];
    reducedNodes.push(representativeState);

    let hasInitial = group.states.some(node => node.estado === 'inicial' || node.estado === 'inicial y final');
    let hasFinal = group.states.some(node => node.estado === 'final' || node.estado === 'inicial y final');

    if (hasInitial && hasFinal) {
      representativeState.estado = 'inicial y final';
    } else if (hasInitial) {
      representativeState.estado = 'inicial';
    } else if (hasFinal) {
      representativeState.estado = 'final';
    } else {
      representativeState.estado = 'normal';
    }

    alphabet.forEach(symbol => {
      let f_s_a = group.transitions[symbol];
      let targetGroup = partition.find(g => g.states.some(node => f_s_a.includes(node.label)));
      let targetState = targetGroup.states[0];

      reducedLinks.push({
        source: representativeState.label,
        target: targetState.label,
        label: symbol
      });
    });
  });

  return {
    nodes: reducedNodes,
    links: reducedLinks
  };
}

function arePartitionsEqual(partition1, partition2) {
  if (partition1.length !== partition2.length) {
    return false;
  }
  for (let i = 0; i < partition1.length; i++) {
    let set1 = partition1[i].states.map(node => node.label).sort().toString();
    let set2 = partition2[i].states.map(node => node.label).sort().toString();

    if (set1 !== set2) {
      return false;
    }
  }

  return true;
}

function areSetsEqual(set1, set2) {
  if (set1.length !== set2.length) {
    return false;
  }

  return set1.every(element => set2.includes(element));
}


// Ejemplo de uso
let nodes = [
  new Node('q0', 'inicial'),
  new Node('q1', 'normal'),
  new Node('q2', 'normal'),
  new Node('q3', 'normal'),
  new Node('q4', 'final')
];

let links = [
  new Link('q0', 'q1', '0'),
  new Link('q0', 'q2', '1'),
  new Link('q1', 'q3', '0'),
  new Link('q1', 'q1', '1'),
  new Link('q2', 'q1', '0'),
  new Link('q2', 'q3', '1'),
  new Link('q3', 'q1', '0'),
  new Link('q3', 'q3', '1'),
  new Link('q4', 'q4', '0'),
  new Link('q4', 'q4', '1')
];

let alphabet = ['0', '1'];

let minimizedAutomaton = minimizarAFD(nodes, links, alphabet);
console.log("Automata minimizado");
console.log(minimizedAutomaton);

