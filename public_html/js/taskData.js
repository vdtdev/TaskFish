
/**
 * 'Constructor' for tasks
 * @param {String} title Task name/title
 * @param {String} description Brief description of task
 * @param {Boolean} status Task status (true=completed)
 * @param {Number} importance Importance rating (numerical)
 * @returns {taskCreate.Anonym$0} a new object encapsulating the provided properties
 */
function taskCreate(title, description, status, importance) {
    var d = new Date();
    return {"id": d.getUTCDate() + "_" + d.getUTCHours() + "_" + d.getUTCMinutes() + "_" + d.getUTCSeconds() + d.getUTCMilliseconds(),
        "title": title, "description": description, "status": status, "importance": importance};
}
/**
 * taskData class containing logic that stores, retrieves, monitors and updates 
 * task information.<br/>
 * Initially this was broken up into two separate parts; the storage/retrieval logic
 * and the HTML generating portion. For now the two are merged.
 * 
 * @author Wade Harkins (vdtdev@gmail.com)
 * @class taskData
 */
var taskData = {
    "tasks": new Array(),
    "create": function(title, desc, importance) {
        return taskCreate(title, desc, false, importance);
    },
    /**
     * Add a task to the set of tasks
     * @param {task} newTask New task object
     * @returns {undefined}
     */
    "add": function(newTask) {
        var fail = true;
        taskData.tasks.push(newTask);
        var newdata = new Array();
        chrome.storage.local.get("taskData", function(data) {
            if (data === undefined) {
                data = new Array();
            }
            if (data.tasks !== undefined) {
                if (data.tasks.length !== undefined) {
                    for (i = 0; i < data.tasks.length; i++) {
                        newdata.push(data.tasks[i]);
                    }
                }
            }
            newdata.push(newTask);
            //taskData.tasks.push(newTask);
            chrome.storage.local.set({"tasks": newdata}, function() {
                fail = false;
            });
        });
        if (!fail) {
            this.load();
        }
    },
    "save": function() {
        var newdata = new Array();
        chrome.storage.local.get("taskData", function(data) {
            if (data === undefined) {
                data = new Array();
            }
            if (data.tasks !== undefined) {
                if (data.tasks.length !== undefined) {
                    for (i = 0; i < data.tasks.length; i++) {
                        newdata.push(data.tasks[i]);
                    }
                }
            }
            chrome.storage.local.set({"tasks": newdata}, function() {
                //return false;
            });
        });
        this.load();
    },
    /**
     * Load all saved tasks into taskData.tasks
     * @returns {undefined} Nothing returned
     */
    "load": function() {
        var r = chrome.storage.local.get("taskData", function(data) {
            if (data === undefined) {
                data = new Array();
            }
            var newdata = new Array();
            if (data.tasks !== undefined) {
                if (data.tasks.length !== undefined) {
                    for (i = 0; i < data.tasks.length; i++) {
                        newdata.push(data.tasks[i]);
                    }
                }
            }
            else {
                //  return "Loading error";
            }

            taskData.tasks = newdata;
        });
        return r;
    },
    /**
     * 'Enum' of update filters
     * @type taskUI.Filter
     */
    "Filter": {"Complete": 1, "Incomplete": 2, "All": 3},
    /**
     * Updates displayed tasks based on taskData.tasks
     * @param {taskUI.Filter} updateFilter Specifies which tasks to update
     * @returns {Number} The number of tasks updated
     */
    "update_tasks": function(updateFilter) {
        var completeTasks = "", incompleteTasks = "";
        var com = ((updateFilter === this.Filter.Complete) || (updateFilter === this.Filter.All));
        var inc = ((updateFilter === this.Filter.Complete) || (updateFilter === this.Filter.All));
        var count = 0;
        //    var ids = new Array();
        for (t in this.tasks) {
            var task = this.tasks[t];
            var data = "";
            if ((task.status && com) || (!task.status && inc) || (com && inc)) {
                data += "<li><input type='checkbox' id='t"
                        + task.id + "-status' class='status' checked='" + (task.status?"true":"false")+"'>";
                data += "<label class='description' for='t" + task.id + "'>"
                        + task.title + "</label></li>";
                count++;
                // store id for even generation
                //if((com && task.status) || (inc && !task.status)){
//                    ids.push("t"+task.id);
                //              }
                completeTasks += (com && task.status) ? data : "";
                incompleteTasks += (inc && !task.status) ? data : "";
            }
        }
        if (com)
            $("#tasks-complete-ul").html(completeTasks);
        if (inc)
            $("#tasks-incomplete-ul").html(incompleteTasks);
        $(".status").change(function() {
            taskData.update_data();
        });
        return count;
    },
    /**
     * Update the items displayed in the incomplete task list to reflect the state
     * of taskData.tasks
     * @returns {Number} the number of incomplete tasks rendered
     */
    "update_incomplete_tasks": function() {
        return this.update_tasks(this.Filter.Incomplete);
    },
    /**
     * Update the items displayed in the completed task list to reflect the state
     * of taskData.tasks
     * @returns {Number} the number of completed tasks rendered
     */
    "update_complete_tasks": function() {
        return this.update_tasks(this.Filter.Complete);
    },
    /**
     * Update the items displayed in the completed and incompleted task lists 
     * to reflect the state of taskData.tasks
     * @returns {Number} the number of tasks rendered
     */
    "update_all_tasks": function() {
        return this.update_tasks(this.Filter.All);
    },
    /**
     * Updates the status of all stored tasks based on their check state
     */
    "update_data": function() {
        for (var t in this.tasks) {
            this.tasks[t].status = !($("#t" + this.tasks[t].id + "-status:checked").length === 0);
        }
        //this.save();
    }
};


