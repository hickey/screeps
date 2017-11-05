
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
    

var roleHarvester = {


    
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
                var sources = creep.room.find(FIND_SOURCES_ACTIVE);
                var instance = Math.round(Math.random() * sources.length);
                if(creep.harvest(sources[instance]) == ERR_NOT_IN_RANGE) {
                    creep.memory.goal = sources[instance].id;
                    creep.memory.task = T_move;
                }
                break;
                
                
            case T_move:
                var res = creep.moveTo(goal, {visualizePathStyle: {stroke: '#ffaa00'}});
                // console.log("res = ", res);
                switch(res) {
                    case OK:
                        var distance = creep.pos.getRangeTo(goal);
                        if (distance == 1) {
                            console.log("reached goal, reassing to target");
                            // reached goal, move to next state
                            creep.memory.target = creep.memory.goal;
                            creep.memory.goal = null;
                            var target = Game.getObjectById(creep.memory.target);
                
                            var targets = creep.room.lookAt(target);
                            switch (targets[0].type) {
                                case LOOK_SOURCES:
                                    console.log("starting recharge");
                                    creep.memory.task = T_recharge;
                                    creep.harvest(target);
                                    break;
                                case LOOK_STRUCTURES:
                                    console.log("starting discharge");
                                    creep.memory.task = T_discharge;
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
                        return;
                        break;
                    case ERR_INVALID_TARGET:
                        creep.memory.goal = null;
                        creep.memory.task = T_unassigned;
                        creep.say("ARG!");
                        break;
                }
                break;
                
            
            case T_recharge:
                if (creep.carry.energy < creep.carryCapacity) {
                    var res = creep.harvest(target);
                    if (res == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.memory.task = T_unassigned;
                        creep.memory.target = null;
                    }
                } else {
                    // finished recharging
                    var target = locateDeliveryTarget(creep);
                    if (target) {        
                        creep.memory.goal = target.id;
                        creep.memory.task = T_move;
                    }
                }
                break;
                
                
            case T_discharge:
                if (creep.carry.energy > 0) {
                    var res = creep.transfer(target, RESOURCE_ENERGY);
                    console.log("transfering energy: ", res);
                    if (res == ERR_FULL) {
                        var target = locateDeliveryTarget(creep);
                        if (target) {        
                            creep.memory.goal = target.id;
                            creep.memory.task = T_move;
                        }
                    }
                } else {
                    console.log("transfer complete");
                    // finished transfer of energy
                    creep.memory.target = null;
                    creep.memory.task = T_unassigned;
                }
                break;
                
                
            
            
        }
        
	}
};

function locateDeliveryTarget(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                    structure.energy < structure.energyCapacity;} });
    if (targets) {   
        return targets[Math.round(Math.random() * targets.length)];
    } else {
        return null;
    }
}

module.exports = roleHarvester;