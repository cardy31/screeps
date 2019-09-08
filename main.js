require('require')

var util = require('utility')
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader')

// Config
TARG_HARVESTERS = 2
TARG_UPGRADERS = 1

module.exports.loop = function () {
    // Base case. This kicks off rebuilding if we go to zero
    console.log("Spawn: " + util.MAIN_SPAWN)
    if (Object.keys(Game.creeps).length < 1) {
        console.log("Creating Harvester")
        util.MAIN_SPAWN.createHarvester()
    }

    // Count current creeps
    let creepsInRoom = util.MAIN_SPAWN.room.find(FIND_CREEPS);
    console.log("Creeps: " + creepsInRoom)

    let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'harvester');
    let numberOfUpgraders  = _.sum(creepsInRoom, (c) => c.memory.role === 'upgrader');

    console.log("Harvesters: " + numberOfHarvesters)
    console.log("Upgraders: " + numberOfUpgraders)

    // Spawn any new ones needed
    if (numberOfHarvesters < TARG_HARVESTERS) {
        console.log("Creating harvester")
        util.MAIN_SPAWN.createHarvester()
    }
    // if (numberOfUpgraders < TARG_UPGRADERS) {
    //     util.MAIN_SPAWN.createUpgrader()
    // }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name]
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
            case 'upgrader':
                roleUpgrader.run(creep);
        }
    }
}
