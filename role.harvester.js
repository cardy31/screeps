var goingForController = false
var deliver = false
var ROOM_NAME = 'E8S23'
var SPAWN_NAME = 'Spawn1'
var DEBUG = false

var util = require('utility');
var MAIN_ROOM = util.MAIN_ROOM
var MAIN_SPAWN = util.MAIN_SPAWN

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log(util.ROOM_NAME)
        // Reset flags when creep is done delivering
        if (creep.carry.energy == 0) {
            if (DEBUG) { console.log("Reset flags") }
            deliver = false
            goingForController = false
        }

        // Harvest
        if(creep.carry.energy < creep.carryCapacity && !deliver) {
            if (DEBUG) { console.log("Harvesting") }
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        // Deliver
        else {
            if (DEBUG) { console.log("Delivering") }
            deliver = true

            // Deliver to spawn iff the spawn isn't at max capacity
            if (MAIN_SPAWN.energyCapacity > MAIN_SPAWN.energy &&
                creep.transfer(MAIN_SPAWN, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE &&
                !goingForController) {
                if (DEBUG) { console.log("Delivering to Spawn") }
                creep.moveTo(MAIN_SPAWN);
            }
            // Deliver to the room controller otherwise
            // Once a creep has started delivering to the room controller, it will deliver all of its energy to it, instead of trying to bounce between the controller and the spawn.
            else if (creep.transfer(MAIN_ROOM.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if (DEBUG) { console.log("Delivering to Controller") }
                goingForController = true
                creep.moveTo(MAIN_ROOM.controller);
            }
        }
    }
};

module.exports = roleHarvester;
