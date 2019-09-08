var util = require('utility')

StructureSpawn.prototype.createHarvester = function() {
    var body = [WORK, CARRY, MOVE]
    var name = util.getRandomName('Harvester')
    var memory = {memory:{role:'harvester', deliver: false, target: null}}
    return this.spawnCreep(body, name, memory)
};

StructureSpawn.prototype.createUpgrader = function() {
    var body = [WORK, CARRY, MOVE]
    var name = util.getRandomName('Upgrader')
    var memory = {memory:{role:'upgrader', deliver: false}}
    return this.spawnCreep(body, name, memory)
};
