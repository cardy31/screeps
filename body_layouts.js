/**
Cost per body part
MOVE:          50
WORK:          100
CARRY:         50
ATTACK:        80
RANGED_ATTACK: 150
HEAL:          250
CLAIM:         600
TOUGH:         10
**/

/*
Available Energy Per Level
0: 0
1: 300
2: 550
3: 800
4: 1300
5: 1800
6: 2300
7: 5300
8: 6300
*/

var bodyConfigs = {
    attacker: {
        0: {attack: 2, move: 2},
        1: {attack: 2, move: 2},
        2: {attack: 4, move: 4, tough: 3},
        3: {attack: 6, move: 5, tough: 2},
        4: {attack: 6, move: 5, tough: 2},
        5: {attack: 6, move: 5, tough: 2},
        6: {},
        7: {},
        8: {},
    },
    builder: {
        0: {work: 1, carry: 1, move: 1},
        1: {work: 1, carry: 1, move: 2},
        2: {work: 3, carry: 3, move: 2},
        3: {work: 3, carry: 3, move: 2},
        4: {work: 5, carry: 8, move: 8},
        5: {work: 8, carry: 10, move: 10},
        6: {},
        7: {},
        8: {},
    },
    claimer: {
        0: {},
        1: {},
        2: {},
        3: {claim: 1, move: 4},
        4: {claim: 1, move: 10},
        5: {claim: 1, move: 16},
        6: {claim: 1, move: 16},
        7: {claim: 1, move: 16},
        8: {claim: 1, move: 16},
    },
    harvester: {
        0: {work: 1, carry: 1, move: 2},
        1: {work: 1, carry: 1, move: 2},
        2: {work: 3, carry: 2, move: 3},
        3: {work: 3, carry: 2, move: 3},
        4: {work: 5, carry: 6, move: 10},
        5: {work: 8, carry: 10, move: 10},
        6: {},
        7: {},
        8: {},
    },
    rangedAttacker: {
        0: {ranged_attack: 1, move: 2},
        1: {ranged_attack: 1, move: 2},
        2: {ranged_attack: 2, move: 4, tough: 5},
        3: {ranged_attack: 3, move: 6, tough: 5},
        4: {ranged_attack: 6, move: 7, tough: 5},
        5: {ranged_attack: 7, move: 8, tough: 5},
        6: {},
        7: {},
        8: {},
    },
    repairer: {
        0: {work: 1, carry: 1, move: 1},
        1: {work: 1, carry: 1, move: 1},
        2: {work: 2, carry: 4, move: 3},
        3: {work: 2, carry: 4, move: 3},
        4: {work: 3, carry: 10, move: 10},
        5: {work: 5, carry: 13, move: 13},
        6: {},
        7: {},
        8: {},
    },
    upgrader: {
        0: {work: 1, carry: 1, move: 1},
        1: {work: 1, carry: 1, move: 2},
        2: {work: 3, carry: 3, move: 2},
        3: {work: 3, carry: 3, move: 2},
        4: {work: 5, carry: 8, move: 8},
        5: {work: 8, carry: 10, move: 10},
        6: {},
        7: {},
        8: {},
    },
    wallRepairer: {
        0: {work: 1, carry: 1, move: 1},
        1: {work: 1, carry: 1, move: 1},
        2: {work: 2, carry: 4, move: 3},
        3: {work: 2, carry: 4, move: 3},
        4: {work: 3, carry: 10, move: 10},
        5: {work: 5, carry: 13, move: 13},
        6: {},
        7: {},
        8: {},
    },
}

var getBody = function(role, level) {
    return bodyConfigs[role][level]
}

var getRoles = function() {
    return Object.keys(bodyConfigs)
}

module.exports = {
    getBody: getBody,
    getRoles: getRoles,
};
