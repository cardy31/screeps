let roleUpgrader = {
    run: function(creep) {
        creep.Work(creep.Upgrade, creep)
    }
};

module.exports = roleUpgrader;
