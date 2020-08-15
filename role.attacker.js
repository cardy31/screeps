module.exports = {
    run: function(creep) {
        if (creep.memory.target_room != null && creep.memory.target_room !== creep.room.name) {
            creep.Travel()
        }
        else {
            creep.Attack()
        }
    }
};
