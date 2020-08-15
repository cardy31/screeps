let getTowers = function(room_name) {
    return Game.rooms[room_name].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
}

let getHostileCreeps = function(room_name) {
    return Game.rooms[room_name].find(FIND_HOSTILE_CREEPS);
}

let getInjuredCreeps = function(room_name) {
    return Game.rooms[room_name].find(FIND_MY_CREEPS, {filter: (c) => c.hits < c.hitsMax});
}

var getDamagedStructures = function(room_name) {
    return Game.rooms[room_name].find(FIND_STRUCTURES,
        { filter: (s) => s.hits < s.hitsMax &&
                        s.structureType !== STRUCTURE_WALL &&
                        s.structureType !== STRUCTURE_RAMPART
    });
}

let towerAttack = function(room_name, towers, hostiles) {
    towers.forEach(tower => tower.attack(hostiles[0]));
}

let towerHeal = function(room_name, towers, injuredCreeps) {
    towers.forEach(tower => tower.heal(injuredCreeps[0]));
}

let towerRepair = function(room_name, towers, repairsNeeded) {
    towers.forEach(tower => {
        if (tower.energy > tower.energyCapacity / 2) {
            tower.repair(repairsNeeded[0]);
        }
    });
}

let runTowers = function(room_name) {
    const hostiles = getHostileCreeps(room_name)
    const injuredCreeps = getInjuredCreeps(room_name)
    const repairsNeeded = getDamagedStructures(room_name)
    const towers = getTowers(room_name)
    if (towers.length !== 0) {
        if (hostiles.length > 0) {
            towerAttack(room_name, towers, hostiles)
        }
        else if (injuredCreeps.length > 0) {
            towerHeal(room_name, towers, injuredCreeps)
        }
        else if (repairsNeeded.length > 0) {
            towerRepair(room_name, towers, repairsNeeded)
        }
    }
}

module.exports = {
    runTowers: runTowers,
}
