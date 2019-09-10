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

var maxLevelPlannedFor = 2

var getLevel = function() {
    var level = getRoomLevel()
    while (getExtensions().length < conf.TARG_EXTENSIONS[getRoomLevel()] &&
    level > 1 && level > maxLevelPlannedFor) {
        level -= 1
    }
    return level
}

var getEmptyCreepCount = function() {
    creepCount = {}
    let roles = body_conf.roles
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
};
