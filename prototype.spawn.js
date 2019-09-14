// var util = require('utility')
var body_conf = require('body_layouts')
var conf = require('config')
var names = require('names')
var util = require('utility')

StructureSpawn.prototype.spawnMyCreep = function(role, level, room_name) {
    console.log(this.name, "trying to make new level", level, role)
    const body = buildBody(role, level)
    var memory = getMemory(role, room_name)
    const name = getRandomName(roleToName(role) + ' ' + level)
    ret = this.spawnCreep(body, name, memory)
    console.log("Response:", util.responseToString(ret))
    return ret
}

function roleToName(role) {
    switch(role) {
        case 'builder':
            return 'Builder'
        case 'claimer':
            return 'Claimer'
        case 'harvester':
            return 'Harvester'
        case 'repairer':
            return 'Repairer'
        case 'upgrader':
            return 'Upgrader'
        case 'wallRepairer':
            return 'Wall Repairer'
        default:
            console.log("Undefined role: " + role)
            return role
    }
}

function buildBody(role, level) {
    let bodyConfig = body_conf.getBody(role, level)
    let build = []

    for (var key in bodyConfig) {
        for (let i = 0; i < bodyConfig[key]; i++) {
            build.push(key)
        }
    }
    return build
}

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

var getMemory = function(role, room_name) {
    return {memory:{role: role, deliver: true, target: null, target_room: room_name}}
}
