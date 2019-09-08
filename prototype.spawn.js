var util = require('utility')

StructureSpawn.prototype.createHarvester = function() {
    var body = [WORK, CARRY, MOVE]
    var name = util.getRandomName('Harvester')
    var memory = {memory:{role:'harvester', deliver: true, target: null}}
    return this.spawnCreep(body, name, memory)
};

StructureSpawn.prototype.createUpgrader = function() {
    var body = [WORK, CARRY, MOVE]
    var name = util.getRandomName('Upgrader')
    var memory = {memory:{role:'upgrader', deliver: true}}
    return this.spawnCreep(body, name, memory)
};

StructureSpawn.prototype.createBuilder = function() {
    var body = [WORK, CARRY, MOVE]
    var name = util.getRandomName('Builder')
    var memory = getMemory('builder')
    return this.spawnCreep(body, name, memory)
};

function getMemory(role) {
    return {memory:{role: role, deliver: true}}
}
