const tasks = [
    { task: "T1", dateStartTime: new Date("2024-05-26T08:00:00"), dateEndTime: new Date("2024-05-26T10:00:00"), priority: 3 },
    { task: "T2", dateStartTime: new Date("2024-05-26T08:00:00"), dateEndTime: new Date("2024-05-26T11:00:00"), priority: 2 },
    { task: "T3", dateStartTime: new Date("2024-05-26T08:00:00"), dateEndTime: new Date("2024-05-26T12:00:00"), priority: 1 },
    { task: "T4", dateStartTime: new Date("2024-05-26T14:30:00"), dateEndTime: new Date("2024-05-26T16:30:00"), priority: 3 },
    { task: "T5", dateStartTime: new Date("2024-05-26T10:15:00"), dateEndTime: new Date("2024-05-26T12:00:00"), priority: 1 },
    { task: "T6", dateStartTime: new Date("2024-05-26T22:15:00"), dateEndTime: new Date("2024-05-26T23:00:00"), priority: 1 },

];
tasks.sort((a, b) => (a.dateStartTime - b.dateStartTime || a.priority - b.priority));
const buffer = [];
tasks.forEach(task => {
    if (buffer.length == 0) {
        buffer.push(task);
    } else {
        const last = buffer[buffer.length - 1];
        if ((last.dateStartTime.getTime() == task.dateStartTime.getTime())
            || (task.dateStartTime >= buffer[0].dateStartTime && task.dateStartTime <= last.dateEndTime)) {
            const newTask = {
                task: task.task,
                dateStartTime: last.dateEndTime,
                dateEndTime: new Date(last.dateEndTime.getTime() - task.dateStartTime.getTime() + task.dateEndTime.getTime()),
                priority: task.priority
            };
            buffer.push(newTask);
        }
        else {
            buffer.push(task);
        }
    }
});

console.log(buffer);
