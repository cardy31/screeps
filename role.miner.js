let roleMiner = {
    run: function(creep) {
        if (this.ShouldMoveToDifferentRoom()) {
            this.Travel()
        } else {
            this.Mine()
        }
    }
};

module.exports = roleMiner;
