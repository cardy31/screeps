const body_conf = require('body_layouts')

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
            if (creep.memory.target_room in this.creepsByRoom && creep.memory.target_room in this.creepNamesByRoom) {
                this.creepsByRoom[creep.memory.target_room][creep.memory.role] += 1
                this.creepNamesByRoom[creep.memory.target_room].push(creep.name)
            }
            else {
                this.creepsByRoom[creep.memory.target_room] = this.getEmptyCreepCount()
                this.creepsByRoom[creep.memory.target_room][creep.memory.role] = 1
                this.creepNamesByRoom[creep.memory.target_room] = []
                this.creepNamesByRoom[creep.memory.target_room].push(creep.name)
            }

            // TODO This can be made more efficient by only counting miners once those exist
            if (!(creep.memory.target_room in this.creepsAssignedToEnergySource)) {
                this.creepsAssignedToEnergySource[creep.memory.target_room] = []

                let targ_length = Game.rooms[creep.memory.target_room].find(FIND_SOURCES).length
                for (let i = 0; i < targ_length; i++) {
                    this.creepsAssignedToEnergySource[creep.memory.target_room].push(0)
                }
            }
            if (creep.memory.target != null && creep.memory.deliver === false) {
                this.creepsAssignedToEnergySource[creep.memory.target_room][creep.memory.target]++
            }
        }
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
            throw new RoomError()
        }
    }

    getCreepNamesByRoom(roomName) {
        if (roomName in this.creepNamesByRoom) {
            return this.creepNamesByRoom[roomName]
        } else {
            throw new RoomError()
        }
    }

    getCreepsAssignedToEnergySource(roomName) {
        if (roomName in this.creepsAssignedToEnergySource) {
            return this.creepsAssignedToEnergySource[roomName]
        } else {
            throw new RoomError()
        }
    }
}

function RoomError(message = "Given room was invalid!") {
    return new Error(message);
}

module.exports = Census