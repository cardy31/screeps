var names = require('names')
var body_conf = require('body_layouts')

var conf = require('config')

var getExtensions = function(room_name) {
    return Game.rooms[room_name].find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION});
}

var getRoomLevel = function(room_name) {
    return Game.rooms[room_name].controller.level
}

var maxLevelPlannedFor = conf.MAX_LEVEL_PLANNED

var getLevel = function(room_name) {
    var level = getRoomLevel(room_name)
    while ((getExtensions(room_name).length < conf.TARG_EXTENSIONS[level] &&
    level > 1) || level > maxLevelPlannedFor || Game.rooms[room_name].find(FIND_MY_CREEPS).length < level) {
        level -= 1
        if (level == 1) {
            break;
        }
    }
    return level
}

var getEmptyCreepCount = function() {
    var creepCount = {}
    let roles = body_conf.getRoles()
    for (let i = 0; i < roles.length; i++) {
        creepCount[roles[i]] = 0
    }
    return creepCount
}

var getMainRoom = function() {
    return Game.rooms[conf.MY_ROOMS[0]]
}

var getMainSpawn = function() {
    return getMainRoom().find(FIND_MY_SPAWNS)[0]
}

var getCorrectSpawn = function(room_name) {
    var spawns = Game.rooms[room_name].find(FIND_MY_SPAWNS)
    if (spawns.length == 0) {
        return getMainSpawn()
    }
    else {
        return spawns[0]
    }
}

var logJson = function(thing_to_print) {
    console.log(JSON.stringify(thing_to_print))
}

var js = function(input) {
    return JSON.stringify(input)
}

var logError = function(thing_to_print) {
    console.log("ERROR: " + thing_to_print)
}

var bodyRenewValid = function(creep, current_level) {
    let bodyInfoRaw = creep.body
    var bodyInfoGood = []
    for (let i = 0; i < bodyInfoRaw.length; i++) {
        bodyInfoGood.push(bodyInfoRaw[i].type)
    }
    let creep_body = body_conf.body(creep.memory.role, current_level)
    console.log("Renew: " + (creep_body.toString() == bodyInfoGood.toString()))
    return (creep_body.toString() == bodyInfoGood.toString())
};

var responseToString = function(responseCode) {
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

var census = function() {
    var myCreeps = Game.creeps
    var creepsByRoom = {}
    var creepNamesByRoom = {}
    var sourceTrack = {}
    // Count creeps in each controlled room
    for (const[key, val] of Object.entries(myCreeps)) {
        var creep = myCreeps[key]
        if (creep.memory.target_room != undefined &&
            creep.memory.target_room in creepsByRoom) {
            creepsByRoom[creep.memory.target_room][creep.memory.role] += 1
        }
        else if (creep.memory.target_room != undefined) {
            creepsByRoom[creep.memory.target_room] = getEmptyCreepCount()
            creepsByRoom[creep.memory.target_room][creep.memory.role] = 1
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

            var targ_length = Game.rooms[creep.memory.target_room].find(FIND_SOURCES).length
            for (var i = 0; i < targ_length; i++) {
                sourceTrack[creep.memory.target_room].push(0)
            }
        }
        if (creep.memory.target != null) {
            sourceTrack[creep.memory.target_room][creep.memory.target] += 1
        }
    }
    return [creepsByRoom, creepNamesByRoom, sourceTrack]
}

var clearOldMemory = function() {
    for (var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

var getCreepsByRoom = function() {
    var allCreeps = Game.creeps
    var creepDict = {}

    for (const [key, val] of Object.entries(allCreeps)) {
        var creepRoom = allCreeps[key].memory.target_room
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
