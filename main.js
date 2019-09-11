require('require')
var conf = require('config')
var body_conf = require('body_layouts')

var util = require('utility')
var roleBuilder = require('role.builder')
var roleClaimer = require('role.claimer')
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleRepairer = require('role.repairer')
var roleRenew = require('role.renew')
var roleWallRepairer = require('role.wallRepairer')

module.exports.loop = function () {
    let myCreeps = Game.creeps

    var creepsByRoom = {}

    // Count creeps in each controlled room
    for (const[key, val] of Object.entries(myCreeps)) {
        var creep = myCreeps[key]
        if (creep.memory.target_room != undefined &&
            creep.memory.target_room in creepsByRoom) {
            creepsByRoom[creep.memory.target_room][creep.memory.role] += 1
        }
        else if (creep.memory.target_room != undefined) {
            creepsByRoom[creep.memory.target_room] = util.getEmptyCreepCount()
            creepsByRoom[creep.memory.target_room][creep.memory.role] = 1
        }
    }

    for (var k = 0; k < util.myRooms.length; k++) {
        room = Game.rooms[util.myRooms[k]]

        // Base case. This kicks off rebuilding if we go to zero
        if (Object.keys(Game.creeps).length < 1) {
            util.getMainSpawn().spawnMyCreep('harvester', 1, room.name)
        }

        // Delete old creeps from memory
        for (var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }

        let creepsInRoom = room.find(FIND_MY_CREEPS);
        var creepCount = util.getEmptyCreepCount()
        let roles = body_conf.roles

        for (key in creepCount) {
            creepCount[key] = 0
        }

        if (creepsByRoom[room.name] != undefined) {
            creepCount = creepsByRoom[room.name]
        }
        else {
            for (let i = 0; i < creepsInRoom.length; i++) {

                creepCount[creepsInRoom[i].memory.role] += 1
            }
        }

        let current_level = util.getLevel(room.name)
        let energyAvail = util.getMainRoom().energyAvailable

        console.log(room.name + ":", JSON.stringify(creepCount), "level:", current_level)

        // Spawn any new creeps needed
        if (energyAvail >= conf.TARG_ENERGY[current_level]) {
            if (creepCount['harvester'] < conf.TARG_HARVESTERS[current_level]) {
                util.getCorrectSpawn(room.name).spawnMyCreep('harvester', current_level, room.name)
            }
            else if (creepCount['claimer'] < conf.TARG_CLAIMERS[current_level]) {
                util.getCorrectSpawn(room.name).spawnMyCreep('claimer', current_level, room.name)
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
            else if(creep.memory.target_room != undefined && creep.memory.target_room != creep.room.name) {
                creep.moveTo(Game.flags["RoomToClaim"], {reusePath: 30})
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
