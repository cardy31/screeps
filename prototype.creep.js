var util = require('utility')

Creep.prototype.Upgrade = function() {
    this.memory.deliver = true

    if (this.transfer(util.MAIN_ROOM.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(util.MAIN_ROOM.controller);
    }
};

Creep.prototype.Harvest = function() {
    var sources = this.room.find(FIND_SOURCES);

    if (this.memory.target == null) {
        this.memory.target = util.getRandomInt(0, sources.length - 1)
    }

    if(this.harvest(sources[this.memory.target]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sources[this.memory.target]);
    }
};

Creep.prototype.StoreEnergy = function() {
    this.memory.deliver = true

    // TODO: Make this work for multiple containers
    // Deliver to spawn iff the spawn isn't at max capacity
    if (MAIN_SPAWN.energyCapacity > MAIN_SPAWN.energy &&
        this.transfer(MAIN_SPAWN, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(MAIN_SPAWN);
    }
};

Creep.prototype.Reset = function() {
    this.memory.deliver = false
    this.memory.target = null
};
