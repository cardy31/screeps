let roleWallRepairer = require('role.wallRepairer');

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
            let ramparts = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_RAMPART
            });

            let target = undefined;

            for (let percentage = 0.0001; percentage < 1; percentage += 0.0001) {

                for (let rampart of ramparts) {
                    if (rampart.hits / rampart.hitsMax < percentage) {
                        target = rampart;
                        break;
                    }
                }

                if (target !== undefined)
                    break;
            }
            if (target !== undefined) {
                if (creep.repair(target) === ERR_NOT_IN_RANGE)
                    creep.moveTo(target);
            }
            else
                roleWallRepairer.run(creep);
        }
        // If creep is meant to harvest energy from a source
        else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE)
                creep.moveTo(source);
            else if (creep.harvest(source) === ERR_NOT_ENOUGH_RESOURCES)
                creep.memory.working = true;
        }
        creep.say("RR");
    }
};