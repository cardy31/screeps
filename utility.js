const names = require('names')
const body_conf = require('body_layouts')

const conf = require('config')

let getExtensions = function(room_name) {
    return Game.rooms[room_name].find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION});
}

let getRoomLevel = function(room_name) {
    return Game.rooms[room_name].controller.level
}

let maxLevelPlannedFor = conf.MAX_LEVEL_PLANNED

let getLevel = function(room_name) {
    let level = getRoomLevel(room_name)
    while ((getExtensions(room_name).length < conf.TARG_EXTENSIONS[level] &&
    level > 1) || level > maxLevelPlannedFor || Game.rooms[room_name].find(FIND_MY_CREEPS).length < level) {
        level -= 1
        if (level == 1) {
            break;
        }
    }
    return level
}

let getEmptyCreepCount = function() {
    let creepCount = {}
    let roles = body_conf.getRoles()
    for (let i = 0; i < roles.length; i++) {
        creepCount[roles[i]] = 0
    }
    return creepCount
}

let getMainRoom = function() {
    return Game.rooms[conf.MY_ROOMS[0]]
}

let getMainSpawn = function() {
    return getMainRoom().find(FIND_MY_SPAWNS)[0]
}

let getCorrectSpawn = function(room_name) {
    let spawns = Game.rooms[room_name].find(FIND_MY_SPAWNS)
    if (spawns.length === 0) {
        return getMainSpawn()
    }
    else {
        return spawns[0]
    }
}

let logJson = function(thing_to_print) {
    console.log(JSON.stringify(thing_to_print))
}

let js = function(input) {
    return JSON.stringify(input)
}

let logError = function(thing_to_print) {
    console.log("ERROR: " + thing_to_print)
}

let bodyRenewValid = function(creep, current_level) {
    let bodyInfoRaw = creep.body
    let bodyInfoGood = []
    for (let i = 0; i < bodyInfoRaw.length; i++) {
        bodyInfoGood.push(bodyInfoRaw[i].type)
    }
    let creep_body = body_conf.body(creep.memory.role, current_level)
    console.log("Renew: " + (creep_body.toString() === bodyInfoGood.toString()))
    return (creep_body.toString() === bodyInfoGood.toString())
};

let responseToString = function(responseCode) {
    switch(responseCode) {
        case 0:
            return "OK";
        case -1:
            return "ERR_NOT_OWNER";
        case -3:
            return "ERR_NAME_EXISTS";
        case -4:
            return "ERR_BUSY";
        case -6:
            return "ERR_NOT_ENOUGH_ENERGY";
        case -10:
            return "ERR_INVALID_ARGS";
        case -14:
            return "ERR_RCL_NOT_ENOUGH";
        default:
            return responseCode;
    }
}

let census = function() {
    const myCreeps = Game.creeps
    let creepsByRoom = {}
    let creepNamesByRoom = {}
    let sourceTrack = {}
    // Count creeps in each controlled room
    for (const key of Object.keys(myCreeps)) {
        let creep = myCreeps[key]
        if (creep.memory.target_room !== undefined) {
            if (creep.memory.target_room in creepsByRoom) {
                creepsByRoom[creep.memory.target_room][creep.memory.role] += 1
            }
            else {
                creepsByRoom[creep.memory.target_room] = getEmptyCreepCount()
                creepsByRoom[creep.memory.target_room][creep.memory.role] = 1
            }
        }

        // Counting creeps by room
        if (creep.memory.target_room in creepNamesByRoom) {
            creepNamesByRoom[creep.memory.target_room].push(creep.name)
        }
        else {
            creepNamesByRoom[creep.memory.target_room] = []
            creepNamesByRoom[creep.memory.target_room].push(creep.name)
        }

        // Count creeps at each source by room
        if (!(creep.memory.target_room in sourceTrack)) {
            sourceTrack[creep.memory.target_room] = []

            let targ_length = Game.rooms[creep.memory.target_room].find(FIND_SOURCES).length
            for (let i = 0; i < targ_length; i++) {
                sourceTrack[creep.memory.target_room].push(0)
            }
        }
        if (creep.memory.target != null) {
            sourceTrack[creep.memory.target_room][creep.memory.target] += 1
        }
    }
    return [creepsByRoom, creepNamesByRoom, sourceTrack]
}

let clearOldMemory = function() {
    for (let creep in Memory.creeps) {
        if(!Game.creeps[creep]) {
            delete Memory.creeps[creep];
        }
    }
}

let getCreepsByRoom = function() {
    let allCreeps = Game.creeps
    let creepDict = {}

    for (const key of Object.keys(allCreeps)) {
        const creepRoom = allCreeps[key].memory.target_room
        if (!(creepRoom in creepDict)) {
            creepDict[creepRoom] = []
        }
        creepDict[creepRoom].push(allCreeps[key].name)
    }
    return creepDict
}

// Exports
module.exports = {
    bodyRenewValid: bodyRenewValid,
    census: census,
    clearOldMemory: clearOldMemory,
    getEmptyCreepCount: getEmptyCreepCount,
    getExtensions: getExtensions,
    getRoomLevel: getRoomLevel,
    getCreepsByRoom: getCreepsByRoom,
    getLevel: getLevel,
    getMainRoom: getMainRoom,
    getMainSpawn: getMainSpawn,
    getCorrectSpawn: getCorrectSpawn,
    js: js,
    logJson: logJson,
    logError: logError,
    responseToString: responseToString,
};
