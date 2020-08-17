require('require')
const Census = require('census')
const conf = require('config')
const roleAttacker = require('role.attacker')
const roleBuilder = require('role.builder')
const roleClaimer = require('role.claimer')
const roleHarvester = require('role.harvester')
const roleMiner = require('role.miner')
const roleUpgrader = require('role.upgrader')
const roleRampartRepairer = require('role.rampartRepairer')
const roleRepairer = require('role.repairer')
const roleWallRepairer = require('role.wallRepairer')
const towerControl = require('tower.control')
const util = require('utility')

util.clearOldMemory()

module.exports.loop = function () {
    const census = new Census()
    const allCreeps = Game.creeps

    for (let key in Object.keys(conf.MY_ROOMS)) {
        const room = Game.rooms[conf.MY_ROOMS[key]]
        if (room == null) {
            continue;
        }

        if (roomHasNoCreeps(room)) {
            spawnStarterCreep(room)
        }

        room.energySourceAvailableSpace = conf.SOURCE_AVAILABLE_SPACE[room.name] // the room that each source has for creeps
        room.creepsAssignedToEnergySource = census.getCreepsAssignedToEnergySource(room.name) // the counted number of creeps assigned to each source
        towerControl.runTowers(room.name)

        const currentLevel = util.getLevel(room.name)
        const energyAvailable = room.energyAvailable
        let creepCount = census.getCreepsByRoom(room.name)

        if (creepCount == null) {
            creepCount = census.getEmptyCreepCount()
        }

        logRoomStatus(room, creepCount, currentLevel)

        if (shouldSpawnClaimer(currentLevel, census.totalClaimers)) {
            spawnClaimer(room, currentLevel)
            census.totalClaimers += 1
        } else if (shouldSpawnCreeps(energyAvailable, currentLevel, room)) {
            // TODO: Should this entry condition allow for miners if the room has enough energy for a miner but not the other stuff?
            spawnCreeps(creepCount, currentLevel, room.name)
        }

        let creepsForRoom = census.getCreepNamesByRoom(room.name)
        for (let i = 0; i < creepsForRoom.length; i++) {
            // TODO: This allCreeps step shouldn't be necessary
            let creep = allCreeps[creepsForRoom[i]]
            runCreepRole(creep)
        }
    }
    console.log()
}

let roomHasNoCreeps = function(room) {
    return room.find(FIND_MY_CREEPS).length < 1
}

let spawnStarterCreep = function(room) {
    util.getCorrectSpawn(room.name).spawnMyCreep('harvester', 1, room.name)
}

let logRoomStatus = function(room, creepCount, currentLevel) {
    console.log(room.name + ":", JSON.stringify(creepCount), "level:", currentLevel)
}

let shouldSpawnCreeps = function(energyAvailable, currentLevel) {
    return energyAvailable >= conf.TARG_ENERGY[currentLevel]
}

let shouldSpawnClaimer = function(currentLevel, totalClaimers) {
    return currentLevel >= 3 && Game.flags['Flag1'] != null && totalClaimers === 0
}

let spawnClaimer = function(room, currentLevel) {
    const spawn = room.find(FIND_MY_SPAWNS)[0]
    if (spawn != null) {
        spawn.spawnMyCreep('claimer', currentLevel, room.name)
    }
}

let spawnCreeps = function(creepCount, currentLevel, roomName) {
    const spawn = util.getCorrectSpawn(roomName)
    for (let i = 0; i < conf.ROLES_IN_PRIORITY_ORDER.length; i++) {
        let role = conf.ROLES_IN_PRIORITY_ORDER[i]
        if (role === 'repairer' && getTowers(roomName).length > 0) {
            continue
        }
        if (creepCount[role] < conf.CREEP_TARGETS[role][currentLevel]) {
            spawn.spawnMyCreep(role, currentLevel, roomName)
            break;
        }
    }
}

let getTowers = function(roomName) {
    return Game.rooms[roomName].find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}})
}

let runCreepRole = function(creep) {
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
        case 'miner':
            roleMiner.run(creep);
            break;
        case 'rampartRepairer':
            roleRampartRepairer.run(creep);
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
