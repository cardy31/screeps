let getRooms = function() {
    let rooms = []
    Object.values(Game.spawns).forEach((spawn) => {
        let room = spawn.room
        if (room != null) {
            rooms.push(room)
        }
    })
    return rooms
}

// Note: These array are written assuming 1-indexed levels accessing them (ie. [0] is rarely used)
module.exports = {
    CREEP_TARGETS: {
        'attacker':        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        'builder':         [1, 3, 4, 4, 3, 2, 2, 1, 1],
        'claimer':         [0, 0, 0, 0, 0, 0, 0, 0, 0],
        'harvester':       [1, 2, 4, 4, 4, 2, 2, 1, 1],
        'miner':           [0, 0, 2, 2, 2, 2, 2, 2, 2],
        'repairer':        [0, 1, 2, 1, 0, 0, 0, 0, 0],
        'rampartRepairer': [0, 0, 1, 1, 1, 1, 1, 1, 1],
        'upgrader':        [1, 4, 4, 4, 4, 4, 3, 3, 1],
        'wallRepairer':    [0, 1, 1, 3, 2, 2, 2, 1, 1],
    },
    MAX_LEVEL_PLANNED: 5,
    MINERS_TO_SPAWN: {
        'W15S58': 2,
        'W16S58': 0,
        'W15S59': 0,
        'W16S59': 0,
    },
    MY_ROOMS: ['W15S58', 'W16S58', 'W15S59', 'W16S59'],
    RENEW: false,
    ROLES_IN_PRIORITY_ORDER: ['claimer', 'miner', 'harvester', 'upgrader', 'builder', 'repairer', 'rampartRepairer', 'wallRepairer', 'attacker'],
    // TODO: Set these properly
    SOURCE_AVAILABLE_SPACE: {
        'W15S58': [1, 1],
        'W16S58': [1, 3],
        'W15S59': [1, 1],
        'W16S59': [1],
    },
    TARG_ENERGY: [0, 250, 500, 750, 1100, 1600, 2150, 2500, 2500],
    TARG_EXTENSIONS: [0, 0, 5, 10, 20, 30, 40, 50, 60],
    WALL_STRENGTH: 200000,
}
