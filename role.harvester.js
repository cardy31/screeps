require('require')
var util = require('utility');
var MAIN_ROOM = util.MAIN_ROOM
var MAIN_SPAWN = util.MAIN_SPAWN

var roleHarvester = {
    run: function(creep) {

        // Reset flags when creep is out of energy on a delivery
        if (creep.carry.energy == 0 && creep.memory.deliver) {
            creep.Reset()
        }

        if (creep.memory.target_room != undefined && creep.memory.target_room != creep.room.name) {
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
