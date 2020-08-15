let roleWallRepairer = require('role.wallRepairer');

// TODO: This file is gross. Break it up into separate functions
module.exports = {
    run: function(creep) {
        creep.Work(creep.RepairRamparts, creep)
    }
};
