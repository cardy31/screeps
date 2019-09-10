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
        util.getMainSpawn().createHarvester()
    }

    // Delete old creeps from memory
    for (var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    let creepsInRoom = util.getMainRoom().find(FIND_MY_CREEPS);
    var creepCount = util.getEmptyCreepCount()
    let roles = body_conf.roles

    for (key in creepCount) {
        creepCount[key] = 0
    }

    for (let i = 0; i < creepsInRoom.length; i++) {
        creepCount[creepsInRoom[i].memory.role] += 1
    }

    var current_level = util.getLevel()

    // Spawn any new creeps needed
    if (util.getMainRoom().energyAvailable >= conf.TARG_ENERGY[current_level]) {
        if (creepCount['harvester'] < conf.TARG_HARVESTERS) {
            util.getMainSpawn().spawnMyCreep('harvester')
        }
        else if (creepCount['upgrader'] < conf.TARG_UPGRADERS) {
            util.getMainSpawn().spawnMyCreep('upgrader')
        }
        else if (creepCount['builder'] < conf.TARG_BUILDERS) {
            util.getMainSpawn().spawnMyCreep('builder')
        }
        else if (creepCount['repairer'] < conf.TARG_REPAIRERS) {
            util.getMainSpawn().spawnMyCreep('repairer')
        }
        else if (creepCount['wallRepairer'] < conf.TARG_WALL_REPAIRERS) {
            util.getMainSpawn().spawnMyCreep('wallRepairer')
        }
    }

    // Run various creep programs
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]

        // Renew old creeps that are still at the correct level
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
