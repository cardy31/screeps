require('require')

let roleHarvester = {
    run: function(creep) {

        // ResetMemoryFlags flags when creep is out of energy on a delivery
        if (creep.carry.energy === 0 && creep.memory.deliver) {
            creep.ResetMemoryFlags()
        }

        if (creep.memory.target_room !== undefined && creep.memory.target_room !== creep.room.name) {
            creep.Travel()
        }
        else if(creep.carry.energy < creep.carryCapacity && !creep.memory.deliver) {
            creep.Harvest()
        }
        else {
            creep.StoreEnergy()
        }
    }
};

module.exports = roleHarvester;
