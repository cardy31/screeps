const roleBuilder = require('role.builder');

module.exports = {
    run: function(creep) {
        creep.Work(creep.Repair, creep)
    }
};
