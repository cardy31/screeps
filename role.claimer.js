let roleUpgrader = require('role.upgrader');

module.exports = {
    run: function(creep) {
        // We are in the correct room
        if (creep.room.name != creep.memory.target) {
            // Find exit to target room
            let exit = creep.room.findExitTo(creep.memory.target);
            // Move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else {
            // Claim the controller
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // Move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
        creep.say("CL");
    }
};