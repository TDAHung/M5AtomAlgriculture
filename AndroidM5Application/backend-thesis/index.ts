
const mqtt = require('mqtt');
const adafruit_mqtt = require('mqtt');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./test-app-393803-firebase-adminsdk-s9gi2-6e9ac92f5b.json');
require('dotenv').config();
const dynamic_schedule = require('node-schedule');
const cylic_schedule = require('node-schedule');
import { api } from "./api";
// // Adafruit configuration
// const AIO_USERNAME = 'Suchuru';

// Firestore Init
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://test-app-393803-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const db = getFirestore();
interface IsensorObject {
    value?: any,
    min_range?: number,
    max_range?: number,
    sensor?: string,
    unit?: string
}

interface IData {
    air_temperature?: number | IsensorObject,
    air_humidity?: number | IsensorObject,
    air_lux?: number | IsensorObject,
    air_atmosphere?: number | IsensorObject,
    env_temperature?: number | IsensorObject,
    env_humidity?: number | IsensorObject,
    env_ph?: number | IsensorObject,
    env_ec?: number | IsensorObject,
    env_nitro?: number | IsensorObject,
    env_phosphorus?: number | IsensorObject,
    env_kalium?: number | IsensorObject,
    water_ec?: number | IsensorObject,
    water_ph?: number | IsensorObject,
    water_orp?: number | IsensorObject,
    water_temperature?: number | IsensorObject,
    water_salinity?: number | IsensorObject
}

const mqttClient = adafruit_mqtt.connect({
    host: 'io.adafruit.com',
    port: 1883,
    username: process.env.AIO_USERNAME,
    password: process.env.AIO_PASSWORD,
});


mqttClient.on('connect', () => {
    console.log('Connected to io.adafruit.com successfully');
    mqttClient.subscribe(`Suchuru/feeds/relay.pumpin`);
    mqttClient.subscribe(`${process.env.AIO_USERNAME}/feeds/relay.pumpout`);
    mqttClient.subscribe(`${process.env.AIO_USERNAME}/feeds/relay.solution1`);
    mqttClient.subscribe(`${process.env.AIO_USERNAME}/feeds/relay.solution2`);
    mqttClient.subscribe(`${process.env.AIO_USERNAME}/feeds/relay.solution3`);
    mqttClient.subscribe(`${process.env.AIO_USERNAME}/feeds/relay.subdivision1`);
    mqttClient.subscribe(`${process.env.AIO_USERNAME}/feeds/relay.subdivision2`);
    mqttClient.subscribe(`${process.env.AIO_USERNAME}/feeds/relay.subdivision3`);
});

mqttClient.on('message', (topic: string, message: string) => {
    console.log(`received message ${topic}: ${message.toString()}`);
    const subscribeTopic = topic.split('/');
    const processTopic = subscribeTopic[subscribeTopic.length - 1].split('.');
    const mqttData = message.toString();
    let collection = processTopic[processTopic.length - 1];
    const created_at = Date.now();
    const stateTopic = collection.concat("_state");
    const docRefState = db.collection(`${stateTopic.toString()}`);
    docRefState.doc('Gcb9KWzfG1IHFIfEbflJ').set({
        value: mqttData,
        created_at: created_at,
    });
});

mqttClient.on('close', () => {
    console.log('Adafuirt client closed');
});

