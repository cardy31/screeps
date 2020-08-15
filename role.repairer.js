const roleBuilder = require('role.builder');

module.exports = {
    run: function(creep) {
        // ResetMemoryFlags flags when creep is out of energy on a delivery
        if (creep.carry.energy === 0 && creep.memory.deliver) {
            creep.ResetMemoryFlags()
        }

        if (creep.memory.target_room != null && creep.memory.target_room !== creep.room.name) {
            creep.Travel()
        }
        else if (creep.carry.energy < creep.carryCapacity && !creep.memory.deliver) {
            creep.Harvest()
        }
        else {
            creep.Repair()
        }
    }
};
