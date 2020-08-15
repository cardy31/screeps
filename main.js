const conf = require('config')
const towerControl = require('tower.control')

const util = require('utility')
const roleAttacker = require('role.attacker')
const roleBuilder = require('role.builder')
const roleClaimer = require('role.claimer')
const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleRepairer = require('role.repairer')
const roleRenew = require('role.renew')
const roleWallRepairer = require('role.wallRepairer')
util.clearOldMemory()

module.exports.loop = function () {
    const ret = util.census()
    const creepsCountByRoom = ret[0]
    const creepsByRoom = ret[1]
    const sourceTrack = ret[2]
    const allCreeps = Game.creeps

    for (let key in Object.keys(conf.MY_ROOMS)) {
        const room = Game.rooms[conf.MY_ROOMS[key]]

        if (room === undefined) {
            continue;
        }

        // sourceSpace is the room that each source has for creeps
        room.sourceSpace = conf.SOURCE_SPACE[room.name]
        // sourceTrack is the counted number of creeps assigned to each source
        room.sourceTrack = sourceTrack[room.name]

        towerControl.runTowers(room.name)

        // Base case. This kicks off rebuilding if we go to zero
        if (room.find(FIND_MY_CREEPS).length < 1) {
            util.getCorrectSpawn(room.name).spawnMyCreep('harvester', 1, room.name)
        }

        const current_level = util.getLevel(room.name)
        const energyAvail = room.energyAvailable
        let creepCount = creepsCountByRoom[room.name]

        if (creepCount === undefined) {
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
            else if (creepCount['attacker'] < conf.TARG_ATTACKERS[current_level]) {
                util.getCorrectSpawn(room.name).spawnMyCreep('attacker', current_level, room.name)
            }
        }

        // Run various creep programs
        let creepsForRoom = creepsByRoom[room.name]
        if (creepsForRoom === undefined) {
            creepsForRoom = util.getEmptyCreepCount()
        }
        for (let i = 0; i < creepsForRoom.length; i++) {
            let creep = allCreeps[creepsForRoom[i]]

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
                    case 'attacker':
                        roleAttacker.run(creep);
                        break;
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