const calculateMinMax = (sensorObject: IData, range: any) => {
    sensorObject.air_atmosphere = {
        value: sensorObject.air_atmosphere,
        min_range: range.min_air_atmosphere,
        max_range: range.max_air_atmosphere,
        sensor: "air co2",
        unit: "",
    };
    sensorObject.air_humidity = {
        value: sensorObject.air_humidity,
        min_range: range.min_air_humidity,
        max_range: range.max_air_humidity,
        sensor: "air humidity",
        unit: "%",
    };
    sensorObject.air_lux = {
        value: sensorObject.air_lux,
        min_range: range.min_air_brightness,
        max_range: range.max_air_brightness,
        sensor: "air brightness",
        unit: "lux",
    };
    sensorObject.air_temperature = {
        value: sensorObject.air_temperature,
        min_range: range.min_air_temperature,
        max_range: range.max_air_temperature,
        sensor: "air temperature",
        unit: "°C",
    };
    sensorObject.env_temperature = {
        value: sensorObject.env_temperature,
        min_range: range.min_soil_temperature,
        max_range: range.max_soil_temperature,
        sensor: "soil temperature",
        unit: "°C",
    };
    sensorObject.env_humidity = {
        value: sensorObject.env_humidity,
        min_range: range.min_soil_humidity,
        max_range: range.max_soil_humidity,
        sensor: "soil humidity",
        unit: "%",
    };
    sensorObject.env_ph = {
        value: sensorObject.env_ph,
        min_range: range.min_soil_ph,
        max_range: range.max_soil_ph,
        sensor: "soil PH",
        unit: "",
    };
    sensorObject.env_ec = {
        value: sensorObject.env_ec,
        min_range: range.min_soil_ec,
        max_range: range.max_soil_ec,
        sensor: "soil EC",
        unit: "",
    };
    sensorObject.env_nitro = {
        value: sensorObject.env_nitro,
        min_range: range.min_soil_nitro,
        max_range: range.max_soil_nitro,
        sensor: "soil nitrogen",
        unit: "",
    }
    sensorObject.env_phosphorus = {
        value: sensorObject.env_phosphorus,
        min_range: range.min_soil_phosphorus,
        max_range: range.max_soil_phosphorus,
        sensor: "soil phosphorus",
        unit: "",
    };
    sensorObject.env_kalium = {
        value: sensorObject.env_kalium,
        min_range: range.min_soil_potalium,
        max_range: range.max_soil_potalium,
        sensor: "soil kalium",
        unit: "",
    };
    sensorObject.water_temperature = {
        value: sensorObject.water_temperature,
        min_range: range.min_water_temperature,
        max_range: range.max_water_temperature,
        sensor: "water temperature",
        unit: "°C",
    }
    sensorObject.water_salinity = {
        value: sensorObject.water_salinity,
        min_range: range.min_water_salinity,
        max_range: range.max_water_salinity,
        sensor: "water salinity",
        unit: "",
    };
    sensorObject.water_ph = {
        value: sensorObject.water_ph,
        min_range: range.min_water_ph,
        max_range: range.max_water_ph,
        sensor: "water PH",
        unit: ""
    };
    sensorObject.water_orp = {
        value: sensorObject.water_orp,
        min_range: range.min_water_orp,
        max_range: range.max_water_orp,
        sensor: "water ORP",
        unit: ""
    };
    sensorObject.water_ec = {
        value: sensorObject.water_ec,
        min_range: range.min_water_ec,
        max_range: range.max_water_ec,
        sensor: "water EC",
        unit: ""
    };
    return { ...sensorObject };
}

