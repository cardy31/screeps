let roleUpgrader = require('role.upgrader');

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
            let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (constructionSite !== undefined) {
                if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            }
            else
                roleUpgrader.run(creep);
        }
        // If creep is meant to harvest energy from a source
        else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            else if (creep.harvest(source) === ERR_NOT_ENOUGH_RESOURCES)
                creep.memory.working = true;
        }
        creep.say("B");
    }
};