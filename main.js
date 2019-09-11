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
        util.getMainSpawn().spawnMyCreep('harvester')
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

    let current_level = util.getLevel()
    let energyAvail = util.getMainRoom().energyAvailable
    // Spawn any new creeps needed
    if (energyAvail >= conf.TARG_ENERGY[current_level]) {
        if (creepCount['harvester'] < conf.TARG_HARVESTERS[current_level]) {
            util.getMainSpawn().spawnMyCreep('harvester', current_level)
        }
        else if (creepCount['upgrader'] < conf.TARG_UPGRADERS[current_level]) {
            util.getMainSpawn().spawnMyCreep('upgrader', current_level)
        }
        else if (creepCount['builder'] < conf.TARG_BUILDERS[current_level]) {
            util.getMainSpawn().spawnMyCreep('builder', current_level)
        }
        else if (creepCount['repairer'] < conf.TARG_REPAIRERS[current_level]) {
            util.getMainSpawn().spawnMyCreep('repairer', current_level)
        }
        else if (creepCount['wallRepairer'] < conf.TARG_WALL_REPAIRERS[current_level]) {
            util.getMainSpawn().spawnMyCreep('wallRepairer', current_level)
        }
    }

    // Run various creep programs
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]

        // Renew old creeps that are still at the correct level
        if (conf.RENEW && ((creep.memory.renew ||
            (creep.ticksToLive < 100 && util.bodyRenewValid(creep, current_level))) &&
            energyAvail >= 150))
        {

            console.log(creep.name + " renewing")

            if (creep.ticksToLive < 1400) {
                creep.memory.renew = true
                roleRenew.run(creep)
            }
            else {
                creep.memory.renew = false
            }
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
