// var util = require('utility')
var body_conf = require('body_layouts')
var conf = require('config')
var util = require('utility')

StructureSpawn.prototype.spawnMyCreep = function(role, level, room) {
    console.log("Trying to make new", role)
    const body = buildBody(role, level)
    var memory = util.getMemory(role, room)
    const name = util.getRandomName(roleToName(role) + ' ' + level)
    console.log("Level:", level)
    console.log("Body:", body)
    console.log("Memory:", JSON.stringify(memory))
    ret = this.spawnCreep(body, name, memory)
    console.log("Response:", util.responseToString(ret))
    console.log()
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
