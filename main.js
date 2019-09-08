require('prototype.spawn')();
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');
let roleWallRepairer = require('role.wallRepairer');
let roleRampartRepairer = require('role.rampartRepairer');
let roleLongDistanceHarvester = require('role.longDistanceHarvester');
let roleClaimer = require('role.claimer');
let roleRenew = require('role.renew');

let HOME = "E18N69";
let SECOND = undefined;

module.exports.loop = function () {

    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (Game.creeps[name] === undefined)
            delete Memory.creeps[name];
    }

    // Apply various roles
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        // if (creep.ticksToLive < 50 && creep.room.name == "E69N2") {
        //     Game.spawns.Spawn2.memory["renew" + creep.name] = true;
        // }
        if (creep.memory.role === 'harvester')
            roleHarvester.run(creep);
        else if (creep.memory.role === 'upgrader')
            roleUpgrader.run(creep);
        else if (creep.memory.role === 'builder')
            roleBuilder.run(creep);
        else if (creep.memory.role === 'repairer')
            roleRepairer.run(creep);
        else if (creep.memory.role === 'wallRepairer')
            roleWallRepairer.run(creep);
        else if (creep.memory.role === 'rampartRepairer')
            roleRampartRepairer.run(creep);
        else if (creep.memory.role === 'longDistanceHarvester')
            roleLongDistanceHarvester.run(creep);
        else if (creep.memory.role === 'claimer')
            roleClaimer.run(creep);
    }

    // Tower attack
//    let towers = Game.rooms[HOME].find(FIND_STRUCTURES, {
//        filter: (s) => s.structureType == STRUCTURE_TOWER
//    });

//    for (let tower of towers) {
//        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
//        if (target != undefined) {
 //           tower.attack(target);
//        }
 //   }

    // Spawning new creeps
    for (let spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName];
        let creepsInRoom = spawn.room.find(FIND_CREEPS);

        // Current totals of creeps by type
        let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role === 'harvester'); // Anonymous function
        let numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role === 'upgrader');
        let numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role === 'builder');
        let numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role === 'repairer');
        let numberOfWallRepairers = _.sum(creepsInRoom, (c) => c.memory.role === 'wallRepairer');
        let numberOfRampartRepairers = _.sum(creepsInRoom, (c) => c.memory.role === 'rampartRepairer');
        let numberOfLongDistanceHarvesters = _.sum(Game.creeps, (c) =>
            c.memory.role === 'longDistanceHarvester' && c.memory.target === "E68N2");
        // let numberOfClaimers = _.sum(creepsInRoom, (c) => c.memory.role == 'claimer');

        // Available energy in room
        let energy = spawn.room.energyCapacityAvailable;
        let name = undefined;

        // Print out number of creeps
        console.log(spawn.name);
        console.log("Number of harvesters: " + numberOfHarvesters);
        console.log("Number of upgraders: " + numberOfUpgraders);
        console.log("Number of builders: " + numberOfBuilders);
        console.log("Number of repairers: " + numberOfRepairers);
        console.log("Number of wall repairers: " + numberOfWallRepairers);
        console.log("Number of rampart repairers: " + numberOfRampartRepairers);
        console.log("Number of long distance harvesters: " + numberOfLongDistanceHarvesters);
        // console.log("Number of claimers: " + numberOfClaimers);
        console.log();

        // If not enough harvesters
        if (numberOfHarvesters < spawn.memory.minHarvesters) {
            // Try to spawn harvesters
            name = spawn.createCustomCreep(energy, 'harvester');
            // If there isn't enough energy for a bigger harvester
            if (name === ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters === 0) {
                // Make a smaller harvester
                name = spawn.createCustomCreep(
                    spawn.room.energyAvailable, 'harvester'
                );
            }
        }
        // Claimers
        else if (spawn.memory.claimRoom !== undefined) {
            name = spawn.createClaimer(spawn.memory.claimRoom);
            if (typeof name === "string")
                delete spawn.memory.claimRoom;
        }
        // Upgraders
        else if (numberOfUpgraders < spawn.memory.minUpgraders)
            name = spawn.createCustomCreep(energy, 'upgrader');
        // Repairers
        else if (numberOfRepairers < spawn.memory.minRepairers)
            name = spawn.createCustomCreep(energy, 'repairer');
        // Builders
        else if (numberOfBuilders < spawn.memory.minBuilders)
            name = spawn.createCustomCreep(energy, 'builder');
        // Wall Repairers
        else if (numberOfWallRepairers < spawn.memory.minWallRepairers)
            name = spawn.createCustomCreep(energy, 'wallRepairer');
        // Rampart Repairers
        else if (numberOfRampartRepairers < spawn.memory.minRampartRepairers)
            name = spawn.createCustomCreep(energy, 'rampartRepairer');
        // Long Distance Harvesters
        else if (numberOfLongDistanceHarvesters < spawn.memory.minLongDistanceHarvesters)
            name = spawn.createLongDistanceHarvester(energy, 4, "E69N2", "E68N2", 0);
        // Default Builders
        else if (numberOfBuilders < spawn.memory.maxBuilders)
            name = spawn.createCustomCreep(energy, 'builder');

        // Print message if new creep is spawned
        if (typeof name === "string") {
            console.log();
            console.log("Spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ") from " + spawn.name);
            console.log();
        }
    }
};