const sendNotification = async (sensorObject: { [key: string]: any }) => {
    let isSent: boolean = false;
    let messageToSend: string | undefined = "";
    for (const key in sensorObject) {
        if (Object.prototype.hasOwnProperty.call(sensorObject, key)) {
            if (sensorObject[key].value != undefined) {
                if (sensorObject[key].value > sensorObject[key].max_range || sensorObject[key].value < sensorObject[key].min_range) {
                    messageToSend += `\n${sensorObject[key].sensor}: ${sensorObject[key].value} ${sensorObject[key].unit} is out of range [${sensorObject[key].min_range} : ${sensorObject[key].max_range}] ${sensorObject[key].unit}`;
                    isSent = true;
                }
            }
        }
    }
    messageToSend += `\n All your shedules will be shut down`;
    if (isSent && messageToSend != undefined) {
        const response = await db.collection("fcm_token").get();
        const tokenList: String[] = [];

        response.forEach((item: any) => {
            if (item.data().token != null) {
                tokenList.push(item.data().token);
            }
        });
        if (tokenList.length == 0) {
            return;
        }

        const message: any = {
            tokens: tokenList,
            notification: {
                title: 'Warning',
                body: messageToSend,
            },
        };
        admin.messaging().sendMulticast(message)
            .then((notiRes: any) => {
                dynamic_schedule.gracefulShutdown();
                cylic_schedule.gracefulShutdown();
                collection.get()
                    .then((snapshot: any) => {
                        snapshot.forEach((doc: any) => {
                            let check: boolean = false;
                            const dates = doc.data().date.map((schedule: any) => {
                                const start_date = schedule.date.split('-');
                                const start_time = schedule.startTime.split(':');
                                const end_time = schedule.endTime.split(':');
                                const startTimeFinal = start_date.concat(start_time);
                                const endTimeFinal = start_date.concat(end_time);
                                const startDate = new Date(
                                    Number(startTimeFinal[0]),
                                    Number(startTimeFinal[1]) - 1,
                                    Number(startTimeFinal[2]),
                                    Number(startTimeFinal[3]),
                                    Number(startTimeFinal[4]),
                                    Number(startTimeFinal[5]),
                                );

                                const endDate = new Date(
                                    Number(endTimeFinal[0]),
                                    Number(endTimeFinal[1]) - 1,
                                    Number(endTimeFinal[2]),
                                    Number(endTimeFinal[3]),
                                    Number(endTimeFinal[4]),
                                    Number(endTimeFinal[5]),
                                );
                                if (endDate > new Date() && startDate < new Date() && schedule.isActive == true) {
                                    check = true;
                                    return { ...schedule, isActive: false };
                                } else {
                                    return schedule;
                                }
                            });
                            if (check) {
                                doc.ref.update({ date: dates })
                                    .then(() => {
                                        console.log(`Document ${doc.id} updated successfully`);
                                    })
                                    .catch((err: any) => {
                                        console.error(`Error updating document ${doc.id}`, err);
                                    });
                            }
                        });
                    })
                    .catch((err: any) => {
                        console.error('Error getting documents', err);
                    });
                cyclicSchedulerCollection.get()
                    .then((snapshot: any) => {
                        snapshot.forEach((doc: any) => {
                            const options = { hour12: false, timeZone: 'Asia/Ho_Chi_Minh' };
                            const currentTime = new Date().toLocaleTimeString('en-US', options);
                            if (currentTime > doc.data().startTime && currentTime < doc.data().stopTime && doc.data().isActive == true) {
                                const date = { ...doc.data(), isActive: false };
                                doc.ref.update(date)
                                    .then(() => {
                                        console.log(`Document ${doc.id} updated successfully`);
                                    })
                                    .catch((err: any) => {
                                        console.error(`Error updating document ${doc.id}`, err);
                                    });
                            }
                        });
                    }).catch((error: any) => {
                        console.error('Error getting documents', error);

                    })
                console.log(notiRes.successCount + ' messages were sent successfully');
            });
    }
}

const MQTT_SERVER = process.env.MQTT_SERVER;
const MQTT_PORT = process.env.MQTT_PORT;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_TOPIC_SUB_AIR_SOIL = process.env.MQTT_TOPIC_SUB_AIR_SOIL;
const MQTT_TOPIC_SUB_WATER = process.env.MQTT_TOPIC_SUB_WATER;

const client = mqtt.connect({
    host: MQTT_SERVER,
    port: MQTT_PORT,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
});

client.on('connect', () => {
    console.log('Connected to Innovation successfully');
    client.subscribe(MQTT_TOPIC_SUB_AIR_SOIL);
    client.subscribe(MQTT_TOPIC_SUB_WATER);
});

const saveDatatoDB = (processTopic: string, sensorValue: number, processTopicState: string) => {
    const created_at = Date.now();
    const docRef = db.collection(`${processTopic}`);
    docRef.add({
        value: sensorValue,
        created_at: created_at,
    });
    const docRefState = db.collection(`${processTopicState}`);
    docRefState.doc('Gcb9KWzfG1IHFIfEbflJ').set({
        value: sensorValue,
        created_at: created_at,
    });
}

