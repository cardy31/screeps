require('require')
const util = require('utility')

module.exports = {
    run: function(creep) {
        if (util.getMainSpawn().renewCreep(creep) === ERR_NOT_IN_RANGE) {
            creep.moveTo(util.getMainSpawn());
        }
        creep.say("Renewing");
    }
};
