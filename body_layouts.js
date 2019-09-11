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

var bodyConfigs = {
    builder: {
        0: {work: 1, carry: 1, move: 1},
        1: {work: 1, carry: 1, move: 1},
        2: {work: 3, carry: 3, move: 2},
        3: {work: 3, carry: 3, move: 2},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
    },
    harvester: {
        0: {work: 1, carry: 1, move: 1},
        1: {work: 1, carry: 1, move: 1},
        2: {work: 3, carry: 3, move: 2},
        3: {work: 3, carry: 3, move: 2},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
    },
    repairer: {
        0: {work: 1, carry: 1, move: 1},
        1: {work: 1, carry: 1, move: 1},
        2: {work: 2, carry: 4, move: 3},
        3: {work: 2, carry: 4, move: 3},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
    },
    upgrader: {
        0: {work: 1, carry: 1, move: 1},
        1: {work: 1, carry: 1, move: 1},
        2: {work: 3, carry: 3, move: 2},
        3: {work: 3, carry: 3, move: 2},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
    },
    wallRepairer: {
        0: {work: 1, carry: 1, move: 1},
        1: {work: 1, carry: 1, move: 1},
        2: {work: 2, carry: 4, move: 3},
        3: {work: 2, carry: 4, move: 3},
        4: {},
        5: {},
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
