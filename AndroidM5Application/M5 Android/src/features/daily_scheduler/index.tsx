import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import DatePickerCustom from "../../components/datepicker";
import useCyclicScheduler from "./useCyclicScheduler";
import Loader from "../../components/loader";
import { Card } from "react-native-paper";
import { styles_button } from "./styles_button";
import firestore from '@react-native-firebase/firestore';

const DailySchedulerComponent = () => {
    const [isModalActive, setIsModalActive] = useState<boolean>(false);
    const [schedulers, setSchedulers] = useState<any>();
    const [startTime, setStartTime] = useState<any>(new Date());
    const [stopTime, setStopTime] = useState<any>(new Date());
    const [flow1, setFlow1] = useState<number>(0);
    const [flow2, setFlow2] = useState<number>(0);
    const [flow3, setFlow3] = useState<number>(0);
    const [cycle, setCycle] = useState<number>(0);
    const [schedulerName, setSchedulerName] = useState<string>("");
    const cyclicScheduler = useCyclicScheduler();
    const [warning, setWarning] = useState<string>("");

    const flows = [
        {
            name: 'Name',
            value: schedulerName,
            setValue: setSchedulerName,
            color: 'black',
        },
        {
            name: 'Cycle',
            value: cycle,
            setValue: setCycle,
            color: 'black',
        },
        {
            name: "Flow1",
            value: flow1,
            setValue: setFlow1,
            color: "#BE93D4",
        },
        {
            name: "Flow2",
            value: flow2,
            setValue: setFlow2,
            color: "#BE93D4",
        },
        {
            name: "Flow3",
            value: flow3,
            setValue: setFlow3,
            color: "#BE93D4",
        },
    ];


    useEffect(() => {
        setSchedulers(cyclicScheduler);
    }, [cyclicScheduler]);

    const renderScheduler = () => {
        if (schedulers == undefined) {
            return <Loader />
        }
        if (schedulers.length == 0) {
            return <View><Text style={{ color: 'black' }}>There are no schedulers</Text></View>
        }
        return schedulers.map((scheduler: any) => {
            const button_style = scheduler.isActive ? styles_button.button_green_active : styles_button.button_green;
            const buttonTextColor = scheduler.isActive ? "white" : "black"

            return <Card
                key={scheduler.id}
                style={{
                    backgroundColor: "white",
                    marginVertical: 5,
                    marginHorizontal: 20,
                }}>
                <Card.Content
                    style={{
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'center'
                                }}
                            >
                                {scheduler.startTime != null && scheduler.stopTime != null ?
                                    <Text style={{ textAlign: 'center', color: 'black' }}>{scheduler.startTime + " to " + scheduler.stopTime}</Text> : null
                                }
                            </View>
                            <TouchableOpacity
                                style={button_style}
                                onPress={() => {
                                    const docRef = firestore().collection("cyclic_scheduler").doc(scheduler.id);
                                    docRef.update({
                                        isActive: !scheduler.isActive,
                                        updated_at: new Date()
                                    });
                                }}
                            >
                                <Text
                                    style={{
                                        color: buttonTextColor
                                    }}
                                >{scheduler.isActive ? "Active" : "Not Active"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles_button.button_red}
                                onPress={() => {
                                    const docRef = firestore().collection("cyclic_scheduler").doc(scheduler.id);
                                    docRef.delete();
                                }}
                            >
                                <Text
                                    style={{
                                        color: "red"
                                    }}
                                >Delete</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={{ color: 'black' }}>Scheduler name: {scheduler.schedulerName}</Text>
                        </View>
                        <View>
                            <Text style={{ color: 'black' }}>Cycle: {scheduler.cycle} minutes</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View>
                                <Text style={{ color: 'black' }}>Flow1: {scheduler.flow1}</Text>
                            </View>
                            <View>
                                <Text style={{ color: 'black' }}>Flow2: {scheduler.flow2}</Text>
                            </View>
                            <View>
                                <Text style={{ color: 'black' }}>Flow3: {scheduler.flow3}</Text>
                            </View>
                        </View>

                    </View>
                </Card.Content>
            </Card>
        });

    }

    const renderFlowInputs = () => {
        return flows.map((flow) => {
            return <View
                key={flow.name}
                style={{
                    flexDirection: 'row',
                    // paddingLeft: 10,
                    width: "50%"
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            color: flow.color,
                        }}>{flow.name}:
                    </Text>
                </View>

                <TextInput
                    keyboardType="numeric"
                    style={{
                        color: flow.color,
                        borderBottomWidth: 1,
                        borderColor: flow.color,
                        width: '50%'
                    }}
                    value={String(flow.value)}
                    onChangeText={(value: any) => { flow.setValue(value) }}
                />
            </View>
        });
    }

    const resetScheduler = () => {
        setFlow1(0);
        setFlow2(0);
        setFlow3(0);
        setStartTime(new Date());
        setStopTime(new Date());
        setCycle(0);
        setSchedulerName('');
        setWarning('');
    }

    const pushScheduler = () => {
        const startHours = startTime.getHours().toString().padStart(2, '0');
        const startMinutes = startTime.getMinutes().toString().padStart(2, '0');
        const startSeconds = startTime.getSeconds().toString().padStart(2, '0');
        const stopHours = stopTime.getHours().toString().padStart(2, '0');
        const stopMinutes = stopTime.getMinutes().toString().padStart(2, '0');
        const stopSeconds = stopTime.getSeconds().toString().padStart(2, '0');
        const formattedStartTime = `${startHours}:${startMinutes}:${startSeconds}`;
        const formattedStopTime = `${stopHours}:${stopMinutes}:${stopSeconds}`;
        firestore().collection('cyclic_scheduler').add({
            cycle,
            isActive: false,
            flow1,
            flow2,
            flow3,
            schedulerName,
            startTime: formattedStartTime,
            stopTime: formattedStopTime,
            created_at: new Date(),
            updated_at: new Date(),
        });
    }

    return <View
        style={{
            flex: 1,
            justifyContent: 'space-between'
        }}
    >
        <ScrollView
            style={{
                height: '90%',
            }}
        >
            {renderScheduler()}
        </ScrollView>

        <View
            style={{
                alignItems: 'center',
            }}
        >
            <TouchableOpacity
                style={{
                    height: 50, width: 250, borderColor: "pink", borderWidth: 1
                }}
                onPress={() => {
                    setIsModalActive(!isModalActive);

                }}
            >
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    backgroundColor: 'white'
                }}>
                    <Text style={{ textAlign: "center", color: "pink" }}>Create New Schedule</Text>
                </View>
            </TouchableOpacity>
            <Modal
                isVisible={isModalActive}
                animationIn="bounceIn"
                animationOut="bounceOut"
            >
                <View
                    style={{
                        backgroundColor: "white",
                        alignItems: "center",
                        paddingVertical: 20,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            width: "90%",
                        }}
                    >
                        <DatePickerCustom
                            label="Start Time"
                            onChange={(date: any) => {
                                setStartTime(date);
                                const startHours = date.getHours().toString().padStart(2, '0');
                                const startMinutes = date.getMinutes().toString().padStart(2, '0');
                                const startSeconds = date.getSeconds().toString().padStart(2, '0');
                                const formattedStartTime = `${startHours}:${startMinutes}:${startSeconds}`;
                                if (schedulers) {
                                    const index = schedulers.findIndex((scheduler: any) => {
                                        const timeToSeconds = ((time: any) => {
                                            if (time) {
                                                const [hours, minutes, seconds] = time.split(':').map(Number);
                                                return hours * 3600 + minutes * 60 + seconds;
                                            }
                                        });
                                        return timeToSeconds(scheduler.startTime) < timeToSeconds(formattedStartTime)
                                            && timeToSeconds(scheduler.stopTime) > timeToSeconds(formattedStartTime)
                                    });
                                    if (index >= 0) {
                                        console.log(schedulers[index]);
                                        setWarning(`At this time, conflict with this schedule`);
                                        setSchedulerName(schedulers[index].schedulerName);
                                        setFlow1(Number(schedulers[index].flow1));
                                        setFlow2(Number(schedulers[index].flow2));
                                        setFlow3(Number(schedulers[index].flow3));
                                    }
                                }
                            }}
                            dateSelected={startTime}
                            mode={'time'}
                            formatType='h:mm:ss a'
                        />
                        <DatePickerCustom
                            label="Stop Time"
                            onChange={setStopTime}
                            dateSelected={stopTime}
                            minimumDate={startTime}
                            mode={'time'}
                            formatType='h:mm:ss a'
                        />
                    </View>

                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {
                            warning ? <View style={{
                                backgroundColor: "#f7f5bc",
                                marginTop: 20
                            }}>
                                <Text style={{ color: 'black' }}>Warning: {warning}</Text>
                            </View> : null
                        }

                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            paddingLeft: 30
                        }}>
                            {renderFlowInputs()}
                        </View>


                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 20,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setIsModalActive(!isModalActive);
                                    pushScheduler();
                                    resetScheduler();
                                }}
                                style={{
                                    height: 50, width: 150, borderColor: "black", borderWidth: 1
                                }}
                            >
                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1
                                }}>
                                    <Text style={{ textAlign: "center", color: "black" }}>Set Schedule</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsModalActive(!isModalActive);
                                    resetScheduler();
                                }}
                                style={{
                                    height: 50, width: 150, borderColor: "black", borderWidth: 1
                                }}
                            >
                                <View style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flex: 1
                                }}>
                                    <Text style={{ textAlign: "center", color: "black" }}>Close</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    </View>
}

export default DailySchedulerComponent;
