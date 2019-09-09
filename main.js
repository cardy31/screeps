require('require')
var config = require('config')

var util = require('utility')
var roleBuilder = require('role.builder')
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleRepairer = require('role.repairer')
var roleRenew = require('role.renew')
var roleWallRepairer = require('role.wallRepairer')

// Config
const TARG_HARVESTERS = 3
const TARG_UPGRADERS = 3
const TARG_BUILDERS = 3
const TARG_REPAIRERS = 1
const TARG_WALL_REPAIRERS = 1

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

    let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'harvester');
    let numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role === 'upgrader');
    let numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role === 'builder');
    let numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role === 'repairer');
    let numberOfWallRepairers = _.sum(creepsInRoom, (c) => c.memory.role === 'wallRepairer');

    let build_big = util.MAIN_SPAWN.room.controller.level > 1 && util.getExtensions().length > 3

    // Spawn any new creeps needed
    if (util.MAIN_SPAWN.room.energyAvailable >= 300) {
        if (numberOfHarvesters < TARG_HARVESTERS) {
            if (build_big) {
                util.MAIN_SPAWN.createBigHarvester()
            }
            else {
                console.log("Spawning harvester")
                console.log(util.MAIN_SPAWN.createHarvester())
            }
        }
        else if (numberOfUpgraders < TARG_UPGRADERS) {
            if (build_big) {
                util.MAIN_SPAWN.createBigUpgrader()
            }
            else {
                console.log("Spawning upgrader")
                console.log(util.MAIN_SPAWN.createUpgrader())
            }
        }
        else if (numberOfBuilders < TARG_BUILDERS) {
            if (build_big) {
                util.MAIN_SPAWN.createBigBuilder()
            }
            else {
                util.MAIN_SPAWN.createBuilder()
            }
        }
        else if (numberOfRepairers < TARG_REPAIRERS) {
            if (build_big) {
                util.MAIN_SPAWN.createBigRepairer()
            }
            else {
                util.MAIN_SPAWN.createRepairer()
            }
        }
        else if (numberOfWallRepairers < TARG_WALL_REPAIRERS) {
            if (build_big) {
                util.MAIN_SPAWN.createBigWallRepairer()
            }
            else {
                util.MAIN_SPAWN.createWallRepairer()
            }
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
