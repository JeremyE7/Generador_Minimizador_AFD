import pygraphviz as pgv
import os
import json
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)
def minimize_dfa(dfa):
    states = dfa['states']
    alpha = dfa['alphabet']
    a = dfa['transitions']
    initial_state = dfa['startState']
    final_states = dfa['finalStates']

    mat = []
    for i in range(len(states) - 1):
        mat.append([0 for i in range(i + 1)])
        [mat[i].append(-1) for j in range(i + 1, len(states) - 1)]

    G = pgv.AGraph(directed=True, rankdir='LR')
    G.add_node(initial_state, color='red')
    G.add_node('qi', shape='point')
    G.add_edge('qi', initial_state, label='start')
    [G.add_node(fs, peripheries=2, color='green:green') for fs in final_states]

    for tab in sorted(a):
        labels = []
        temp = tab
        for i in range(len(alpha)):
            label = G.get_edge(tab, a[tab][alpha[i]]).attr['label'] + ',' + alpha[i] if G.has_edge(tab,
                                                                                                   a[tab][alpha[i]]) else alpha[i]
            G.add_edge(tab, a[tab][alpha[i]], label=label)

    G.write('in.dot')
    G.layout()
    G.draw('in.png', prog='dot')
    os.system('eog in.png')

    index_lst = [states.index(i) for i in final_states]

    for i in index_lst:
        for j in range(len(states) - 1):
            for k in range(j + 1):
                if i - 1 == j and k not in index_lst:
                    mat[j][k] = 1
                elif i == k and j + 1 not in index_lst:
                    mat[j][k] = 1

    flag = True
    while flag:
        flag3 = True
        for i in range(len(states) - 1):
            for j in range(i + 1):
                if mat[i][j] == 0:
                    r = states[i + 1]
                    c = states[j]
                    t = 0
                    flag2 = True

                    while t < len(alpha) and flag2:
                        if a[r][alpha[t]] != a[c][alpha[t]]:
                            r1 = states.index(a[r][alpha[t]]) - 1
                            c1 = states.index(a[c][alpha[t]])

                            if c1 == len(states) - 1 or mat[r1][c1] == -1 or r1 == -1 or c1 == -1:
                                r1, c1 = c1 - 1, r1 + 1

                            if mat[r1][c1] == 1:
                                mat[i][j] = 1
                                flag3 = False
                                flag2 = False
                        t += 1

        if flag3:
            flag = False

    pairs = []
    for i in range(len(states) - 1):
        for j in range(i + 1):
            if mat[i][j] == 0:
                pairs.append((min(states[i + 1], states[j]), max(states[i + 1], states[j])))

    i, j = 0, 0
    flag = True

    while flag:
        i, j = 0, 0
        flag = False
        while i < len(pairs):
            j = 0
            while j < len(pairs):
                if i != j and len(set(pairs[i]).intersection(pairs[j])) > 0:
                    temp1 = set(pairs[i]).union(pairs[j])
                    pairs.pop(i)
                    if i > j:
                        pairs.pop(j)
                    else:
                        pairs.pop(j - 1)
                    pairs.append(temp1)
                    flag = True
                j += 1
            i += 1

    tab_dict = {}
    for ele in states:
        flag = True
        for i in range(len(pairs)):
            if ele in pairs[i]:
                tab_dict[ele] = sorted(list(pairs[i]))
                flag = False
                break
        if flag:
            tab_dict[ele] = [ele]

    table = {}
    for ele in sorted(tab_dict):
        table[', '.join(tab_dict[ele])] = []
        for i in range(len(alpha)):
            table[', '.join(tab_dict[ele])].append(sorted(tab_dict[a[tab_dict[ele][0]][alpha[i]]]))
            for j in range(1, len(tab_dict[ele])):
                table[', '.join(tab_dict[ele])][i] = sorted(
                    set(table[', '.join(tab_dict[ele])][i]).union(tab_dict[a[tab_dict[ele][j]][alpha[i]]]))

    G = pgv.AGraph(directed=True, rankdir='LR')
    G.add_node(tab_dict[initial_state][0], color='red')
    G.add_node('qi', shape='point')
    G.add_edge('qi', tab_dict[initial_state][0], label='start')
    [G.add_node(fs, peripheries=2, color='green:green') for fs in final_states]

    for tab in sorted(table):
        for i in range(len(alpha)):
            label = G.get_edge(tab, ', '.join(table[tab][i])).attr['label'] + ',' + alpha[i] if G.has_edge(tab,
                                                                                                            ', '.join(
                                                                                                                table[
                                                                                                                    tab][
                                                                                                                    i])) else alpha[
                i]
            G.add_edge(tab, ', '.join(table[tab][i]), label=label)

    G.write('out.dot')
    G.layout()
    G.draw('out.png', prog='dot')
    os.system('eog out.png')

    fin_final = []
    fin_init = None
    for tab in table:
        if initial_state in tab:
            fin_init = tab
        [fin_final.append(tab) for fs in final_states if fs in tab]

    output_dfa = {
        "states": sorted(table.keys()),
        "alphabet": alpha,
        "transitions": {},
        "startState": fin_init,
        "finalStates": fin_final
    }

    for tab in sorted(table):
        output_dfa["transitions"][tab] = {}
        for i in range(len(alpha)):
            output_dfa["transitions"][tab][alpha[i]] = ', '.join(table[tab][i])

    print("Initial state of the minimized DFA: " + fin_init)
    print("Final states of the minimized DFA: " + ', '.join(fin_final))
    print("Minimal DFA transition table:\n")
    print("{:<20}".format('States') + ''.join("{:<20}".format(i) for _, i in enumerate(alpha)))

    for tab in sorted(table):
        strs = [', '.join(i) for i in table[tab]]
        print("{:<20}".format(tab) + ''.join("{:<20}".format(i) for i in strs))

    with open('dfa_minimized.json', 'w') as json_file:
        json.dump(output_dfa, json_file)

    return output_dfa

@app.route('/minimize', methods=['POST'])
def minimize():
    afd = request.json  # Obtén el AFD desde la solicitud POST
    minimized_afd = minimize_dfa(afd)
    return jsonify(minimized_afd)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)