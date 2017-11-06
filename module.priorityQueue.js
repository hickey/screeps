/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.priorityQueue');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

    PriorityQueue: function() {
        this.data = []
    }

    push: function(element, priority) {
        priority = +priority
        for (var i = 0; i < this.data.length && this.data[i][1] > priority; i++);
        this.data.splice(i, 0, [element, priority])
    }

    pop: function() {
        return this.data.shift()[0]
    }

    size: function() {
        return this.data.length
    }



};