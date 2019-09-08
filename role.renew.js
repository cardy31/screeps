module.exports = {
    run: function(creep) {
        if (Game.spawns.Spawn2.renewCreep(creep) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns.Spawn2);
        }
        creep.say("Renewing");
    }
};