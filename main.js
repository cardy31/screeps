require('require')
require('lodash')

var util = require('utility')
var roleBuilder = require('role.builder')
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleRepairer = require('role.repairer')
var roleRenew = require('role.renew')

// Config
const TARG_HARVESTERS = 0
const TARG_UPGRADERS = 3
const TARG_BUILDERS = 3
const TARG_BIG_HARVERSTERS = 3
const TARG_REPAIRER = 1


module.exports.loop = function () {
    // Base case. This kicks off rebuilding if we go to zero
    if (Object.keys(Game.creeps).length < 1) {
        util.MAIN_SPAWN.createHarvester()
    }

    // Count my current creeps
    let creepsInRoom = util.getMyCreeps();

    let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'harvester');
    let numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role === 'upgrader');
    let numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role === 'builder');
    let numberOfBigHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'bigHarvester');
    let numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role === 'repairer');

    // Spawn any new creeps needed
    if (numberOfHarvesters < TARG_HARVESTERS) {
        util.MAIN_SPAWN.createHarvester()
    }
    else if (numberOfBigHarvesters < TARG_BIG_HARVERSTERS) {
        util.MAIN_SPAWN.createBigHarvester()
    }
    else if (numberOfUpgraders < TARG_UPGRADERS) {
        if (util.MAIN_SPAWN.room.controller.level > 1) {
            util.MAIN_SPAWN.createBigUpgrader()
        }
        else {
            util.MAIN_SPAWN.createUpgrader()
        }
    }
    else if (numberOfBuilders < TARG_BUILDERS) {
        if (util.MAIN_SPAWN.room.controller.level > 1) {
            util.MAIN_SPAWN.createBigBuilder()
        }
        else {
            util.MAIN_SPAWN.createBuilder()
        }
    }
    else if (numberOfRepairers < TARG_REPAIRERS) {
        util.MAIN_SPAWN.createRepairer()
    }


    // Run various creep programs
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]

        if (creep.ticksToLive < 50) {
            roleRenew.run(creep);
        }
        else {
            switch(creep.memory.role) {
                case 'bigHarvester':
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'bigUpgrader':
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'bigBuilder':
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'repairer':
                    roleRepairer.run(creep);
                    break;
                default:
                    console.log(creep.name + " is stuck?")
            }
        }
    }
}
