var util = require('utility')

StructureSpawn.prototype.createBasicHarvester = function() {
    const body = [WORK, CARRY, MOVE]
    const name = util.getRandomName('Harvester')
    let memory = getMemory('harvester')
    return this.spawnCreep(body, name, memory)
};

StructureSpawn.prototype.createBigHarvester = function() {
    const body = [CARRY, CARRY, CARRY, MOVE, WORK]
    const name = util.getRandomName('Big Harvester')
    let memory = getMemory('bigHarvester')
    return this.spawnCreep(body, name, memory)
}

StructureSpawn.prototype.createBuilder = function() {
    const body = [WORK, CARRY, MOVE]
    const name = util.getRandomName('Builder')
    const memory = getMemory('builder')
    return this.spawnCreep(body, name, memory)
};

StructureSpawn.prototype.createUpgrader = function() {
    const body = [WORK, CARRY, MOVE]
    const name = util.getRandomName('Upgrader')
    const memory = getMemory('upgrader')
    return this.spawnCreep(body, name, memory)
};

function getMemory(role) {
    return {memory:{role: role, deliver: true, target: null}}
};
