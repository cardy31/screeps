const util = require('utility')
const conf = require('config')

Creep.prototype.Attack = function() {
    let hostiles = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    if (hostiles != null && this.attack(hostiles[0]) === ERR_NOT_IN_RANGE) {
        this.moveTo(hostiles[0])
    }
    else {
        this.moveTo(Game.rooms[this.memory.target_room].controller)
    }
}

Creep.prototype.Claim = function() {
    const flag = Game.flags["Flag1"]
    const room = flag.room
    if (room == null) {
        this.moveTo(flag)
    }
    else {
        let response = this.claimController(room.controller)
        if (response === ERR_NOT_IN_RANGE) {
            console.log(this.name + "Moving towards controller")
            this.moveTo(flag.room.controller)
        } else if (response === OK) {
            this.suicide()
        } else {
            util.logError("Claim is going poorly")
        }
    }
}

Creep.prototype.CollectEnergy = function() {
    const containers = util.getContainers(this.room.name)

    const nearbyEnergy = findNearbyEnergy(this)
    if (nearbyEnergy.length > 0) {
        this.pickup(nearbyEnergy[0])
    } else if (this.memory.containerTarget == null){
        if (containers.length === 1) {
            this.memory.containerTarget = 0
        } else {
            let closestContainer = this.pos.findClosestByPath(FIND_STRUCTURES,
          {
                    filter: (s) => s.structureType === STRUCTURE_CONTAINER
                });
            if (containers[0] === closestContainer) {
                this.memory.containerTarget = 0
            } else {
                this.memory.containerTarget = 1
            }
        }
    }

    // Withdraw energy
    if(this.memory.containerTarget != null && this.withdraw(containers[this.memory.containerTarget], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(containers[this.memory.containerTarget]);
    }
}

Creep.prototype.Construct = function() {
    this.StartDelivery()

    // Prioritize building extensions
    let extensions = this.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) =>
    s.structureType === STRUCTURE_EXTENSION ||
    s.structureType === STRUCTURE_SPAWN});

    if (extensions.length !== 0) {
        if (this.build(extensions[0]) === ERR_NOT_IN_RANGE) {
            this.moveTo(extensions[0])
        }
    }
    // Build everything else if there are no extensions to build
    else {
        let site = this.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);

        // If there is one, build it
        if (site != null && this.build(site) === ERR_NOT_IN_RANGE) {
            this.moveTo(site)
        } else {
            this.Upgrade()
        }
    }
};

Creep.prototype.DeliveryIsFinished = function() {
    return this.store[RESOURCE_ENERGY] === 0 && this.memory.deliver
}

Creep.prototype.HarvestEnergy = function() {
    const sources = this.room.find(FIND_SOURCES);

    const nearbyEnergy = findNearbyEnergy(this)
    if (nearbyEnergy.length > 0) {
        this.pickup(nearbyEnergy[0])
    }
    else if (this.memory.target == null){
        if (sources.length === 1) {
            this.memory.target = 0
        } else {
            let valueOfLeastCongestedEnergySource = 100000
            let index = 0

            if (this.room.energySourceAvailableSpace == null) {
                util.logError("Energy Source space has not been defined")
            }

            for (let i = 0; i < this.room.energySourceAvailableSpace.length; i++) {
                if (this.room.creepsAssignedToEnergySource[i] < this.room.energySourceAvailableSpace[i]) {
                    this.memory.target = i
                    this.room.creepsAssignedToEnergySource[i]++
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
                this.room.creepsAssignedToEnergySource[index]++
            }
        }
    }

    if(this.memory.target != null && this.harvest(sources[this.memory.target]) === ERR_NOT_IN_RANGE) {
        this.moveTo(sources[this.memory.target]);
    }
}

Creep.prototype.Mine = function() {
    const containers = util.getContainers(this.room.name)
    if (containers.length === 1) {
        this.memory.minerContainerTarget = 0
    } else if (this.memory.minerContainerTarget == null) {
        for (let i = 0; i < this.room.energySourceAvailableSpace.length; i++) {
            if (this.room.creepsAssignedToEnergySource[i] < this.room.energySourceAvailableSpace[i]) {
                this.memory.minerContainerTarget = i
                this.room.creepsAssignedToEnergySource[i]++
            }
        }
    }
    if (this.memory.minerContainerTarget != null) {
        const container = containers[this.memory.minerContainerTarget]
        if (this.pos.x !== container.pos.x || this.pos.y !== container.pos.y) {
            this.moveTo(container)
        }
        else if (container.store.getFreeCapacity() === 0) {

        }
        else {
            if (this.memory.source_id == null) {
                this.memory.source_id = this.pos.findClosestByPath(FIND_SOURCES).id
            }
            this.harvest(Game.getObjectById(this.memory.source_id))
        }
    }
}

Creep.prototype.NeedsEnergy = function() {
    return this.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && this.memory.deliver === false
}

Creep.prototype.Repair = function() {
    this.StartDelivery()

    // Find nearest structure needing repair
    let structure = this.pos.findClosestByPath(FIND_STRUCTURES,
        { filter: (s) => s.hits < s.hitsMax &&
                        s.structureType !== STRUCTURE_WALL &&
                        s.structureType !== STRUCTURE_RAMPART
    });

    // If there is one, repair it
    if (structure != null) {
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
    this.memory.containerTarget = null
};

Creep.prototype.ShouldHarvestEnergy = function() {
    return util.getContainers(this.room.name).length < this.room.find(FIND_SOURCES).length
}

Creep.prototype.ShouldMoveToDifferentRoom = function() {
    return this.memory.target_room != null && this.memory.target_room !== this.room.name
}

Creep.prototype.StartDelivery = function() {
    if (this.memory.deliver === false || this.memory.deliver == null) {
        this.memory.deliver = true
        this.room.creepsAssignedToEnergySource[this.memory.target] -= 1
    }
}

Creep.prototype.StoreEnergy = function() {
    this.StartDelivery()

    // Get possible energy transfer targets
    const structure = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
            return ((structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_EXTENSION ||
                    (structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 100)) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        }
    });

    if (structure != null) {
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

Creep.prototype.Work = function(jobToPerform, context) {
    if (this.DeliveryIsFinished()) {
        this.ResetMemoryFlags()
    }

    if (this.ShouldMoveToDifferentRoom()) {
        this.Travel()
    } else if (this.ShouldHarvestEnergy() && this.NeedsEnergy()) {
        this.HarvestEnergy()
    } else if (this.NeedsEnergy()) {
        this.CollectEnergy()
    } else {
        // If a creep is in a room where no spawn is built yet
        if (this.room.find(FIND_MY_SPAWNS).length === 0) {
            if (this.memory.role === 'upgrader' && this.room.controller.ticksToDowngrade < 3000) {
                jobToPerform.apply(context)
            } else {
                this.Construct()
            }
        }
        else {
            jobToPerform.apply(context)
        }
    }
}

let findNearbyEnergy = function(creep) {
    return creep.pos.findInRange(
        FIND_DROPPED_RESOURCES,
        1,
        {filter: (r) => r.resourceType === RESOURCE_ENERGY});
}

let roomHasNoSpawns = function(room) {
    return room.find(FIND_MY_SPAWNS).length === 0
}
