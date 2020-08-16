const body_conf = require('body_layouts')
const util = require('utility')

class Census {
    constructor() {
        this.myCreeps = Game.creeps
        this.creepsByRoom = {}
        this.creepNamesByRoom = {}
        this.creepsAssignedToEnergySource = {}

        this.performCensus()
    }

    performCensus() {
        for (const key of Object.keys(this.myCreeps)) {
            let creep = this.myCreeps[key]

            if (this._roomHasBeenSeenBefore(creep.memory.target_room)) {
                this.creepsByRoom[creep.memory.target_room][creep.memory.role] += 1
                this.creepNamesByRoom[creep.memory.target_room].push(creep.name)
            }
            else {
                this.creepsByRoom[creep.memory.target_room] = this.getEmptyCreepCount()
                this.creepsByRoom[creep.memory.target_room][creep.memory.role] = 1
                this.creepNamesByRoom[creep.memory.target_room] = []
                this.creepNamesByRoom[creep.memory.target_room].push(creep.name)
            }

            if (this._creepShouldGetCounted(creep)) {
                if (!(creep.memory.target_room in this.creepsAssignedToEnergySource)) {
                    this.creepsAssignedToEnergySource[creep.memory.target_room] = []

                    let targ_length = Game.rooms[creep.memory.target_room].find(FIND_SOURCES).length
                    for (let i = 0; i < targ_length; i++) {
                        this.creepsAssignedToEnergySource[creep.memory.target_room].push(0)
                    }
                }
                if ((creep.memory.target != null && creep.memory.deliver === false) || creep.memory.role === 'miner') {
                    if (creep.memory.target != null) {
                        this.creepsAssignedToEnergySource[creep.memory.target_room][creep.memory.target]++
                    }
                    else if (creep.memory.minerContainerTarget != null) {
                        this.creepsAssignedToEnergySource[creep.memory.target_room][creep.memory.minerContainerTarget]++
                    }
                }
            }
        }
    }

    _creepShouldGetCounted(creep) {
        return creep.ShouldHarvestEnergy() || creep.memory.role === 'miner'
    }

    _roomHasBeenSeenBefore(roomName) {
        return this.seenBefore = roomName in this.creepsByRoom && roomName in this.creepNamesByRoom
    }

    getEmptyCreepCount() {
        let creepCount = {}
        let roles = body_conf.getRoles()
        for (let i = 0; i < roles.length; i++) {
            creepCount[roles[i]] = 0
        }
        return creepCount
    }

    getCreepsByRoom(roomName) {
        if (roomName in this.creepsByRoom) {
            return this.creepsByRoom[roomName]
        } else {
            throw new RoomError(roomName)
        }
    }

    getCreepNamesByRoom(roomName) {
        if (roomName in this.creepNamesByRoom) {
            return this.creepNamesByRoom[roomName]
        } else {
            throw new RoomError(roomName)
        }
    }

    getCreepsAssignedToEnergySource(roomName) {
        if (roomName in this.creepsAssignedToEnergySource) {
            return this.creepsAssignedToEnergySource[roomName]
        } else {
            throw new RoomError(roomName)
        }
    }
}

function RoomError(roomName) {
    return new Error("Given room was invalid: " + roomName);
}

module.exports = Census