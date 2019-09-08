/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utility');
 * mod.thing == 'a thing'; // true
 */

ROOM_NAME = 'E8S23'
SPAWN_NAME = 'Spawn1'

module.exports = {
  ROOM_NAME: ROOM_NAME,
  SPAWN_NAME: SPAWN_NAME,
  MAIN_ROOM: Game.rooms[ROOM_NAME],
  MAIN_SPAWN: Game.spawns[SPAWN_NAME]
};
