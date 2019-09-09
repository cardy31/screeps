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
    builder:      [[WORK, CARRY, MOVE], [WORK, CARRY, MOVE],
                   [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]],

    harvester:    [[WORK, CARRY, MOVE], [WORK, CARRY, MOVE],
                   [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]],

    repairer:     [[WORK, CARRY, MOVE], [WORK, CARRY, MOVE],
                   [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]],

    upgrader:     [[WORK, CARRY, MOVE], [WORK, CARRY, MOVE],
                   [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]],

    wallRepairer: [[WORK, CARRY, MOVE], [WORK, CARRY, MOVE],
                   [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]]
}

var getBody = function(role, level) {
    return bodyConfigs[role][level]
}

module.exports = {
    body: getBody
};
