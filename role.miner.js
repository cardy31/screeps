let roleMiner = {
    run: function(creep) {
        creep.Work(creep.StoreEnergy, creep)
    }
};

module.exports = roleMiner;
