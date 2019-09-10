var names = require('names')
var body_conf = require('body_layouts')

// Helpful constants
const ROOM_NAME = Game.spawns['Spawn1'].room
const SPAWN_NAME = 'Spawn1'

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
    return Game.spawns[SPAWN_NAME].room.find(FIND_CREEPS, {filter: (creep) => {return (creep.my)}});
}

var getEnemyCreeps = function() {
    return Game.spawns[SPAWN_NAME].room.find(FIND_CREEPS, {filter: (creep) => {return (!creep.my)}});
}

var getExtensions = function() {
    return Game.spawns[SPAWN_NAME].room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION});
}

var selectorMagicNumber = 0

var getRoomLevel = function() {
    return Game.spawns[SPAWN_NAME].room.controller.level
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

// Exports
module.exports = {
    getRandomInt: getRandomInt,
    getRandomName: getRandomName,
    getEmptyCreepCount: getEmptyCreepCount(),
    selectorMagicNumber: selectorMagicNumber,
    myCreeps: getMyCreeps(),
    enemyCreeps: getEnemyCreeps(),
    extensions: getExtensions(),
    roomLevel: getRoomLevel(),
    level: getLevel(),
    MAIN_ROOM: Game.spawns[SPAWN_NAME].room,
    MAIN_SPAWN: Game.spawns[SPAWN_NAME],
    ROOM_NAME: ROOM_NAME,
    SPAWN_NAME: SPAWN_NAME,
};