client.on('message', (topic: String, message: Buffer) => {
    console.log(topic);
    const decodedString: string = message.toString('utf-8');
    const payload: any = JSON.parse(decodedString.replace(/'/g, '"'));
    const sensorsValue = payload.sensors;
    let objectToPush: IData = {};
    let processTopicState: string = "";
    let processTopic: string = "";
    let measuredValue: number;
    const condition_range = db.collection('range_condition').doc('VzY90U96wt8ysBEkMebC');
    if (sensorsValue) {
        sensorsValue.forEach((element: any) => {
            if (element.id && element.value) {
                measuredValue = Number(element.value);
                switch (element.id) {
                    case 'temp_0001':
                        objectToPush.air_temperature = measuredValue;
                        processTopic = "air_temperature";
                        break;
                    case 'humi_0001':
                        objectToPush.air_humidity = measuredValue;
                        processTopic = "air_humidity";
                        break;
                    case 'illuminance_0001':
                        objectToPush.air_lux = measuredValue;
                        processTopic = "air_lux";
                        break;
                    case 'atmosphere_0001':
                        objectToPush.air_atmosphere = measuredValue;
                        processTopic = "air_atmosphere";
                        break;
                    case 'humi_0002':
                        objectToPush.env_humidity = measuredValue;
                        processTopic = "env_humidity";
                        break;
                    case 'temp_0002':
                        objectToPush.env_temperature = measuredValue;
                        processTopic = "env_temperature";
                        break;
                    case 'ph_0002':
                        objectToPush.env_ph = measuredValue;
                        processTopic = "env_ph";
                        break;
                    case 'EC_0002':
                        objectToPush.env_ec = measuredValue;
                        processTopic = "env_ec";
                        break;
                    case 'Nito_0002':
                        objectToPush.env_nitro = measuredValue;
                        processTopic = "env_nitro";
                        break;
                    case 'Photpho_0002':
                        objectToPush.env_phosphorus = measuredValue;
                        processTopic = "env_phosphorus";
                        break;
                    case 'Kali_0002':
                        objectToPush.env_kalium = measuredValue;
                        processTopic = "env_kalium";
                        break;
                }
            }
            if (element.sensor_id && element.sensor_value) {
                measuredValue = Number(element.sensor_value);
                switch (element.sensor_id) {
                    case 'EC_0001':
                        objectToPush.water_ec = measuredValue;
                        processTopic = "water_ec";
                        break;
                    case 'PH_0001':
                        objectToPush.water_ph = measuredValue;
                        processTopic = "water_ph";
                        break;
                    case 'ORP_0001':
                        objectToPush.water_orp = measuredValue;
                        processTopic = "water_orp";
                        break;
                    case 'SALINITY_0001':
                        objectToPush.water_salinity = measuredValue;
                        processTopic = "water_salinity";
                        break;
                    case 'TEMP_0001':
                        objectToPush.water_temperature = measuredValue;
                        processTopic = "water_temperature";
                        break;
                }
                processTopicState = `${processTopic}_state`;
                saveDatatoDB(processTopic, measuredValue, processTopicState);
            }

        });
        condition_range.get()
            .then((doc: any) => {
                if (doc.exists) {
                    const objectRange: any = calculateMinMax(objectToPush, doc.data());
                    sendNotification(objectRange);
                } else {
                    console.log('No such document!');
                }
            })
            .catch((error: any) => {
                console.error('Error getting document:', error);
            });
    }

});

client.on('close', () => {
    console.log('Connect closed');
});

const collection = db.collection('scheduler');
const cyclicSchedulerCollection = db.collection('cyclic_scheduler');
const apiFunctions = [
    api.pump_in.createDataToRelayPumpIn,
    api.pump_out.createDataToRelayPumpOut,
    api.solution_1.createDataToRelaySolution1,
    api.solution_2.createDataToRelaySolution2,
    api.solution_3.createDataToRelaySolution3,
    api.subdivision_1.createDataToRelaySubdivision1,
    api.subdivision_2.createDataToRelaySubdivision2,
    api.subdivision_3.createDataToRelaySubdivision3,
];

const apiFunctionsCall = (index: number, value: number) => {
    apiFunctions[index]({
        "datum": {
            "value": Number(value)
        }
    });
}

const apiSchedulerCall = (data: any) => {
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (data[key] != undefined) {
                switch (key) {
                    case 'pumpin':
                        apiFunctionsCall(0, Number(data[key]));
                        break;
                    case 'pumpout':
                        apiFunctionsCall(1, Number(data[key]));
                        break;
                    case 'solution1':
                        apiFunctionsCall(2, Number(data[key]));
                        break;
                    case 'solution2':
                        apiFunctionsCall(3, Number(data[key]));
                        break;
                    case 'solution3':
                        apiFunctionsCall(4, Number(data[key]));
                        break;
                    case 'subdivision1':
                        apiFunctionsCall(5, Number(data[key]));
                        break;
                    case 'subdivision2':
                        apiFunctionsCall(6, Number(data[key]));
                        break;
                    case 'subdivision3':
                        apiFunctionsCall(7, Number(data[key]));
                        break;
                }
            }
        }
    }
}

