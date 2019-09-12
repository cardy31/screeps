require('require')
var conf = require('config')
var body_conf = require('body_layouts')
var towerControl = require('tower.control')

var util = require('utility')
var roleBuilder = require('role.builder')
var roleClaimer = require('role.claimer')
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleRepairer = require('role.repairer')
var roleRenew = require('role.renew')
var roleWallRepairer = require('role.wallRepairer')

module.exports.loop = function () {
    var creepsByRoom = util.census()
    util.clearOldMemory()

    for (key in Object.keys(util.myRooms)) {
        var room = Game.rooms[util.myRooms[key]]

        if (room == undefined) {
            continue;
        }

        towerControl.runTowers(room.name)

        // Base case. This kicks off rebuilding if we go to zero
        if (room.find(FIND_MY_CREEPS).length < 1) {
            util.getCorrectSpawn(room_name).spawnMyCreep('harvester', 1, room.name)
        }

        var current_level = util.getLevel(room.name)
        var energyAvail = util.getMainRoom().energyAvailable
        var creepCount = creepsByRoom[room.name]

        if (creepCount == undefined) {
            creepCount = util.getEmptyCreepCount()
        }

        console.log(room.name + ":", JSON.stringify(creepCount), "level:", current_level)

        // Spawn any new creeps needed
        if (energyAvail >= conf.TARG_ENERGY[current_level]) {
            if (creepCount['claimer'] < conf.TARG_CLAIMERS[current_level]) {
                util.getCorrectSpawn(room.name).spawnMyCreep('claimer', current_level, room.name)
            }
            else if (creepCount['harvester'] < conf.TARG_HARVESTERS[current_level]) {
                util.getCorrectSpawn(room.name).spawnMyCreep('harvester', current_level, room.name)
            }
            else if (creepCount['upgrader'] < conf.TARG_UPGRADERS[current_level]) {
                util.getCorrectSpawn(room.name).spawnMyCreep('upgrader', current_level, room.name)
            }
            else if (creepCount['builder'] < conf.TARG_BUILDERS[current_level]) {
                util.getCorrectSpawn(room.name).spawnMyCreep('builder', current_level, room.name)
            }
            else if (creepCount['repairer'] < conf.TARG_REPAIRERS[current_level]) {
                util.getCorrectSpawn(room.name).spawnMyCreep('repairer', current_level, room.name)
            }
            else if (creepCount['wallRepairer'] < conf.TARG_WALL_REPAIRERS[current_level]) {
                util.getCorrectSpawn(room.name).spawnMyCreep('wallRepairer', current_level, room.name)
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
            // Make creeps more to a different room if needed
            else if(creep.memory.role != 'claimer' &&
            creep.memory.target_room != undefined &&
            creep.memory.target_room != creep.room.name) {
                creep.moveTo(Game.flags["RoomToClaim2"])

                // if (Game.rooms[creep.memory.target_room] != undefined) {
                //     console.log("Move1:", creep.moveTo(Game.rooms[creep.memory.target_room]))
                // }
                // else {
                //     console.log("Move2:",creep.moveTo(Game.flags["RoomToClaim2"]))
                // }
            }
            else {
                // Run roles
                switch(creep.memory.role) {
                    case 'builder':
                        roleBuilder.run(creep);
                        break;
                    case 'claimer':
                        roleClaimer.run(creep);
                        break;
                    case 'harvester':
                        roleHarvester.run(creep);
                        break;
                    case 'repairer':
                        roleRepairer.run(creep);
                        break;
                    case 'upgrader':
                        roleUpgrader.run(creep);
                        break;
                    case 'wallRepairer':
                        roleWallRepairer.run(creep);
                        break;
                    default:
                        util.logError(creep.name, "was not assigned a role")
                }
            }
        }
    }
    console.log()
}
