require('require')

let roleHarvester = {
    run: function(creep) {
        creep.Work(creep.StoreEnergy, creep)
    }
};

module.exports = roleHarvester;
