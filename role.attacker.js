module.exports = {
    run: function(creep) {
        if (creep.memory.target_room != undefined && creep.memory.target_room != creep.room.name) {
            creep.Travel()
        }
        else {
            creep.Attack()
        }
    }
};
