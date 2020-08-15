// Cheat sheet of convenient console commands

Spawn a simple harvester
```js
Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1' );
```

Get Room Object
```js
Game.rooms[ROOM_NAME]
```
or
```js
Game.spawns['Spawn1'].room
```


Get Room level
```js
Game.spawns['Spawn1'].room.controller.level
```

Get Energy Sources in Room
```js
Game.rooms[ROOM_NAME].find(FIND_SOURCES)
```
