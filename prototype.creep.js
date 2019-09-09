var util = require('utility')

var MAIN_SPAWN = util.MAIN_SPAWN

Creep.prototype.Construct = function() {
    this.memory.deliver = true

    // Find nearest site
    var extensions = this.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) =>
    s.structureType == STRUCTURE_EXTENSION});

    if (extensions !== undefined) {
        if (this.build(extensions[0]) === ERR_NOT_IN_RANGE) {
            this.moveTo(extensions[0])
        }
    }
    else {
        var site = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

        // If there is one, build it
        if (site !== undefined) {
            if (this.build(site) === ERR_NOT_IN_RANGE) {
                this.moveTo(site)
            }
        }
        // No construction sites. Fall back to upgrading
        else {
            this.Upgrade()
        }
    }
};

Creep.selector = 0

Creep.prototype.Harvest = function() {
    var sources = this.room.find(FIND_SOURCES);

    var nearbyEnergy = this.pos.findInRange(
        FIND_DROPPED_RESOURCES,
        1
    );

    if (nearbyEnergy.length > 0) {
        this.pickup(nearbyEnergy[0])
    }
    else {
        // Select source to harvest from
        if (this.memory.target == null) {
            if (util.selectorMagicNumber == 0) {
                this.memory.target = util.selectorMagicNumber
                util.selectorMagicNumber += 1
                console.log("Magic number: " + util.selectorMagicNumber)
            }
            else {
                this.memory.target = util.selectorMagicNumber
                util.selectorMagicNumber = 0
                console.log("Magic number: " + util.selectorMagicNumber)
            }
        }
    }

    if(this.memory.target != null && this.harvest(sources[this.memory.target]) == ERR_NOT_IN_RANGE) {
        this.moveTo(sources[this.memory.target]);
    }
};

Creep.prototype.Repair = function() {
    this.memory.deliver = true

    // Find nearest structure needing repair
    let structure = this.pos.findClosestByPath(FIND_STRUCTURES,
        { filter: (s) => s.hits < s.hitsMax &&
                        s.structureType != STRUCTURE_WALL &&
                        s.structureType != STRUCTURE_RAMPART
    });

    // If there is one, repair it
    if (structure != undefined) {
        if (this.repair(structure) == ERR_NOT_IN_RANGE) {
            this.moveTo(structure);
        }
    }
    // Otherwise build stuff
    else {
        this.Construct()
    }
}

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
        this.Construct()
    }
};

Creep.prototype.Upgrade = function() {
    this.memory.deliver = true

    if (this.transfer(util.MAIN_ROOM.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(util.MAIN_ROOM.controller);
    }
};

Creep.prototype.WallRepair = function() {
    this.memory.deliver = true

    // Find nearest structure needing repair
    let structure = this.pos.findClosestByPath(FIND_STRUCTURES,
        { filter: (s) => s.hits < 50000 &&
                        (s.structureType == STRUCTURE_WALL ||
                        s.structureType == STRUCTURE_RAMPART)
    });

    // If there is one, repair it
    if (structure != undefined) {
        if (this.repair(structure) == ERR_NOT_IN_RANGE) {
            this.moveTo(structure);
        }
    }
    // Otherwise build stuff
    else {
        console.log(this.name + " fell back on constructing")
        this.Construct()
    }
}
