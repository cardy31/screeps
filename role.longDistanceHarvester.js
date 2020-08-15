let roleUpgrader = require('role.upgrader');

// TODO: This file is gross. Break it up into separate functions
module.exports = {
    run: function(creep) {
        if (creep.memory.working === true && creep.carry.energy === 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working === false && creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
        }

        // If creep is meant to return energy to a structure
        if (creep.memory.working === true) {
            if (creep.room.name === creep.memory.home) {
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
                // No empty structures
                else {
                    roleUpgrader.run(creep);
                }
            }
            else {
                let exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }

        }
        // If creep is supposed to harvest energy from source
        else {
            // We are in the correct room
            if (creep.room.name === creep.memory.target) {
                let source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];

                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            // We're not yet in the room
            else {
                let exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
        creep.say("LH");
    }
};