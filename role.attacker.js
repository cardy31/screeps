module.exports = {
    run: function(creep) {
        if (creep.ShouldMoveToDifferentRoom()) {
            creep.Travel()
        }
        else {
            creep.Attack()
        }
    }
};
