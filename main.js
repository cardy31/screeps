require('require')

var util = require('utility')
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader')

// Config
TARG_HARVESTERS = 2
TARG_UPGRADERS = 1

module.exports.loop = function () {
    // Base case. This kicks off rebuilding if we go to zero
    if (Object.keys(Game.creeps).length < 1) {
        util.MAIN_SPAWN.createHarvester()
    }

    // Count current creeps
    let creepsInRoom = util.MAIN_SPAWN.room.find(FIND_CREEPS);

    let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'harvester');
    let numberOfUpgraders  = _.sum(creepsInRoom, (c) => c.memory.role === 'upgrader');

    // Spawn any new ones needed
    if (numberOfHarvesters < TARG_HARVESTERS) {
        util.MAIN_SPAWN.createHarvester()
    }
    if (numberOfUpgraders < TARG_UPGRADERS) {
        util.MAIN_SPAWN.createUpgrader()
    }

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
