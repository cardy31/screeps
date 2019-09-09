var util = require('utility')

var MAIN_SPAWN = util.MAIN_SPAWN

Creep.prototype.Construct = function() {
    this.memory.deliver = true

    // Find nearest site
    var site = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    // If there is one, build it
    if (site !== undefined) {
        if (this.build(site) === ERR_NOT_IN_RANGE) {
            this.moveTo(site)
        }
    }
    // No construction sites. Fall back to upgrading
    else {
        console.log(this.name + " fell back to upgrading")
        this.Upgrade()
    }
};

Creep.selector = 0

Creep.prototype.Harvest = function() {
    var sources = this.room.find(FIND_SOURCES);

    // Select source to harvest from
    if (this.memory.target == null) {
        // TODO: Make this better
        // This is currently written for a room where source 1 has 4 spots and source 0 has 1 spot. So we have a 4:1 ratio of selecting source 1 over source 0
        Creep.selector += 1
        if (Creep.selector > util.selectorMagicNumber) {
            Creep.selector = 0
        }

        if (Creep.selector > 0) {
            this.memory.target = 1
        }
        else {
            this.memory.target = 0
        }
    }

    if(this.harvest(sources[this.memory.target]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sources[this.memory.target]);
    }
};

Creep.prototype.Reset = function() {
    this.memory.deliver = false
    this.memory.target = null
};

Creep.prototype.StoreEnergy = function() {
    this.memory.deliver = true

    // Get possible energy transfer targets
    var targets = this.room.find(FIND_STRUCTURES, { filter: (structure) => {
            return (structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION) &&
                    structure.energy < structure.energyCapacity;
        }
    });

    if (targets.length > 0) {
        // Spawn or Extension
        if (this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(targets[0])
        }
    }
    else {
        console.log(this.name + " fell back to constructing")
        this.Construct()
    }
};

Creep.prototype.Upgrade = function() {
    this.memory.deliver = true

    if (this.transfer(util.MAIN_ROOM.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(util.MAIN_ROOM.controller);
    }
};
