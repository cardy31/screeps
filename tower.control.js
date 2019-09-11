var util = require('utility')

var getTowers = function(room_name) {
    return Game.rooms[room_name].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
}

var towerAttack = function(room_name, towers) {

    var hostiles = util.getHostileCreeps(room_name)
    if (hostiles.length > 0) {
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}

var towerHeal = function(room_name, towers) {
    var myInjuredCreeps = util.getInjuredCreeps(room_name)
    if (myInjuredCreeps.length > 0) {
        towers.forEach(tower => tower.heal(myInjuredCreeps[0]))
    }
}

var runTowers = function(room_name) {
    var towers = getTowers(room_name)
    if (towers.length != 0) {
        towerAttack(room_name, towers)
        towerHeal(room_name, towers)
    }
}

module.exports = {
    runTowers: runTowers,
}
