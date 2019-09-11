var names = require('names')
var body_conf = require('body_layouts')

var conf = require('config')

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

var getExtensions = function() {
    return Game.spawns[getSpawnName()].room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION});
}

var selectorMagicNumber = 0

var getRoomLevel = function() {
    return Game.spawns[getSpawnName()].room.controller.level
}

var maxLevelPlannedFor = conf.MAX_LEVEL_PLANNED

var getLevel = function() {
    var level = getRoomLevel()
    while ((getExtensions().length < conf.TARG_EXTENSIONS[level] &&
    level > 1) || level > maxLevelPlannedFor) {
        level -= 1
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
    getLevel: getLevel,
    getMainRoom: getMainRoom,
    getMainSpawn: getMainSpawn,
    getRoomName: getRoomName,
    getSpawnName: getSpawnName,
    logJson: logJson,
    logError: logError,
    bodyRenewValid: bodyRenewValid,
};
