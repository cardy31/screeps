require('require')
var conf = require('config')

var util = require('utility')
var roleBuilder = require('role.builder')
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleRepairer = require('role.repairer')
var roleRenew = require('role.renew')
var roleWallRepairer = require('role.wallRepairer')

module.exports.loop = function () {
    // console.log(conf.TARG_EXTENSIONS)
    // Base case. This kicks off rebuilding if we go to zero
    if (Object.keys(Game.creeps).length < 1) {
        util.MAIN_SPAWN.createHarvester()
    }

    // Delete old creeps from memory
    for (var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    let creepsInRoom = util.MAIN_ROOM.find(FIND_MY_CREEPS);

    let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'harvester');
    let numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role === 'upgrader');
    let numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role === 'builder');
    let numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role === 'repairer');
    let numberOfWallRepairers = _.sum(creepsInRoom, (c) => c.memory.role === 'wallRepairer');

    // Spawn any new creeps needed
    if (util.MAIN_SPAWN.room.energyAvailable >= 300) {
        if (numberOfHarvesters < conf.TARG_HARVESTERS) {
            util.MAIN_SPAWN.spawnMyCreep('harvester')
        }
        else if (numberOfUpgraders < conf.TARG_UPGRADERS) {
            util.MAIN_SPAWN.spawnMyCreep('upgrader')
        }
        else if (numberOfBuilders < conf.TARG_BUILDERS) {
            util.MAIN_SPAWN.spawnMyCreep('builder')
        }
        else if (numberOfRepairers < conf.TARG_REPAIRERS) {
            util.MAIN_SPAWN.spawnMyCreep('repairer')
        }
        else if (numberOfWallRepairers < conf.TARG_WALL_REPAIRERS) {
            util.MAIN_SPAWN.spawnMyCreep('wallRepairer')
        }
    }


    // Run various creep programs
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]

        // Renew old creeps
        // TODO: Let small creeps die if we want bigger ones
        // if (creep.ticksToLive < 100) {
        //     roleRenew.run(creep);
        // }
        // else {
            switch(creep.memory.role) {
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'repairer':
                    roleRepairer.run(creep);
                    break;
                case 'wallRepairer':
                    roleWallRepairer.run(creep);
                    break;
                default:
                    console.log(creep.name + " is stuck?")
            }
        // } // end 'else'
    }
}
