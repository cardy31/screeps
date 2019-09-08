require('require')

var util = require('utility')
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')

// Config
TARG_HARVESTERS = 2
TARG_UPGRADERS = 1
TARG_BUILDERS = 1

module.exports.loop = function () {
    // Base case. This kicks off rebuilding if we go to zero
    if (Object.keys(Game.creeps).length < 1) {
        util.MAIN_SPAWN.createHarvester()
    }

    // Count current creeps
    let creepsInRoom = util.MAIN_SPAWN.room.find(FIND_CREEPS);

    let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'harvester');
    let numberOfUpgraders  = _.sum(creepsInRoom, (c) => c.memory.role === 'upgrader');
    let numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role === 'builder');

    // Spawn any new ones needed
    if (numberOfHarvesters < TARG_HARVESTERS) {
        util.MAIN_SPAWN.createHarvester()
    }
    else if (numberOfUpgraders < TARG_UPGRADERS) {
        util.MAIN_SPAWN.createUpgrader()
    }
    else if (numberOfBuilders < TARG_BUILDERS) {
        util.MAIN_SPAWN.createBuilder()
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name]
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break
            case 'upgrader':
                roleUpgrader.run(creep);
                break
            case 'builder':
                roleBuilder.run(creep);
                break
        }
    }
}
