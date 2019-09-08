require('require')

var util = require('utility')
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')

// Config
TARG_HARVESTERS = 1
TARG_UPGRADERS = 1
TARG_BUILDERS = 4
TARG_BIG_HARVERSTERS = 2


module.exports.loop = function () {
    // Base case. This kicks off rebuilding if we go to zero
    if (Object.keys(Game.creeps).length < 1) {
        util.MAIN_SPAWN.createBasicHarvester()
    }

    // Count current creeps
    let creepsInRoom = util.MAIN_SPAWN.room.find(FIND_CREEPS);

    let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'harvester');
    let numberOfUpgraders  = _.sum(creepsInRoom, (c) => c.memory.role === 'upgrader');
    let numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role === 'builder');
    let numberOfBigHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'bigHarvester');

    // Spawn any new creeps needed
    if (numberOfHarvesters < TARG_HARVESTERS) {
        util.MAIN_SPAWN.createBasicHarvester()
    }
    else if (numberOfUpgraders < TARG_UPGRADERS) {
        util.MAIN_SPAWN.createUpgrader()
    }
    else if (numberOfBuilders < TARG_BUILDERS) {
        util.MAIN_SPAWN.createBuilder()
    }
    else if (numberOfBigHarvesters < TARG_BIG_HARVERSTERS) {
        util.MAIN_SPAWN.createBigHarvester()
    }

    // Run various creep programs
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]
        switch(creep.memory.role) {
            case 'bigHarvester':
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