const buffer: Array<{
    dateStartTime: Date,
    // last: {
    //     hours: number,
    //     minutes: number,
    //     seconds: number
    // },
    // job_start: any,
    // job_end: any,
    start_content: {},
    end_content: {},
    dateEndTime: Date,
    priority: number,
}> = [];

collection.onSnapshot((collectionSnapshot: any) => {
    dynamic_schedule.gracefulShutdown();
    buffer.length = 0;
    collectionSnapshot.forEach((doc: any) => {
        const data = doc.data();

        data.date.sort((a: any, b: any) => (a.dateStartTime - b.dateStartTime || a.priority - b.priority));
        data.date.forEach((schedule: any) => {
            const start_date = schedule.date.split('-');
            const start_time = schedule.startTime.split(':');
            const startTimeFinal = start_date.concat(start_time);
            const startDate = new Date(
                Number(startTimeFinal[0]),
                Number(startTimeFinal[1]) - 1,
                Number(startTimeFinal[2]),
                Number(startTimeFinal[3]),
                Number(startTimeFinal[4]),
                Number(startTimeFinal[5]),
            );
            const { hours, minutes, seconds } = schedule.last;
            const endDate = new Date(startDate.getTime());
            endDate.setHours(startDate.getHours() + hours);
            endDate.setMinutes(startDate.getMinutes() + minutes);
            endDate.setSeconds(startDate.getSeconds() + seconds);

            if (endDate > new Date()) {
                if (startDate > new Date()) {
                    if (schedule.isActive) {
                        if (buffer.length == 0) {
                            buffer.push({
                                dateStartTime: startDate,
                                dateEndTime: endDate,
                                priority: schedule.priority,
                                start_content: schedule.start_schedule,
                                end_content: schedule.end_schedule,
                            });
                            schedule.waiting = {
                                hours: 0,
                                minutes: 0,
                                seconds: 0,
                            }
                        } else {
                            const last = buffer[buffer.length - 1];
                            if ((last.dateStartTime.getTime() == startDate.getTime())
                                || (startDate >= buffer[0].dateStartTime && startDate <= last.dateEndTime)) {

                                const newTask = {
                                    start_content: schedule.start_schedule,
                                    end_content: schedule.end_schedule,
                                    dateStartTime: last.dateEndTime,
                                    dateEndTime: new Date(last.dateEndTime.getTime() - startDate.getTime() + endDate.getTime()),
                                    priority: schedule.priority
                                };
                                let waitingTimeMilliseconds = last.dateEndTime.getTime() - startDate.getTime();
                                const waitingHours = Math.floor(waitingTimeMilliseconds / (1000 * 60 * 60));
                                waitingTimeMilliseconds %= 1000 * 60 * 60;
                                const waitingMinutes = Math.floor(waitingTimeMilliseconds / (1000 * 60));
                                waitingTimeMilliseconds %= 1000 * 60;
                                const waitingSeconds = Math.floor(waitingTimeMilliseconds / 1000);
                                schedule.waiting = {
                                    hours: waitingHours,
                                    minutes: waitingMinutes,
                                    seconds: waitingSeconds
                                };
                                buffer.push(newTask);
                            }
                            else {
                                buffer.push({
                                    dateStartTime: startDate,
                                    dateEndTime: endDate,
                                    priority: schedule.priority,
                                    start_content: schedule.start_schedule,
                                    end_content: schedule.end_schedule,
                                });
                                schedule.waiting = {
                                    hours: 0,
                                    minutes: 0,
                                    seconds: 0,
                                }
                            }
                        }
                    }
                } else {
                    if (schedule.isActive) {
                        apiSchedulerCall(schedule.start_schedule);
                        const job_end = schedule.scheduleJob(endDate, function () {
                            apiSchedulerCall(schedule.end_schedule);
                        });
                    } else {
                        apiSchedulerCall(schedule.end_schedule);
                    }
                }
            }
        });
        doc.ref.update({
            date: data.date
        });
        // data.date.forEach((date: any) => {
        //     const start_date = date.date.split('-');
        //     const start_time = date.startTime.split(':');
        //     const startTimeFinal = start_date.concat(start_time);
        //     const startDate = new Date(
        //         Number(startTimeFinal[0]),
        //         Number(startTimeFinal[1]) - 1,
        //         Number(startTimeFinal[2]),
        //         Number(startTimeFinal[3]),
        //         Number(startTimeFinal[4]),
        //         Number(startTimeFinal[5]),
        //     );
        //     const { hours, minutes, seconds } = date.last;
        //     const endDate = new Date(startDate.getTime());
        //     endDate.setHours(startDate.getHours() + hours);
        //     endDate.setMinutes(startDate.getMinutes() + minutes);
        //     endDate.setSeconds(startDate.getSeconds() + seconds);
        //     if (endDate > new Date()) {
        //         if (startDate > new Date()) {
        //             if (date.isActive) {
        //                 if (buffer.length == 0) {
        //                     buffer.push({
        //                         dateStartTime: startDate,
        //                         start_content: date.start_schedule,
        //                         end_content: date.end_schedule,
        //                         dateEndTime: endDate,
        //                         priority: date.priority
        //                     });
        //                 }
        //                 else {
        //                     const index = buffer.findIndex(schedule => {
        //                         return schedule.dateStartTime.getTime() == startDate.getTime()
        //                     });
        //                     const indexNotPreeemtive = buffer.findIndex(schedule => {
        //                         return (
        //                             schedule.dateStartTime.getTime() < startDate.getTime() &&
        //                             schedule.dateEndTime.getTime() > startDate.getTime()
        //                         )
        //                     });

        //                     if (index > -1) {
        //                         if (buffer[index].priority > date.priority) {
        //                             buffer.splice(index - 1, 0, {
        //                                 dateStartTime: startDate,
        //                                 start_content: date.start_schedule,
        //                                 end_content: date.end_schedule,
        //                                 dateEndTime: endDate,
        //                                 priority: date.priority
        //                             });
        //                             const lastBuffer = buffer[index + 1];
        //                             lastBuffer.dateStartTime = endDate;
        //                             lastBuffer.dateEndTime = new Date(lastBuffer.dateEndTime.getTime() - startDate.getTime() + endDate.getTime())
        //                         } else {
        //                             buffer.push({
        //                                 dateStartTime: buffer[index].dateEndTime,
        //                                 start_content: date.start_schedule,
        //                                 end_content: date.end_schedule,
        //                                 dateEndTime: new Date(
        //                                     buffer[index].dateEndTime.getTime()
        //                                     - buffer[index].dateStartTime.getTime()
        //                                     + startDate.getTime()
        //                                 ),
        //                                 priority: date.priority
        //                             });
        //                         }
        //                     } else if (indexNotPreeemtive > -1) {
        //                         buffer.push({
        //                             dateStartTime: buffer[indexNotPreeemtive].dateEndTime,
        //                             start_content: date.start_schedule,
        //                             end_content: date.end_schedule,
        //                             dateEndTime: new Date(
        //                                 buffer[indexNotPreeemtive].dateEndTime.getTime()
        //                                 - buffer[indexNotPreeemtive].dateStartTime.getTime()
        //                                 + startDate.getTime()
        //                             ),
        //                             priority: date.priority
        //                         });
        //                     } else {
        //                         buffer.push({
        //                             dateStartTime: startDate,
        //                             start_content: date.start_schedule,
        //                             end_content: date.end_schedule,
        //                             dateEndTime: endDate,
        //                             priority: date.priority
        //                         });
        //                     }
        //                 }
        //                 // buffer.forEach(scheduler => {
        //                 //     const job_start = schedule.scheduleJob(scheduler.dateStartTime, function () {
        //                 //         apiSchedulerCall(date.start_schedule);
        //                 //     });
        //                 //     const job_end = schedule.scheduleJob(scheduler.dateEndTime, function () {
        //                 //         buffer.shift();
        //                 //         apiSchedulerCall(date.end_schedule);
        //                 //     });
        //                 // });
        //             }
        //         } else {
        //             if (date.isActive) {
        //                 apiSchedulerCall(date.start_schedule);
        //                 const job_end = schedule.scheduleJob(endDate, function () {
        //                     apiSchedulerCall(date.end_schedule);
        //                 });
        //             } else {
        //                 apiSchedulerCall(date.end_schedule);
        //             }
        //         }
        //     }
        // });
        buffer.forEach(scheduler => {
            const job_start = dynamic_schedule.scheduleJob(scheduler.dateStartTime, function () {
                apiSchedulerCall(scheduler.start_content);
            });
            const job_end = dynamic_schedule.scheduleJob(scheduler.dateEndTime, function () {
                apiSchedulerCall(scheduler.end_content);
            });
        });
    });
}, (error: any) => {
    console.log(`Encountered error: ${error}`);
});

