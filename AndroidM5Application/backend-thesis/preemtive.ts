import { api } from "./api";

const startTime = new Date();
console.log("Start sending request: ", startTime);
api.solution_2.createDataToRelaySolution2({
    "datum": {
        "value": Number(1)
    }
}).then(response => {
    const endTime = new Date();
    console.log("After sedind request: ", endTime);
    const millisecondsElapsed = endTime.getTime() - startTime.getTime();
    console.log("The delay time: ", millisecondsElapsed - 700, "ms");
}).catch(error => {
    console.error("Error:", error);
});
