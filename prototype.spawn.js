var util = require('utility')
var body_conf = require('body_layouts')
var conf = require('config')

StructureSpawn.prototype.spawnMyCreep = function(role) {
    console.log("Trying to make new " + role)
    const level = util.getLevel()
    const body = buildBody(role, level)
    const name = util.getRandomName(roleToName(role) + ' ' + level)
    const memory = getMemory(role)
    console.log("Level: " + level)
    console.log("Body: " + body)
    ret = this.spawnCreep(body, name, memory)
    console.log(ret)
    return ret
}

function getMemory(role) {
    return {memory:{role: role, deliver: true, target: null, renew: false}}
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
