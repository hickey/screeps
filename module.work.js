/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.work');
 * mod.thing == 'a thing'; // true
 */
 

var priorityQueue = require('module.priorityQueue');


module.exports = {
    
    
    findWork: function(room) {
        
        let workQueue = new priorityQueue.PriorityQueue();
        
        gatherBuildProjects(room).forEach(function(project) {
            workQueue.push({task: 'build', target: project.target}, project.priority);
        });
        
        
        
        return workQueue;
    }
    
    
    gatherBuildProjects: function(room) {
        
        
        
    }

};