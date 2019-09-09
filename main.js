require('require')
var conf = require('config')
var body_conf = require('body_layouts')

var util = require('utility')
var roleBuilder = require('role.builder')
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleRepairer = require('role.repairer')
var roleRenew = require('role.renew')
var roleWallRepairer = require('role.wallRepairer')

module.exports.loop = function () {
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
    let creepCounts = {}
    for (let i = 0; i < creepsInRoom.length; i++) {
        let role = creepsInRoom[i].memory.role
        if (role in creepCounts) {
            creepCounts[role] += 1
        }
        else {
            creepCounts[role] = 1
        }
    }

    // Spawn any new creeps needed
    if (util.MAIN_SPAWN.room.energyAvailable >= 300) {
        if (creepCounts['harvester'] < conf.TARG_HARVESTERS) {
            util.MAIN_SPAWN.spawnMyCreep('harvester')
        }
        else if (creepCounts['upgrader'] < conf.TARG_UPGRADERS) {
            util.MAIN_SPAWN.spawnMyCreep('upgrader')
        }
        else if (creepCounts['builder'] < conf.TARG_BUILDERS) {
            util.MAIN_SPAWN.spawnMyCreep('builder')
        }
        else if (creepCounts['repairer'] < conf.TARG_REPAIRERS) {
            util.MAIN_SPAWN.spawnMyCreep('repairer')
        }
        else if (creepCounts['wallRepairer'] < conf.TARG_WALL_REPAIRERS) {
            util.MAIN_SPAWN.spawnMyCreep('wallRepairer')
        }
    }

    var current_level = util.level

    // Run various creep programs
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]

        // Renew old creeps
        // TODO: Let small creeps die if we want bigger ones
        if (creep.ticksToLive < 100 &&
            body_conf.body(creep.memory.role, current_level) == creep.body) {
            roleRenew.run(creep)
        }
        else {
            // Run roles
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
        }
    }
}
