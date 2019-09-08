module.exports = {
    run: function(creep) {
        // Send to a different room
        if (creep.memory.target !== undefined && creep.room.name !== creep.memory.target) {
            // Find exit to target room
            let exit = creep.room.findExitTo(creep.memory.target);
            // Move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));

            return;
        }

        if (creep.memory.working === true && creep.carry.energy === 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
        }

        // If creep is meant to return energy to a structure
        if (creep.memory.working === true) {
            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType === STRUCTURE_SPAWN
                || s.structureType === STRUCTURE_EXTENSION
                || s.structureType === STRUCTURE_TOWER)
                && s.energy < s.energyCapacity
            });

            if (structure !== undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            // Store energy in containers
            else {
                console.log("Moving to container 1");
                let containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => i.structureType === STRUCTURE_CONTAINER
                });

                if (containers !== undefined) {
                    if (creep.transfer(containers, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        console.log("Moving to container 3");
                        creep.moveTo(con);
                    }
                }
            }
        }

        // If creep is meant to harvest energy from a source
        else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: (s) => s.energy > 0
            });
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            else if (creep.harvest(source) === ERR_NOT_ENOUGH_RESOURCES)
                creep.memory.working = true;
        }
        creep.say("H");
    }
};