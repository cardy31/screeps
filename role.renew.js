require('require')
var util = require('utility')

module.exports = {
    run: function(creep) {
        if (util.MAIN_SPAWN.renewCreep(creep) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns.Spawn2);
        }
        creep.say("Renewing");
    }
};
