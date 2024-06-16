import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card, Text } from 'react-native-paper';
import { styles_button } from './styles_button';
import Modal from "react-native-modal";
import DatePickerCustom from '../../components/datepicker';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import useCalendar from './useCalendar';
import uuid from 'react-native-uuid';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faPenToSquare, faX } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../components/loader';

const CalendarComponent = () => {
    const [items, setItems] = useState<any>({});
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [itemToEdit, setItemToEdit] = useState<any>({});
    const [isModalActive, setIsModalActive] = useState<boolean>(false);
    const [isActivePumpIn, setIsActivePumpIn] = useState<boolean | undefined>(false);
    const [isActivePumpOut, setIsActivePumpOut] = useState<boolean | undefined>(false);
    const [isActiveSubdivision1, setIsActiveSubdivision1] = useState<boolean | undefined>(false);
    const [isActiveSubdivision2, setIsActiveSubdivision2] = useState<boolean | undefined>(false);
    const [isActiveSubdivision3, setIsActiveSubdivision3] = useState<boolean | undefined>(false);
    const [isActiveSolution1, setIsActiveSolution1] = useState<boolean | undefined>(false);
    const [isActiveSolution2, setIsActiveSolution2] = useState<boolean | undefined>(false);
    const [isActiveSolution3, setIsActiveSolution3] = useState<boolean | undefined>(false);
    const [priority, setPriority] = useState<string>("1");
    const [scheduleDate, setScheduleDate] = useState<any>(new Date());
    const [startDate, setStartDate] = useState<any>(new Date());
    const [endDate, setEndDate] = useState<any>(new Date());
    const [show, setShow] = useState<boolean>(true);
    const object: any = useCalendar();

    useEffect(() => {
        let schedulers: any = {};
        if (object != undefined && object.length != 0) {
            object.forEach((scheduler: any) => {
                schedulers[scheduler.id] = scheduler.date;
            });
        }
        setItems(schedulers);
    }, [useCalendar()]);

    const renderPumpStatus = (pumpName: string, status: boolean | undefined) => {
        let style;
        if (status == undefined) {
            return;
        }
        switch (pumpName) {
            case 'pumpin':
            case 'pumpout':
                style = status ? styles_button.button_green_active : styles_button.button_green;
                break;
            case 'subdivision1':
            case 'subdivision2':
            case 'subdivision3':
                style = status ? styles_button.button_purple_active : styles_button.button_purple;
                break;
            case 'solution1':
            case 'solution2':
            case 'solution3':
                style = status ? styles_button.button_blue_active : styles_button.button_blue;
                break;
        }
        return <View style={style}>
            <Text style={{ color: status ? 'white' : 'black' }}>
                {pumpName}
            </Text>
        </View>
    }

    const renderPumpSwitch = (pumpName: string, status: boolean | undefined, setState: React.Dispatch<React.SetStateAction<boolean | undefined>>) => {
        let style;
        switch (pumpName) {
            case 'pumpin':
            case 'pumpout':
                style = status ? styles_button.button_green_active : styles_button.button_green;
                break;
            case 'subdivision1':
            case 'subdivision2':
            case 'subdivision3':
                style = status ? styles_button.button_purple_active : styles_button.button_purple;
                break;
            case 'solution1':
            case 'solution2':
            case 'solution3':
                style = status ? styles_button.button_blue_active : styles_button.button_blue;
                break;
        }
        return <TouchableOpacity
            style={style}
            onPress={() => { setState(!status) }}
        >
            <Text style={{ color: status ? 'white' : 'black' }}>
                {pumpName}
            </Text>
        </TouchableOpacity>
    }

    const renderItem = (item: any) => {
        return (
            <View style={{ marginRight: 10 }}>
                <Card style={{ backgroundColor: "white", marginVertical: 5 }}>
                    <Card.Content>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 5
                                }}
                            >
                                {item.startTime != null && item.last != null ?
                                    <Text>{item.startTime + " last: " + item.last.hours + ":" + item.last.minutes + ":" + item.last.seconds}</Text> : null
                                }

                                <TouchableOpacity
                                    style={{
                                        alignItems: 'center',
                                        borderRadius: 50,
                                        borderWidth: 2,
                                        borderColor: 'green',
                                        width: '10%',
                                        height: 30,
                                        marginVertical: 3,
                                        justifyContent: 'center',
                                        backgroundColor: item.isActive ? 'green' : 'white'
                                    }}
                                    onPress={() => {
                                        firestore().collection("scheduler").doc(item.date).get().then((docSnapShot: any) => {
                                            if (docSnapShot.exists) {
                                                const data = docSnapShot.data();
                                                const schedulers = data.date;
                                                const indexToDelete = schedulers.findIndex((schedule: any) => schedule.id === item.id);
                                                schedulers[indexToDelete].isActive = !schedulers[indexToDelete].isActive;
                                                firestore().collection("scheduler").doc(item.date).set({
                                                    date: schedulers
                                                });
                                            }
                                        });
                                    }}
                                >
                                    {item.isActive ?
                                        <FontAwesomeIcon icon={faCheck} color='white' /> : <FontAwesomeIcon icon={faCheck} color='green' />}

                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={
                                        {
                                            alignItems: 'center',
                                            borderRadius: 50,
                                            borderWidth: 2,
                                            borderColor: 'blue',
                                            width: '10%',
                                            height: 30,
                                            marginVertical: 3,
                                            justifyContent: 'center',
                                        }
                                    }
                                    onPress={() => {
                                        firestore().collection("scheduler").doc(item.date).get().then((docSnapShot: any) => {
                                            if (docSnapShot.exists) {
                                                setIsModalActive(true);
                                                setIsEdit(true);
                                                setItemToEdit(item);
                                                const milliseconds = item.dateStartTime.seconds * 1000;
                                                const startdate = new Date(milliseconds);
                                                const endmilliseconds = item.dateEndTime.seconds * 1000;
                                                const endDate = new Date(endmilliseconds);
                                                setStartDate(startdate);
                                                setEndDate(endDate);
                                                setScheduleDate(new Date(item.date));
                                                setIsActivePumpIn(item.start_schedule.pumpin)
                                                setIsActivePumpOut(item.start_schedule.pumpout);
                                                setIsActiveSubdivision1(item.start_schedule.subdivision1);
                                                setIsActiveSolution1(item.start_schedule.solution1);
                                                setIsActiveSubdivision2(item.start_schedule.subdivision2);
                                                setIsActiveSolution2(item.start_schedule.solution2);
                                                setIsActiveSubdivision3(item.start_schedule.subdivision3);
                                                setIsActiveSolution3(item.start_schedule.solution3);
                                            }
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} size={15} color='blue' />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={
                                        {
                                            alignItems: 'center',
                                            borderRadius: 50,
                                            borderWidth: 2,
                                            borderColor: 'red',
                                            width: '10%',
                                            height: 30,
                                            marginVertical: 3,
                                            justifyContent: 'center',
                                        }
                                    }
                                    onPress={() => {
                                        firestore().collection("scheduler").doc(item.date).get().then((docSnapShot: any) => {
                                            if (docSnapShot.exists) {
                                                const data = docSnapShot.data();
                                                const schedulers = data.date;
                                                if (schedulers.length == 1) {
                                                    firestore().collection("scheduler").doc(item.date).delete();
                                                } else {
                                                    const indexToDelete = schedulers.findIndex((schedule: any) => schedule.id === item.id);
                                                    schedulers.splice(indexToDelete, 1);
                                                    firestore().collection("scheduler").doc(item.date).set({
                                                        date: schedulers
                                                    });
                                                }
                                            }
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faX} size={15} color='red' />
                                </TouchableOpacity>

                            </View>
                            <View>
                                <Text
                                    style={{
                                        paddingStart: 5,
                                        color: 'black'
                                    }}
                                >Priority: {item.priority}</Text>
                            </View>
                            <View
                            >
                                {item.waiting != null ?
                                    <Text
                                        style={{
                                            paddingStart: 5,
                                            color: 'black'
                                        }}
                                    >{"Waiting time: " + item.waiting.hours + ":" + item.waiting.minutes + ":" + item.waiting.seconds}</Text> : null
                                }

                            </View>
                            <View style={{
                                flex: 1,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'wrap'
                            }}>
                                {renderPumpStatus('pumpin', item.start_schedule.pumpin)}
                                {renderPumpStatus('pumpout', item.start_schedule.pumpout)}
                                {renderPumpStatus('subdivision1', item.start_schedule.subdivision1)}
                                {renderPumpStatus('solution1', item.start_schedule.solution1)}
                                {renderPumpStatus('subdivision2', item.start_schedule.subdivision2)}
                                {renderPumpStatus('solution2', item.start_schedule.solution2)}
                                {renderPumpStatus('subdivision3', item.start_schedule.subdivision3)}
                                {renderPumpStatus('solution3', item.start_schedule.solution3)}
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        );
    };

    const resetSwitch = () => {
        setIsActivePumpIn(false);
        setIsActivePumpOut(false);
        setIsActiveSubdivision1(false);
        setIsActiveSubdivision2(false);
        setIsActiveSubdivision3(false);
        setIsActiveSolution1(false);
        setIsActiveSolution2(false);
        setIsActiveSolution3(false);
        setScheduleDate(new Date());
        setStartDate(new Date());
        setEndDate(new Date());
    }

    const setObjectSchedule = () => {
        const date = moment(scheduleDate).format('YYYY-MM-DD');
        const parsedStartDate = moment(startDate);
        const parsedEndDate = moment(endDate);

        const formattedStartTime = parsedStartDate.format('H:mm:ss');
        const formattedEndTime = parsedEndDate.format('H:mm:ss');
        const startTime = moment(formattedStartTime, 'H:mm:ss');
        const endTime = moment(formattedEndTime, 'H:mm:ss');
        const timeDifferenceInMilliseconds = endTime.diff(startTime);
        const duration = moment.duration(timeDifferenceInMilliseconds);
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        const last = {
            hours,
            minutes,
            seconds,
        };
        const pumpin = isActivePumpIn ? isActivePumpIn : undefined;
        const pumpout = isActivePumpOut ? isActivePumpOut : undefined;
        const solution1 = isActiveSolution1 ? isActiveSolution1 : undefined;
        const solution2 = isActiveSolution2 ? isActiveSolution2 : undefined;
        const solution3 = isActiveSolution3 ? isActiveSolution3 : undefined;
        const subdivision1 = isActiveSubdivision1 ? isActiveSubdivision1 : undefined;
        const subdivision2 = isActiveSubdivision2 ? isActiveSubdivision2 : undefined;
        const subdivision3 = isActiveSubdivision3 ? isActiveSubdivision3 : undefined;
        const schedulerObject = {
            date: [{
                id: uuid.v4(),
                date,
                dateStartTime: startDate,
                dateEndTime: endDate,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                isActive: true,
                last,
                priority,
                start_schedule: {
                    ...(pumpin !== undefined && { pumpin }),
                    ...(pumpout !== undefined && { pumpout }),
                    ...(subdivision1 !== undefined && { subdivision1 }),
                    ...(subdivision2 !== undefined && { subdivision2 }),
                    ...(subdivision3 !== undefined && { subdivision3 }),
                    ...(solution1 !== undefined && { solution1 }),
                    ...(solution2 !== undefined && { solution2 }),
                    ...(solution3 !== undefined && { solution3 }),
                },
                end_schedule: {
                    ...(pumpin !== undefined && { pumpin: !pumpin }),
                    ...(pumpout !== undefined && { pumpout: !pumpout }),
                    ...(subdivision1 !== undefined && { subdivision1: !subdivision1 }),
                    ...(subdivision2 !== undefined && { subdivision2: !subdivision2 }),
                    ...(subdivision3 !== undefined && { subdivision3: !subdivision3 }),
                    ...(solution1 !== undefined && { solution1: !solution1 }),
                    ...(solution2 !== undefined && { solution2: !solution2 }),
                    ...(solution3 !== undefined && { solution3: !solution3 }),
                },
            },
            ],
        };
        const schedulerObjecToPush = {
            id: uuid.v4(),
            date,
            dateStartTime: startDate,
            dateEndTime: endDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            isActive: true,
            last,
            priority,
            start_schedule: {
                ...(pumpin !== undefined && { pumpin }),
                ...(pumpout !== undefined && { pumpout }),
                ...(subdivision1 !== undefined && { subdivision1 }),
                ...(subdivision2 !== undefined && { subdivision2 }),
                ...(subdivision3 !== undefined && { subdivision3 }),
                ...(solution1 !== undefined && { solution1 }),
                ...(solution2 !== undefined && { solution2 }),
                ...(solution3 !== undefined && { solution3 }),
            },
            end_schedule: {
                ...(pumpin !== undefined && { pumpin: !pumpin }),
                ...(pumpout !== undefined && { pumpout: !pumpout }),
                ...(subdivision1 !== undefined && { subdivision1: !subdivision1 }),
                ...(subdivision2 !== undefined && { subdivision2: !subdivision2 }),
                ...(subdivision3 !== undefined && { subdivision3: !subdivision3 }),
                ...(solution1 !== undefined && { solution1: !solution1 }),
                ...(solution2 !== undefined && { solution2: !solution2 }),
                ...(solution3 !== undefined && { solution3: !solution3 }),
            },
        };

        let schedulers: any = {};
        firestore().collection("scheduler").doc(date).get().then(docSnapShot => {
            if (docSnapShot.exists) {
                let scheduler: any = docSnapShot.data();
                scheduler.date.push(schedulerObjecToPush);
                schedulers = { ...scheduler };
                firestore().collection("scheduler").doc(date).set(schedulers);
            } else {
                firestore().collection("scheduler").doc(date).set(schedulerObject);
            }
        })
            .then(() => {
                console.log("Schedulers updated successfully in Firestore.");
            })
            .catch((error) => {
                console.log("Error updating schedulers in Firestore: ", error);
            });
    }


    const editSchedule = () => {
        const date = moment(scheduleDate).format('YYYY-MM-DD');
        const parsedStartDate = moment(startDate);
        const parsedEndDate = moment(endDate);
        const formattedStartTime = parsedStartDate.format('H:mm:ss');
        const formattedEndTime = parsedEndDate.format('H:mm:ss');

        const pumpin = isActivePumpIn ? isActivePumpIn : undefined;
        const pumpout = isActivePumpOut ? isActivePumpOut : undefined;
        const solution1 = isActiveSolution1 ? isActiveSolution1 : undefined;
        const solution2 = isActiveSolution2 ? isActiveSolution2 : undefined;
        const solution3 = isActiveSolution3 ? isActiveSolution3 : undefined;
        const subdivision1 = isActiveSubdivision1 ? isActiveSubdivision1 : undefined;
        const subdivision2 = isActiveSubdivision2 ? isActiveSubdivision2 : undefined;
        const subdivision3 = isActiveSubdivision3 ? isActiveSubdivision3 : undefined;

        const schedulerObjecToPush = {
            id: itemToEdit.id,
            date,
            dateStartTime: startDate,
            dateEndTime: endDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            start_schedule: {
                ...(pumpin !== undefined && { pumpin }),
                ...(pumpout !== undefined && { pumpout }),
                ...(subdivision1 !== undefined && { subdivision1 }),
                ...(subdivision2 !== undefined && { subdivision2 }),
                ...(subdivision3 !== undefined && { subdivision3 }),
                ...(solution1 !== undefined && { solution1 }),
                ...(solution2 !== undefined && { solution2 }),
                ...(solution3 !== undefined && { solution3 }),
            },
            end_schedule: {
                ...(pumpin !== undefined && { pumpin: !pumpin }),
                ...(pumpout !== undefined && { pumpout: !pumpout }),
                ...(subdivision1 !== undefined && { subdivision1: !subdivision1 }),
                ...(subdivision2 !== undefined && { subdivision2: !subdivision2 }),
                ...(subdivision3 !== undefined && { subdivision3: !subdivision3 }),
                ...(solution1 !== undefined && { solution1: !solution1 }),
                ...(solution2 !== undefined && { solution2: !solution2 }),
                ...(solution3 !== undefined && { solution3: !solution3 }),
            },
        };

        firestore().collection("scheduler").doc(date).get().then(docSnapShot => {
            if (docSnapShot.exists) {
                const data: any = docSnapShot.data();
                const schedulers = data.date;
                const indexToEdit = schedulers.findIndex((schedule: any) => schedule.id === itemToEdit.id);
                schedulers.splice(indexToEdit, 1, schedulerObjecToPush);
                console.log(schedulers);
                firestore().collection("scheduler").doc(itemToEdit.date).set({
                    date: schedulers
                });
            }
        });
    }

    if (!items) {
        return < Loader />
    }

    return (
        <View style={{ flex: 1 }}>
            <Agenda
                items={items}
                renderItem={renderItem}
                renderEmptyDate={() => {
                    return <View />;
                }}
                onDayPress={day => {
                    setScheduleDate(new Date(day.timestamp))
                }}
                renderEmptyData={() => {
                    return <View
                        style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text>No Schedule</Text>
                    </View>;
                }}
            />
            <View
                style={{
                    display: "flex",
                    alignItems: "center",
                }}>
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
                            height: '60%',
                        }}
                    >
                        <SafeAreaView
                            style={{
                                width: '90%',
                                justifyContent: 'center',
                                flexDirection: "row",
                                marginBottom: 20,

                            }}
                        >
                            <View
                                style={{
                                    width: '45%',
                                    borderRadius: 15,
                                    borderColor: '#E6E6E6',
                                    borderWidth: 1,
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                color: '#CDCDCD',
                                                fontSize: 12,
                                                paddingStart: 13,
                                            }}>Priority</Text>
                                    </View>
                                </View>
                                <TextInput
                                    keyboardType="numeric"
                                    onFocus={() => { setShow(false) }}
                                    onBlur={() => {
                                        setShow(true)
                                    }}
                                    style={{
                                        color: "black",
                                    }}
                                    value={priority}
                                    onChangeText={(value: any) => setPriority(value)}
                                />
                            </View>

                        </SafeAreaView>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: 'space-between',
                                width: "90%",
                                marginBottom: 20
                            }}
                        >
                            <DatePickerCustom
                                label="Start Time"
                                onChange={(date) => {
                                    setStartDate(date);
                                    setEndDate(date);
                                    const formateddate = moment(date).format('YYYY-MM-DD');
                                    if (items[formateddate]) {
                                        const index = items[formateddate].findIndex((item: any) => {
                                            const dateStartTimestamp = new Date(item.dateStartTime.seconds * 1000);
                                            const dateEndTimestamp = new Date(item.dateEndTime.seconds * 1000);
                                            const dateFromISOString = new Date(date);
                                            return dateStartTimestamp.getTime() < dateFromISOString.getTime()
                                                && dateEndTimestamp.getTime() > dateFromISOString.getTime();
                                        })
                                        if (index >= 0) {
                                            setIsActivePumpIn(items[formateddate][index].start_schedule.pumpin);
                                            setIsActivePumpOut(items[formateddate][index].start_schedule.pumpout);
                                            setIsActiveSubdivision1(items[formateddate][index].start_schedule.subdivision1);
                                            setIsActiveSolution1(items[formateddate][index].start_schedule.solution1);
                                            setIsActiveSubdivision2(items[formateddate][index].start_schedule.subdivision2);
                                            setIsActiveSolution2(items[formateddate][index].start_schedule.solution2);
                                            setIsActiveSubdivision3(items[formateddate][index].start_schedule.subdivision3);
                                            setIsActiveSolution3(items[formateddate][index].start_schedule.solution3);
                                        }
                                    }
                                }}
                                dateSelected={startDate}
                                mode={'time'}
                                formatType='h:mm:ss a'
                            />
                            <DatePickerCustom
                                label="End Time"
                                onChange={setEndDate}
                                dateSelected={endDate}
                                minimumDate={startDate}
                                mode={'time'}
                                formatType='h:mm:ss a'
                            />
                        </View>
                        {
                            show ? <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    width: '90%'
                                }}
                            >
                                {renderPumpSwitch('pumpin', isActivePumpIn, setIsActivePumpIn)}
                                {renderPumpSwitch('pumpout', isActivePumpOut, setIsActivePumpOut)}
                                {renderPumpSwitch('subdivision1', isActiveSubdivision1, setIsActiveSubdivision1)}
                                {renderPumpSwitch('solution1', isActiveSolution1, setIsActiveSolution1)}
                                {renderPumpSwitch('subdivision2', isActiveSubdivision2, setIsActiveSubdivision2)}
                                {renderPumpSwitch('solution2', isActiveSolution2, setIsActiveSolution2)}
                                {renderPumpSwitch('subdivision3', isActiveSubdivision3, setIsActiveSubdivision3)}
                                {renderPumpSwitch('solution3', isActiveSolution3, setIsActiveSolution3)}
                            </View> : null
                        }
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            {
                                isEdit ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            setIsModalActive(!isModalActive);
                                            resetSwitch();
                                            setIsEdit(false);
                                            editSchedule();
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
                                    : show ? <TouchableOpacity
                                        onPress={() => {
                                            setIsModalActive(!isModalActive);
                                            resetSwitch();
                                            setObjectSchedule();
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
                                    </TouchableOpacity> : null
                            }
                            {
                                show ? <TouchableOpacity
                                    onPress={() => {
                                        setIsModalActive(!isModalActive);
                                        resetSwitch();
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
                                </TouchableOpacity> : null
                            }
                        </View>
                    </View>
                </Modal>
            </View >
        </View >
    );
}

export default CalendarComponent;
