from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)
def minimize_afd(afd):
    states = afd["states"]
    alphabet = afd["alphabet"]
    transitions = afd["transitions"]
    start_state = afd["startState"]
    final_states = afd["finalStates"]

    # Paso 1: Dividir estados en grupos iniciales (finales y no finales)
    groups = [final_states[:], list(set(states) - set(final_states))]
    new_groups = []

    while True:
        # Paso 2: Calcular partición
        for group in groups:
            if len(group) <= 1:
                new_groups.append(group)
                continue

            group_map = {}
            representative = group[0]
            for state in group:
                transitions_repr = tuple(transitions[state][symbol] for symbol in alphabet)
                if transitions_repr not in group_map:
                    group_map[transitions_repr] = []
                group_map[transitions_repr].append(state)

            new_groups.extend(group_map.values())

            if len(group_map) > 1 and representative not in new_groups:
                new_groups.append([representative])

        # Paso 3: Verificar si se alcanzó la partición final
        if len(groups) == len(new_groups):
            break

        groups = new_groups
        new_groups = []

    # Paso 4: Construir el nuevo AFD minimizado
    new_states = []
    new_transitions = {}
    new_start_state = None
    new_final_states = []

    for i, group in enumerate(groups):
        state_name = "Q" + str(i)
        new_states.append(state_name)
        for state in group:
            if state == start_state:
                new_start_state = state_name
            if state in final_states:
                new_final_states.append(state_name)
            for symbol in alphabet:
                next_state = transitions[state][symbol]
                for j, g in enumerate(groups):
                    if next_state in g:
                        new_transitions[state_name] = new_transitions.get(state_name, {})
                        new_transitions[state_name][symbol] = "Q" + str(j)
                        break

    new_afd = {
        "states": new_states,
        "alphabet": alphabet,
        "transitions": new_transitions,
        "startState": new_start_state,
        "finalStates": new_final_states
    }

    return new_afd

@app.route('/')
def hello():
    return '¡Hola, mundo!'

@app.route('/minimize', methods=['POST'])
def minimize():
    afd = request.json  # Obtén el AFD desde la solicitud POST
    minimized_afd = minimize_afd(afd)  # Aplica la minimización del AFD
    minimized = minimize_afd(minimized_afd)  # Aplica la minimización del AFD
    final = minimize_afd(minimized)  # Aplica la minimización del AFD
    return jsonify(final)

if __name__ == '__main__':
    app.run()
