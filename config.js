// Note: These array are written assuming 1-indexed levels accessing them (ie. [0] is rarely used)
module.exports = {
    CREEP_TARGETS: {
        'attacker':     [0, 0, 1, 1, 1, 1, 1, 1, 1],
        'builder':      [1, 3, 5, 4, 3, 2, 2, 1, 1],
        'claimer':      [0, 0, 0, 0, 0, 0, 0, 0, 0],
        'harvester':    [1, 2, 5, 4, 4, 2, 2, 1, 1],
        'repairer':     [0, 1, 2, 0, 0, 0, 0, 0, 0],
        'upgrader':     [1, 4, 5, 4, 4, 4, 3, 3, 1],
        'wallRepairer': [0, 1, 2, 3, 2, 2, 2, 1, 1],
    },
    MAX_LEVEL_PLANNED: 5,
    MY_ROOMS: ['W15S58'],
    RENEW: false,
    ROLES_IN_PRIORITY_ORDER: ['claimer', 'harvester', 'upgrader', 'builder', 'repairer', 'wallRepairer', 'attacker'],
    SOURCE_AVAILABLE_SPACE: {
        W15S58: [4, 1],
        SIM: [3, 3, 4],
    },
    TARG_ENERGY: [0, 250, 500, 750, 1100, 1600, 2150, 2500, 2500],
    TARG_EXTENSIONS: [0, 0, 5, 10, 20, 30, 40, 50, 60],
    WALL_STRENGTH: 200000,
}
