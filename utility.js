var names = require('names')
var body_conf = require('body_layouts')

var conf = require('config')

var myRooms = ['E33N41', 'E36N41', 'E37N42']

var getRandomName = function(prefix){
    var name, isNameTaken, tries = 0;
    do {
        var nameArray = Math.random() > .5 ? names.names1 : names.names2;
        name = nameArray[Math.floor(Math.random() * nameArray.length)];

        if (tries > 3){
            name += nameArray[Math.floor(Math.random() * nameArray.length)];
        }

        tries++;
        isNameTaken = Game.creeps[name] !== undefined;
    } while (isNameTaken);

    return prefix+" "+name;
};

var getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getMyCreeps = function() {
    return Game.spawns[getSpawnName()].room.find(FIND_CREEPS, {filter: (creep) => {return (creep.my)}});
}

var getEnemyCreeps = function() {
    return Game.spawns[getSpawnName()].room.find(FIND_CREEPS, {filter: (creep) => {return (!creep.my)}});
}

var getExtensions = function(room_name) {
    return Game.rooms[room_name].find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION});
}

var selectorMagicNumber = 0

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
    creepCount = {}
    let roles = body_conf.getRoles()
    for (let i = 0; i < roles.length; i++) {
        creepCount[roles[i]] = 0
    }
    return creepCount
}

var getMainRoom = function() {
    return Game.spawns[getSpawnName()].room
}

var getMainSpawn = function() {
    return Game.spawns[getSpawnName()]
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

var getRoomName = function() {
    return Game.spawns[getSpawnName()].room.name
}

var getSpawnName = function() {
    return names.spawnName
}

var logJson = function(thing_to_print) {
    console.log(JSON.stringify(thing_to_print))
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

var getMemory = function(role, room_name) {
    return {memory:{role: role, deliver: true, target: null, target_room: room_name}}
}

var census = function() {
    var myCreeps = Game.creeps
    var creepsByRoom = {}
    var creepNamesByRoom = {}
    var i = 0
    // Count creeps in each controlled room
    for (const[key, val] of Object.entries(myCreeps)) {
        i += 1
        // console.log("That i",i)
        var creep = myCreeps[key]
        if (creep.memory.target_room != undefined &&
            creep.memory.target_room in creepsByRoom) {
            creepsByRoom[creep.memory.target_room][creep.memory.role] += 1
        }
        else if (creep.memory.target_room != undefined) {
            creepsByRoom[creep.memory.target_room] = getEmptyCreepCount()
            creepsByRoom[creep.memory.target_room][creep.memory.role] = 1
        }

        if (creep.memory.target_room in creepNamesByRoom) {
            creepNamesByRoom[creep.memory.target_room].push(creep.name)

        }
        else {
            creepNamesByRoom[creep.memory.target_room] = []
            creepNamesByRoom[creep.memory.target_room].push(creep.name)
        }
    }
    return [creepsByRoom, creepNamesByRoom]
}

var clearOldMemory = function() {
    for (var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

var getHostileCreeps = function(room_name) {
    return Game.rooms[room_name].find(FIND_HOSTILE_CREEPS);
}

var getInjuredCreeps = function(room_name) {
    return Game.rooms[room_name].find(FIND_MY_CREEPS, {filter: (c) => c.hits < c.hitsMax});
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
    getRandomInt: getRandomInt,
    getRandomName: getRandomName,
    getEmptyCreepCount: getEmptyCreepCount,
    getSelectorMagicNumber: selectorMagicNumber,
    getMyCreeps: getMyCreeps,
    getEnemyCreeps: getEnemyCreeps,
    getExtensions: getExtensions,
    getRoomLevel: getRoomLevel,
    getCreepsByRoom: getCreepsByRoom,
    getLevel: getLevel,
    getMainRoom: getMainRoom,
    getMainSpawn: getMainSpawn,
    getCorrectSpawn: getCorrectSpawn,
    getRoomName: getRoomName,
    getSpawnName: getSpawnName,
    getHostileCreeps: getHostileCreeps,
    getInjuredCreeps: getInjuredCreeps,
    logJson: logJson,
    logError: logError,
    bodyRenewValid: bodyRenewValid,
    responseToString: responseToString,
    myRooms: myRooms,
    getMemory: getMemory,
    census: census,
    clearOldMemory: clearOldMemory,
};
