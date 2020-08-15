const util = require('utility')
const conf = require('config')

Creep.prototype.Attack = function() {
    let hostiles = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    if (hostiles != null && this.attack(hostiles[0]) === ERR_NOT_IN_RANGE) {
        this.moveTo(hostiles[0])
    }
}

Creep.prototype.Claim = function() {
    const flag = Game.flags["RoomToClaim2"]
    const room = flag.room
    if (room === undefined) {
        this.moveTo(flag)
    }
    else {
        if (this.claimController(room.controller) === ERR_NOT_IN_RANGE) {
            console.log(this.name + "Moving towards controller")
            this.moveTo(flag.room.controller)
        }
        else {
            util.logError("Claim is going poorly")
        }
    }
}

Creep.prototype.Construct = function() {
    this.memory.deliver = true

    // Prioritize building extensions
    let extensions = this.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) =>
    s.structureType === STRUCTURE_EXTENSION ||
    s.structureType === STRUCTURE_WALL});

    if (extensions.length !== 0) {
        if (this.build(extensions[0]) === ERR_NOT_IN_RANGE) {
            this.moveTo(extensions[0])
        }
    }
    // Build everything else if there are no extensions to build
    else {
        let site = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

        // If there is one, build it
        if (site != null) {
            if (this.build(site) === ERR_NOT_IN_RANGE) {
                this.moveTo(site)
            }
        }
        else {
            if (this.room.energyAvailable < this.room.energyCapacityAvailable) {
                this.StoreEnergy()
            }
            else {
                if (this.memory.role === 'wallRepair') {
                    this.Upgrade()
                }
                else {
                    this.WallRepair()
                }
            }
        }
    }
};

Creep.prototype.Harvest = function() {
    const sources = this.room.find(FIND_SOURCES);

    let nearbyEnergy = this.pos.findInRange(
        FIND_DROPPED_RESOURCES,
        1,
    {filter: (r) => r.resourceType === RESOURCE_ENERGY});

    if (nearbyEnergy.length > 0) {
        this.pickup(nearbyEnergy[0])
    }
    else if (this.memory.target == null){
        if (sources.length === 1) {
            this.memory.target = 0
        }
        else {
            let valueOfLeastCongestedEnergySource = 100000
            let index = 0

            for (let i = 0; i < this.room.energySourceAvailableSpace.length; i++) {
                if (this.room.creepsAssignedToEnergySource[i] < this.room.energySourceAvailableSpace[i]) {
                    this.memory.target = i
                    break;
                }

                let energySourceCongestion = this.room.creepsAssignedToEnergySource[i] / this.room.energySourceAvailableSpace[i]
                if (energySourceCongestion < valueOfLeastCongestedEnergySource) {
                    valueOfLeastCongestedEnergySource = energySourceCongestion
                    index = i
                }
            }
            if (this.memory.target == null) {
                this.memory.target = index
                this.room.creepsAssignedToEnergySource[index] += 1
            }
        }
    }

    if(this.memory.target != null && this.harvest(sources[this.memory.target]) === ERR_NOT_IN_RANGE) {
        this.moveTo(sources[this.memory.target]);
    }
};

Creep.prototype.Repair = function() {
    this.memory.deliver = true

    // Find nearest structure needing repair
    let structure = this.pos.findClosestByPath(FIND_STRUCTURES,
        { filter: (s) => s.hits < s.hitsMax &&
                        s.structureType !== STRUCTURE_WALL &&
                        s.structureType !== STRUCTURE_RAMPART
    });

    // If there is one, repair it
    if (structure !== undefined) {
        if (this.repair(structure) === ERR_NOT_IN_RANGE) {
            this.moveTo(structure);
        }
    }
    // Otherwise build stuff
    else {
        this.Construct()
    }
}

Creep.prototype.ResetMemoryFlags = function() {
    this.memory.deliver = false
    this.memory.target = null
};

Creep.prototype.StoreEnergy = function() {
    this.memory.deliver = true

    // Get possible energy transfer targets
    const structure = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
            return ((structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity)
        }
    });

    if (structure !== undefined) {
        // Spawn
        if (this.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(structure)
        }
    }
    else {
        this.Upgrade()
    }
};

Creep.prototype.Travel = function() {
    const moveReturnValue = this.moveTo(Game.rooms[this.memory.target_room].controller)
    if (moveReturnValue === ERR_INVALID_TARGET) {
        util.logError("Invalid target on creep", this.name)
    }
}

Creep.prototype.Upgrade = function() {
    this.memory.deliver = true

    if (this.upgradeController(Game.rooms[this.memory.target_room].controller) === ERR_NOT_IN_RANGE) {
        this.moveTo(Game.rooms[this.memory.target_room].controller);
    }
};

Creep.prototype.WallRepair = function() {
    this.memory.deliver = true

    // Find nearest structure needing repair
    let structure = this.pos.findClosestByPath(FIND_STRUCTURES,
        { filter: (s) => s.hits < conf.WALL_STRENGTH &&
                        (s.structureType === STRUCTURE_WALL ||
                        s.structureType === STRUCTURE_RAMPART)
    });

    // If there is one, repair it
    if (structure !== undefined) {
        if (this.repair(structure) === ERR_NOT_IN_RANGE) {
            this.moveTo(structure);
        }
    }
    // Otherwise build stuff
    else {
        // console.log(this.name + " fell back on upgrading")
        this.Upgrade()
    }
}
