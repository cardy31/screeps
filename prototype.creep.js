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
    if (room == null) {
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

Creep.prototype.CollectEnergy = function() {
    const containers = util.getContainers(this.room.name)

    const nearbyEnergy = findNearbyEnergy(this)
    if (nearbyEnergy.length > 0) {
        this.pickup(nearbyEnergy[0])
    } else if (this.memory.containerTarget == null){
        if (containers.length === 1) {
            this.memory.containerTarget = 0
        } else {
            this.memory.containerTarget = Math.floor((Math.random() * 2))
        }
    }

    // Withdraw energy
    if(this.memory.containerTarget != null && this.withdraw(containers[this.memory.containerTarget], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(containers[this.memory.containerTarget]);
    }
    else {
        // TODO: Fix this hack later
        this.memory.containerTarget += 1
        this.memory.containerTarget %= 2
    }
}

Creep.prototype.Construct = function() {
    this.StartDelivery()

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
    if (this.ticksToLive === 1 && this.memory.minerContainerTarget != null) {
        this.room.creepsAssignedToEnergySource[this.memory.minerContainerTarget]--
    } else {
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
    }
    if (this.memory.minerContainerTarget != null) {
        const container = containers[this.memory.minerContainerTarget]
        if (this.pos.x !== container.pos.x || this.pos.y !== container.pos.y) {
            this.moveTo(container)
        }
        else {
            if (this.memory.source_id == null) {
                this.memory.source_id = this.pos.findClosestByPath(FIND_SOURCES).id
            }
            this.harvest(Game.getObjectById(this.memory.source_id))
        }
    }
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

Creep.prototype.RepairRamparts = function() {
    this.StartDelivery()

    let ramparts = this.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_RAMPART
    });

    let target = null

    for (let percentage = 0.0000; percentage < 1; percentage += 0.01) {
        for (let rampart of ramparts) {
            if (rampart.hits / rampart.hitsMax < percentage) {
                target = rampart
                break
            }
        }

        if (target != null) {
            break
        }
    }
    if (target != null) {
        if (this.repair(target) === ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }
    else {
        this.WallRepair()
    }
}

Creep.prototype.ResetMemoryFlags = function() {
    this.memory.deliver = false
    this.memory.target = null
};

Creep.prototype.ShouldCollectEnergy = function() {
    return this.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && this.memory.deliver === false
}

Creep.prototype.ShouldHarvestEnergy = function() {
    return util.getContainers(this.room.name).length < this.room.find(FIND_SOURCES).length
}

Creep.prototype.ShouldMoveToDifferentRoom = function() {
    return this.memory.target_room != null && this.memory.target_room !== this.room.name
}

Creep.prototype.StartDelivery = function() {
    if (this.memory.deliver === false) {
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
                    structure.structureType === STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity)
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

Creep.prototype.WallRepair = function() {
    this.StartDelivery()

    // Find nearest wall or rampart needing repair
    let structure = this.pos.findClosestByPath(FIND_STRUCTURES,
        { filter: (s) => s.hits < conf.WALL_STRENGTH &&
                        (s.structureType === STRUCTURE_WALL ||
                        s.structureType === STRUCTURE_RAMPART)
    });

    if (structure != null) {
        if (this.repair(structure) === ERR_NOT_IN_RANGE) {
            this.moveTo(structure);
        }
    }
    else {
        this.Upgrade()
    }
}

Creep.prototype.Work = function(jobToPerform, context) {
    if (this.DeliveryIsFinished()) {
        this.ResetMemoryFlags()
    }

    if (this.ShouldMoveToDifferentRoom()) {
        this.Travel()
    } else if (this.ShouldHarvestEnergy()) {
        this.HarvestEnergy()
    } else if (this.ShouldCollectEnergy()) {
        this.CollectEnergy()
    } else {
        jobToPerform.apply(context)
    }
}

let findNearbyEnergy = function(creep) {
    return creep.pos.findInRange(
        FIND_DROPPED_RESOURCES,
        1,
        {filter: (r) => r.resourceType === RESOURCE_ENERGY});
}