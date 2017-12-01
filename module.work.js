/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.work');
 * mod.thing == 'a thing'; // true
 */


var priorityQueue = require('module.priorityQueue');


var BuildPriorities = { STRUCTURE_EXTENSION      : 80,
                        STRUCTURE_ROAD           : 50,
                        STRUCTURE_WALL           : 5,
                        STRUCTURE_RAMPART        : 90,
                        STRUCTURE_PORTAL         : 30,
                        STRUCTURE_LINK           : 30,
                        STRUCTURE_STORAGE        : 40,
                        STRUCTURE_TOWER          : 80,
                        STRUCTURE_POWER_BANK     : 20,
                        STRUCTURE_TERMINAL       : 20,
                        STRUCTURE_CONTAINER      : 20 };


module.exports = {


    findWork: function(room) {

        let workQueue = new priorityQueue.PriorityQueue();

        gatherBuildProjects(room).forEach(function(project) {
            workQueue.push({task: 'build', target: project.target}, project.priority);
        });
        
        
        
        return workQueue;
    };


    gatherBuildProjects: function(room) {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        let scoredResults = new priorityQueue.PriorityQueue();

        targets.forEach(function (pos) {
            let sectAttrs = room.lookAt(pos);
            scoredResults.push(pos, BuildPriorities[sectAttr.structure]);
        });

        return scoredResults;
    };


    gatherRepairProjects: function(room) {
        let targets = creep.room.find(FIND_MY_STRUCTURES,
                { filter: (structure) => {
                        return (structure.)
    };
};