let roleMiner = {
    run: function(creep) {
        if (creep.ShouldMoveToDifferentRoom()) {
            creep.Travel()
        } else {
            creep.Mine()
        }
    }
};

module.exports = roleMiner;
