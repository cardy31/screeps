const conf = require("./config");

let getTowers = function(roomName) {
    return Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
}

let getHostileCreeps = function(roomName) {
    return Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
}

let getInjuredCreeps = function(roomName) {
    return Game.rooms[roomName].find(FIND_MY_CREEPS, {filter: (c) => c.hits < c.hitsMax});
}

let getNormalDamagedStructures = function(roomName) {
    return Game.rooms[roomName].find(FIND_STRUCTURES,
        { filter: (s) => s.hits < s.hitsMax &&
                        s.structureType !== STRUCTURE_WALL &&
                        s.structureType !== STRUCTURE_RAMPART
    });
}

let getDamagedFortifications = function(roomName) {
    return Game.rooms[roomName].find(FIND_STRUCTURES,
        {
            filter: (s) => s.hits < conf.WALL_STRENGTH &&
                s.structureType === STRUCTURE_WALL ||
                s.structureType === STRUCTURE_RAMPART
        })
}

let towerAttack = function(room_name, towers, hostiles) {
    towers.forEach(tower => tower.attack(hostiles[0]));
}

let towerHeal = function(room_name, towers, injuredCreeps) {
    towers.forEach(tower => tower.heal(injuredCreeps[0]));
}

let towerRepair = function(room_name, towers, normalRepairsNeeded, fortificationRepairsNeeded) {
    towers.forEach(tower => {
        if (tower.energy > tower.energyCapacity / 2) {
            if (normalRepairsNeeded.length > 0) {
                tower.repair(normalRepairsNeeded[0])
            } else if (fortificationRepairsNeeded.length > 0) {
                let min = 100000000000
                let fortificationToRepair = null
                for (let i = 0; i < fortificationRepairsNeeded.length; i++) {
                    if (fortificationRepairsNeeded[i].hits < min) {
                        min = fortificationRepairsNeeded[i].hits
                        fortificationToRepair = fortificationRepairsNeeded[i]
                    }
                }
                tower.repair(fortificationToRepair);
            }
        }
    });
}

// TODO: Iterate over all towers in a room to react to changing state based on what prior towers did.
let runTowers = function(roomName) {
    const towers = getTowers(roomName)
    if (towers.length !== 0) {
        const hostiles = getHostileCreeps(roomName)
        const injuredCreeps = getInjuredCreeps(roomName)
        const normalRepairsNeeded = getNormalDamagedStructures(roomName)
        const fortificationRepairs = getDamagedFortifications(roomName)
        if (hostiles.length > 0) {
            towerAttack(roomName, towers, hostiles)
        }
        else if (injuredCreeps.length > 0) {
            towerHeal(roomName, towers, injuredCreeps)
        }
        else if (normalRepairsNeeded || fortificationRepairs) {
            towerRepair(roomName, towers, normalRepairsNeeded, fortificationRepairs)
        }
    }
}

module.exports = {
    runTowers: runTowers,
}