cyclicSchedulerCollection.onSnapshot((collectionSnapshot: any) => {
    cylic_schedule.gracefulShutdown();
    collectionSnapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data.isActive == true) {
            console.log(`Cyclic scheduler name: ${data.schedulerName} is coming`);
            const start_time = data.startTime.split(':');
            const end_time = data.stopTime.split(':');
            const startTime = start_time.reverse().join(' ').concat(" * * *");
            const stopTime = end_time.reverse().join(' ').concat(" * * *");
            console.log(startTime);
            const cycle = `* */${data.cycle} * * * *`;
            let cyclic_job: any;
            let cyclic_flow1: any;
            let cyclic_flow2: any;
            let cyclic_flow3: any;
            const flow1 = `*/${data.flow1} * * * * *`;
            let statusFlow1 = true;
            const flow2 = `*/${data.flow2} * * * * *`;
            let statusFlow2 = true;
            const flow3 = `*/${data.flow3} * * * * *`;
            let statusFlow3 = true;
            const job_start = cylic_schedule.scheduleJob(startTime, function () {
                console.log("Schedule started");
                cyclic_job = cylic_schedule.scheduleJob(cycle, function () {
                    console.log("Schedule is executed every " + data.cycle + " seconds");
                    cyclic_flow1 = cylic_schedule.scheduleJob(flow1, () => {
                        if (statusFlow1) {
                            apiFunctionsCall(2, 1);
                        } else {
                            apiFunctionsCall(2, 0);
                        }
                        statusFlow1 = !statusFlow1;
                    });
                    cyclic_flow2 = cylic_schedule.scheduleJob(flow2, () => {
                        if (statusFlow2) {
                            apiFunctionsCall(3, 1);
                        } else {
                            apiFunctionsCall(3, 0);
                        }
                        statusFlow2 = !statusFlow2;
                    });
                    cyclic_flow3 = cylic_schedule.scheduleJob(flow3, () => {
                        if (statusFlow3) {
                            apiFunctionsCall(4, 1);
                        } else {
                            apiFunctionsCall(4, 0);
                        }
                        statusFlow3 = !statusFlow3;
                    });
                })
            });
            const job_stop = cylic_schedule.scheduleJob(stopTime, function () {
                console.log("Schedule stopped");
                try {
                    cyclic_job.cancel();
                    cyclic_flow1.cancel();
                    cyclic_flow2.cancel();
                    cyclic_flow3.cancel();
                } catch (error) {
                    console.log(error);
                }
            });
        }
    });
});
