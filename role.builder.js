var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //console.log("roleBuilder.run("+creep+")");
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        //console.log("build targets="+targets);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var target = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER)}});
                console.log("target = ", target);
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
	        //var instance = Math.round(Math.random() * sources.length);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;
