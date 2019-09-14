var util = require('utility')
var conf = require('config')

Creep.prototype.Attack = function() {
    var hostiles = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    if (hostiles != undefined && this.attack(hostiles[0] == ERR_NOT_IN_RANGE)) {
        this.moveTo(hostiles[0])
    }
}

Creep.prototype.Claim = function() {
    var flag = Game.flags["RoomToClaim2"]
    // this.moveTo(flag)
    var room = flag.room
    if (room == undefined) {
        this.moveTo(flag)
    }
    else {
        if (this.claimController(room.controller) == ERR_NOT_IN_RANGE) {
            console.log(this.name + "Moving towards controller")
            this.moveTo(flag.room.controller)
        }
        // else {
        //     util.logError("Claim is going poorly")
        // }
    }
}

Creep.prototype.Construct = function() {
    this.memory.deliver = true

    // Prioritize building extensions
    var extensions = this.room.find(FIND_CONSTRUCTION_SITES, {filter: (s) =>
    s.structureType == STRUCTURE_EXTENSION ||
    s.structureType == STRUCTURE_WALL});

    if (extensions.length != 0) {
        if (this.build(extensions[0]) === ERR_NOT_IN_RANGE) {
            this.moveTo(extensions[0])
        }
    }
    // Build everything else if there are no extensions to build
    else {
        var site = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

        // If there is one, build it
        if (site !== null) {
            if (this.build(site) === ERR_NOT_IN_RANGE) {
                this.moveTo(site)
            }
        }
        // No construction sites. Fall back to upgrading
        else {
            // console.log(this.creep.room.name, "has no building sites!")
            if (this.room.energyAvailable < this.room.energyCapacityAvailable) {
                // console.log(this.name + " falling back to storing energy")
                this.StoreEnergy()
            }
            else {
                // console.log(this.name + " falling back to wall repair")
                this.WallRepair()
            }
        }
    }
};

Creep.selector = 0

Creep.prototype.Harvest = function() {
    var sources = this.room.find(FIND_SOURCES);

    var nearbyEnergy = this.pos.findInRange(
        FIND_DROPPED_RESOURCES,
        1,
    {filter: (r) => r.resourceType == RESOURCE_ENERGY});

    if (nearbyEnergy.length > 0) {
        this.pickup(nearbyEnergy[0])
    }
    else if (this.memory.target == null){
        if (sources.length == 1) {
            console.log("Only one source found")
            this.memory.target = 0
        }
        else if (sources[0].energy == 0) {
            this.memory.target = 1
        }
        else if (sources[1].energy == 0) {
            this.memory.target = 0
        }
        else {
            for (var i = 0; i < this.room.sourceSpace.length; i++) {
                if (this.room.sourceTrack[i] < this.room.sourceSpace[i]) {
                    console.log("Source",i,"is under capacity. Assigning.")
                    this.memory.target = i
                    break;
                }
            }

            if (this.memory.target == null) {
                var localMax = 0
                var index = 0
                for (var i = 0; i < this.room.sourceSpace.length; i++) {
                    var quotient = this.room.sourceTrack[i] / this.room.sourceSpace[i]
                    if (quotient > localMax) {
                        localMax = quotient
                        index = i
                    }
                }
                this.memory.target = index
                this.room.sourceTrack[i] += 1
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
    var structure = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (structure) => {
            return ((structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity)
        }
    });

    if (structure != undefined) {
        // Spawn
        if (this.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(structure)
        }
    }
    else {
        this.Upgrade()
    }
};

Creep.prototype.Travel = function() {
    var ret = this.moveTo(Game.rooms[this.memory.target_room].controller)
    // var ret = this.moveTo(Game.flags["RoomToClaim2"])
    if (ret == ERR_INVALID_TARGET) {
        util.logError("Invalid target on creep", this.name)
    }
}

Creep.prototype.Upgrade = function() {
    this.memory.deliver = true

    if (this.upgradeController(Game.rooms[this.memory.target_room].controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(Game.rooms[this.memory.target_room].controller);
    }
};

Creep.prototype.WallRepair = function() {
    this.memory.deliver = true

    // Find nearest structure needing repair
    let structure = this.pos.findClosestByPath(FIND_STRUCTURES,
        { filter: (s) => s.hits < conf.WALL_STRENGTH &&
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
        // console.log(this.name + " fell back on upgrading")
        this.Upgrade()
    }
}
