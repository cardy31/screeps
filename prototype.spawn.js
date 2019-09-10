var util = require('utility')
var body_conf = require('body_layouts')
var conf = require('config')

StructureSpawn.prototype.spawnMyCreep = function(role) {
    console.log("Trying to make new " + role)
    const level = util.getLevel()
    const body = body_conf.body(role, level)
    const name = util.getRandomName(roleToName(role) + ' ' + level)
    const memory = getMemory(role)
    ret = this.spawnCreep(body, name, memory)
    console.log(ret)
    return ret
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
