var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleWorker = require('role.worker');

module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    
    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        var res = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'harvester'}}); 
        //console.log("Harvester spawn result: ", res);
        if (res == 0) {
            console.log("Spawning new harvester: " + newName);
        }
    } else if(upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        var res = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'upgrader'}});        
        //console.log("Upgrader spawn result: ", res);
        if (res == 0) {
            console.log('Spawning new upgrader: ' + newName);
        }

    } else if(builders.length < 4) {
        var newName = 'Builder' + Game.time;
        var res = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'builder'}});
        //console.log("Builder spawn result: ", res);
        if (res == 0) {
            console.log('Spawning new builder: ' + newName);
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}