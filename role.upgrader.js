
/** missions **/
var M_unassigned = 0;
var M_harvest    = 1;
var M_build      = 2;
var M_upgrade    = 3;
var M_mine       = 4;


/** tasks **/
var T_unassigned     = 0;
var T_discharge      = 2;
var T_build          = 3;
var T_upgrade        = 4;
var T_recharge       = 5;
var T_move           = 7;
    

var roleUpgrader = {

    create: function(room) {
        let newName = 'Upgrader' + Game.time;
        let res = null;
        
        if (room.energyAvailable >= 700) {
            res = Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                            {memory: {role: 'upgrader', mission: M_upgrade}});
        } else if (room.energyAvailable >= 500) {
            res = Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                            {memory: {role: 'upgrader', mission: M_upgrade}});
        } else if (room.energyAvailable >= 300) {
            res = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName, 
                            {memory: {role: 'upgrader', mission: M_upgrade}});
        };
        return res;
    }, 
    
    /** @param {Creep} creep **/
    run: function(creep) {
        //console.log("roleHarvester.run()");
        
        if (!creep.memory.task) {
            creep.memory.task = T_unassigned;
        }
        var goal = Game.getObjectById(creep.memory.goal);
        var target = Game.getObjectById(creep.memory.target);
        
        //console.log("harvester task=", creep.memory.task);
        switch (creep.memory.task) {
            
            case T_unassigned:
                let source = locateEnergySource(creep);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    nextTask(creep, T_move, {setGoal: source.id});
                }
                break;
                
                
            case T_move:
                var res = creep.moveTo(goal, {visualizePathStyle: {stroke: '#ffffff'}});
                // console.log("res = ", res);
                switch(res) {
                    case OK:
                        var distance = creep.pos.getRangeTo(goal);
                        if (distance == 1) {
                            //console.log("reached goal, reassing to target");
                            // reached goal, move to next state
                            creep.memory.target = creep.memory.goal;
                            creep.memory.goal = null;
                            var target = Game.getObjectById(creep.memory.target);
                
                            var targets = creep.room.lookAt(target);
                            switch (targets[0].type) {
                                case LOOK_SOURCES:
                                    //console.log("starting recharge");
                                    creep.memory.task = T_recharge;
                                    creep.harvest(target);
                                    break;
                                case LOOK_STRUCTURES:
                                    //console.log("starting discharge");
                                    creep.memory.task = T_upgrade;
                                    creep.transfer(target, RESOURCE_ENERGY);
                                    break;
                            } 
                        }
                        break;
                    case ERR_TIRED:
                    case ERR_BUSY:
                        break;
                    case ERR_NO_BODYPART:
                        creep.suicide();
                        break;
                    case ERR_INVALID_TARGET:
                        nextTask(creep, T_unassigned, {setGoal: null});
                        creep.say("ARG!");
                        break;
                }
                break;
                
            
            case T_recharge:
                if (creep.carry.energy < creep.carryCapacity) {
                    var res = creep.harvest(target);
                    if (res == ERR_NOT_ENOUGH_RESOURCES) {
                        nextTask(creep, T_unassigned, {setGoal: null});
                    }
                } else {
                    // finished recharging
                    var target = locateRoomController(creep);
                    if (target) {
                        nextTask(creep, T_move, {setGoal: target.id});
                        creep.say('⚡ upgrade');
                    }
                }
                break;
                
                
            case T_upgrade:
                if (creep.carry.energy > 0) {
                    var res = creep.upgradeController(creep.room.controller);
                    //console.log("transfering energy: ", res);
                    if (res == ERR_NOT_IN_RANGE) {
                        var target = locateRoomController(creep);
                        if (target) {
                            nextTask(creep, T_move, {setGoal: target.id});
                            creep.say("reaquiring");
                        }
                    }
                } else {
                    //console.log("transfer complete");
                    // finished transfer of energy
                    nextTask(creep, T_unassigned, {setGoal: null});
                    creep.say("🔄 harvest");
                }
                break;
                
                
            
            
        }
        
	}
};




function nextTask(creep, newTask, options) {
    creep.memory.task = newTask;
    if (options.setGoal) {
        creep.memory.target = creep.memory.goal;
        creep.memory.goal = options.setGoal;
    }
    
    if (options.setAcheivement) {
        creep.memory.acheivement = options.setAcheivement;
    }
    
    if (options.clearAcheivement) {
        delete creep.memory.acheivement;
    }
};



function locateEnergySource(creep) {
    let lottery = [];
    let sources = creep.room.find(FIND_SOURCES_ACTIVE);
    sources.forEach(function(source) {
        let perimeter = creep.room.lookAtArea(source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true);
        perimeter.forEach(function(sector) {
            if (sector.type == LOOK_TERRAIN) {
                if (sector.terrain == 'swamp' || sector.terrain == 'plain') {
                    lottery.push(source);
                }
            }
        })
    })
    let instance = Math.round(Math.random() * lottery.length);
    return lottery[instance];
};



function locateBuildTarget(creep) {
    
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	//console.log("build targets="+targets);
    if(targets) {
        return targets[Math.round(Math.random() * targets.length)];
    } else {
        return null;
    }
};


function locateRoomController(creep) {
    return creep.room.controller;
};


function locateDeliveryTarget(creep) {
    let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                    structure.energy < structure.energyCapacity;} });
    if (targets) {   
        return targets[Math.round(Math.random() * targets.length)];
    } else {
        return null;
    }
};

module.exports = roleUpgrader;

