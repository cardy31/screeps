var util = require('utility')
var body_conf = require('body_layouts')
var conf = require('config')

StructureSpawn.prototype.spawnMyCreep = function(role) {
    const level = util.level
    const body = body_conf.body(role, level)
    const name = util.getRandomName(roleToName(role) + ' ' + level)
    const memory = getMemory(role)
    return this.spawnCreep(body, name, memory)
}

function getMemory(role) {
    return {memory:{role: role, deliver: true, target: null}}
};

function roleToName(role) {
    switch(role) {
        case 'harvester':
            return 'Harvester'
        case 'upgrader':
            return 'Upgrader'
        case 'builder':
            return 'Builder'
        case 'repairer':
            return 'Repairer'
        case 'wallRepairer':
            return 'Wall Repairer'
        default:
            console.log("Undefined role: " + role)
            return role
    }
}
