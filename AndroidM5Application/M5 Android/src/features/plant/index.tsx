import { useEffect, useState, Fragment, Component } from "react";
import { Image, PermissionsAndroid, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import firestore from '@react-native-firebase/firestore';
import Modal from "react-native-modal";
import { Images } from "../../assets";
import { faDroplet, faK, faN, faP, faSun, faTemperatureHalf, faWater, faWind } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Loader from "../../components/loader";
import SearchableDropdown from 'react-native-searchable-dropdown';
import usePlant from "./usePlant";
import data_plant from "../../utils/data_plants.json"
import setCondition from "./setCondition";
import messaging from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth';

const PlantNavigator = () => {

    useEffect(() => {
        const requestNotificationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    const token = await messaging().getToken();
                    const id = auth().currentUser?.uid;
                    firestore().collection('fcm_token').doc(id).set({ token });
                    console.log('You can use this token', token);
                } else {
                    console.log('Camera permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        };

        requestNotificationPermission();
    }, []);

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {

        });

        return unsubscribe;
    }, []);



    const [modal_active, setModalActive] = useState<boolean>(false);
    const [modal_content, setModalContent] = useState<any>([]);

    const [plant_name, setPlantName] = useState<string>("");

    const [min_air_temperature, setMinAirTemperature] = useState<any>(null);
    const [max_air_temperature, setMaxAirTemperature] = useState<any>(null);
    const [min_air_humidity, setMinAirHumidity] = useState<any>(null);
    const [max_air_humidity, setMaxAirHumidity] = useState<any>(null);
    const [min_air_atmosphere, setMinAirAtmosphere] = useState<any>(null);
    const [max_air_atmosphere, setMaxAirAtmosphere] = useState<any>(null);
    const [min_air_brightness, setMinAirBrightness] = useState<any>(null);
    const [max_air_brightness, setMaxAirBrightness] = useState<any>(null);

    const [min_water_temperature, setMinWaterTemperature] = useState<any>(null);
    const [max_water_temperature, setMaxWaterTemperature] = useState<any>(null);
    const [min_water_ec, setMinWaterEC] = useState<any>(null);
    const [max_water_ec, setMaxWaterEC] = useState<any>(null);
    const [min_water_orp, setMinWaterORP] = useState<any>(null);
    const [max_water_orp, setMaxWaterORP] = useState<any>(null);
    const [min_water_ph, setMinWaterPH] = useState<any>(null);
    const [max_water_ph, setMaxWaterPH] = useState<any>(null);
    const [min_water_salinity, setMinWaterSalinity] = useState<any>(null);
    const [max_water_salinity, setMaxWaterSalinity] = useState<any>(null);

    const [min_soil_temperature, setMinSoilTemperature] = useState<any>(null);
    const [max_soil_temperature, setMaxSoilTemperature] = useState<any>(null);
    const [min_soil_humidity, setMinSoilHumidity] = useState<any>(null);
    const [max_soil_humidity, setMaxSoilHumidity] = useState<any>(null);
    const [min_soil_ph, setMinSoilPH] = useState<any>(null);
    const [max_soil_ph, setMaxSoilPH] = useState<any>(null);
    const [min_soil_ec, setMinSoilEC] = useState<any>(null);
    const [max_soil_ec, setMaxSoilEC] = useState<any>(null);
    const [min_soil_nitro, setMinSoilNitro] = useState<any>(null);
    const [max_soil_nitro, setMaxSoilNitro] = useState<any>(null);
    const [min_soil_phosphorus, setMinSoilPhosphorus] = useState<any>(null);
    const [max_soil_phosphorus, setMaxSoilPhosphorus] = useState<any>(null);
    const [min_soil_potalium, setMinSoilPotalium] = useState<any>(null);
    const [max_soil_potalium, setMaxSoilPotalium] = useState<any>(null);

    const functionUseStateSoil: Array<any> = [
        {
            labelMin: "Min Soil Temperature",
            stateMin: min_soil_temperature,
            functionMin: setMinSoilTemperature,
            icon: <FontAwesomeIcon icon={faTemperatureHalf} size={40} color='#FF3333' />,
            labelMax: "Max Soil Temperature",
            stateMax: max_soil_temperature,
            functionMax: setMaxSoilTemperature,
        },
        {
            labelMin: "Min Soil Humidity",
            stateMin: min_soil_humidity,
            functionMin: setMinSoilHumidity,
            icon: <FontAwesomeIcon icon={faDroplet} size={40} color='#99CCFF' />,
            labelMax: "Max Soil Humidity",
            stateMax: max_soil_humidity,
            functionMax: setMaxSoilHumidity
        },
        {
            labelMin: "Min Soil PH",
            stateMin: min_soil_ph,
            functionMin: setMinSoilPH,
            icon: <Image source={Images.ph} style={{ width: 40, height: 40, tintColor: "#99EDC3" }} />,
            labelMax: "Max Soil PH",
            stateMax: max_soil_ph,
            functionMax: setMaxSoilPH
        },
        {
            labelMin: "Min Soil EC",
            stateMin: min_soil_ec,
            functionMin: setMinSoilEC,
            icon: <Image source={Images.ec} style={{ width: 40, height: 40, }} />,
            labelMax: "Max Soil EC",
            stateMax: max_soil_ec,
            functionMax: setMaxSoilEC
        },
        {
            labelMin: "Min Soil Nitro",
            stateMin: min_soil_nitro,
            functionMin: setMinSoilNitro,
            icon: <FontAwesomeIcon icon={faN} size={40} color='#F5C116' />,
            labelMax: "Max Soil Nitro",
            stateMax: max_soil_nitro,
            functionMax: setMaxSoilNitro
        },
        {
            labelMin: "Min Soil Phosphorus",
            stateMin: min_soil_phosphorus,
            functionMin: setMinSoilPhosphorus,
            icon: <FontAwesomeIcon icon={faP} size={40} color='#D580FF' />,
            labelMax: "Max Soil Phosphorus",
            stateMax: max_soil_phosphorus,
            functionMax: setMaxSoilPhosphorus
        },
        {
            labelMin: "Min Soil Potalium",
            stateMin: min_soil_potalium,
            functionMin: setMinSoilPotalium,
            icon: <FontAwesomeIcon icon={faK} size={40} color='#AAC3F4' />,
            labelMax: "Max Soil Potalium",
            stateMax: max_soil_potalium,
            functionMax: setMaxSoilPotalium
        },
    ];

    const functionUseStateAir: Array<any> = [
        {
            labelMin: "Min Air Temperature",
            stateMin: min_air_temperature,
            functionMin: setMinAirTemperature,
            icon: <FontAwesomeIcon icon={faTemperatureHalf} size={40} color='#FF3333' />,
            labelMax: "Max Air Temperature",
            stateMax: max_air_temperature,
            functionMax: setMaxAirTemperature,
        },
        {
            labelMin: "Min Air Humidity",
            stateMin: min_air_humidity,
            functionMin: setMinAirHumidity,
            icon: <FontAwesomeIcon icon={faDroplet} size={40} color='#99CCFF' />,
            labelMax: "Max Air Humidity",
            stateMax: max_air_humidity,
            functionMax: setMaxAirHumidity,
        },
        {
            labelMin: "Min Co2 Atmosphere",
            stateMin: min_air_atmosphere,
            functionMin: setMinAirAtmosphere,
            icon: <Image source={Images.co2} style={{ width: 40, height: 40 }} />,
            labelMax: "Max Co2 Atmosphere",
            stateMax: max_air_atmosphere,
            functionMax: setMaxAirAtmosphere,
        },
        {
            labelMin: "Min Air Brightness",
            stateMin: min_air_brightness,
            functionMin: setMinAirBrightness,
            icon: <FontAwesomeIcon icon={faSun} size={40} color='#99CCFF' />,
            labelMax: "Max Air Brightness",
            stateMax: max_air_brightness,
            functionMax: setMaxAirBrightness,
        },
    ];

    const functionUseStateWater: Array<any> = [
        {
            labelMin: "Min Water Temperature",
            stateMin: min_water_temperature,
            functionMin: setMinWaterTemperature,
            icon: <FontAwesomeIcon icon={faTemperatureHalf} size={40} color='#FF3333' />,
            labelMax: "Max Water Temperature",
            stateMax: max_water_temperature,
            functionMax: setMaxWaterTemperature,
        },
        {
            labelMin: "Min Water EC",
            stateMin: min_water_ec,
            functionMin: setMinWaterEC,
            icon: <Image source={Images.ec} style={{ width: 40, height: 40, }} />,
            labelMax: "Max Water EC",
            stateMax: max_water_ec,
            functionMax: setMaxWaterEC,
        },
        {
            labelMin: "Min Water ORP",
            stateMin: min_water_orp,
            functionMin: setMinWaterORP,
            icon: <Image source={Images.orp} style={{ width: 40, height: 40 }} />,
            labelMax: "Max Water ORP",
            stateMax: max_water_orp,
            functionMax: setMaxWaterORP,
        },
        {
            labelMin: "Min Water PH",
            stateMin: min_water_ph,
            functionMin: setMinWaterPH,
            icon: <Image source={Images.ph} style={{ width: 40, height: 40, }} />,
            labelMax: "Max Water PH",
            stateMax: max_water_ph,
            functionMax: setMaxWaterPH,
        },
        {
            labelMin: "Min Water Salinity",
            stateMin: min_water_salinity,
            functionMin: setMinWaterSalinity,
            icon: <Image source={Images.salinity} style={{ width: 40, height: 40, }} />,
            labelMax: "Max Water Salinity",
            stateMax: max_water_salinity,
            functionMax: setMaxWaterSalinity,
        },
    ];

    useEffect(() => {
        const firebaseConnection = () => {
            firestore().collection('range_condition').onSnapshot(data => {
                data.forEach((item) => {
                    if (item.data().plant_name == undefined || item.data().plant_name == null) setPlantName("");
                    else setPlantName(item.data().plant_name);
                    if (item.data().min_soil_temperature == undefined || item.data().min_soil_temperature == null) setMinSoilTemperature("");
                    else setMinSoilTemperature(item.data().min_soil_temperature);
                    if (item.data().max_soil_temperature == undefined || item.data().max_soil_temperature == null) setMaxSoilTemperature("");
                    else setMaxSoilTemperature(item.data().max_soil_temperature);
                    if (item.data().min_soil_humidity == undefined || item.data().min_soil_humidity == null) setMinSoilHumidity("");
                    else setMinSoilHumidity(item.data().min_soil_humidity);
                    if (item.data().max_soil_humidity == undefined || item.data().min_soil_humidity == null) setMaxSoilHumidity("");
                    else setMaxSoilHumidity(item.data().max_soil_humidity);
                    if (item.data().min_soil_ph == undefined || item.data().min_soil_ph == null) setMinSoilPH("");
                    else setMinSoilPH(item.data().min_soil_ph);
                    if (item.data().max_soil_ph == undefined || item.data().max_soil_ph == null) setMaxSoilPH("");
                    else setMaxSoilPH(item.data().max_soil_ph);
                    if (item.data().min_soil_ec == undefined || item.data().min_soil_ec == null) setMinSoilEC("");
                    else setMinSoilEC(item.data().min_soil_ec);
                    if (item.data().max_soil_ec == undefined || item.data().max_soil_ec == null) setMaxSoilEC("");
                    else setMaxSoilEC(item.data().max_soil_ec);
                    if (item.data().min_soil_nitro == undefined || item.data().min_soil_nitro == null) setMinSoilNitro("");
                    else setMinSoilNitro(item.data().min_soil_nitro);
                    if (item.data().max_soil_nitro == undefined || item.data().max_soil_nitro == null) setMaxSoilNitro("");
                    else setMaxSoilNitro(item.data().max_soil_nitro);
                    if (item.data().min_soil_phosphorus == undefined || item.data().min_soil_phosphorus == null) setMinSoilPhosphorus("");
                    else setMinSoilPhosphorus(item.data().min_soil_phosphorus);
                    if (item.data().max_soil_phosphorus == undefined || item.data().max_soil_phosphorus == null) setMaxSoilPhosphorus("");
                    else setMaxSoilPhosphorus(item.data().max_soil_phosphorus);
                    if (item.data().min_soil_potalium == undefined || item.data().min_soil_potalium == null) setMinSoilPotalium("");
                    else setMinSoilPotalium(item.data().min_soil_potalium);
                    if (item.data().max_soil_potalium == undefined || item.data().max_soil_potalium == null) setMaxSoilPotalium("");
                    else setMaxSoilPotalium(item.data().max_soil_potalium);
                    if (item.data().max_soil_potalium == undefined || item.data().max_soil_potalium == null) setMaxSoilPotalium("");
                    else setMaxSoilPotalium(item.data().max_soil_potalium);

                    if (item.data().min_air_temperature == undefined || item.data().min_air_temperature == null) setMinAirTemperature("");
                    else setMinAirTemperature(item.data().min_air_temperature);
                    if (item.data().max_air_temperature == undefined || item.data().max_air_temperature == null) setMaxAirTemperature("");
                    else setMaxAirTemperature(item.data().max_air_temperature);
                    if (item.data().min_air_humidity == undefined || item.data().min_air_humidity == null) setMinAirHumidity("");
                    else setMinAirHumidity(item.data().min_air_humidity);
                    if (item.data().max_air_humidity == undefined || item.data().max_air_humidity == null) setMaxAirHumidity("");
                    else setMaxAirHumidity(item.data().max_air_humidity);
                    if (item.data().min_air_atmosphere == undefined || item.data().min_air_atmosphere == null) setMinAirAtmosphere("");
                    else setMinAirAtmosphere(item.data().min_air_atmosphere);
                    if (item.data().max_air_atmosphere == undefined || item.data().max_air_atmosphere == null) setMaxAirAtmosphere("");
                    else setMaxAirAtmosphere(item.data().max_air_atmosphere);
                    if (item.data().min_air_brightness == undefined || item.data().min_air_brightness == null) setMinAirBrightness("");
                    else setMinAirBrightness(item.data().min_air_brightness);
                    if (item.data().max_air_brightness == undefined || item.data().max_air_brightness == null) setMaxAirBrightness("");
                    else setMaxAirBrightness(item.data().max_air_brightness);

                    if (item.data().min_water_temperature == undefined || item.data().min_water_temperature == null) setMinWaterTemperature("");
                    else setMinWaterTemperature(item.data().min_water_temperature);
                    if (item.data().max_water_temperature == undefined || item.data().max_water_temperature == null) setMaxWaterTemperature("");
                    else setMaxWaterTemperature(item.data().max_water_temperature);
                    if (item.data().min_water_ec == undefined || item.data().min_water_ec == null) setMinWaterEC("");
                    else setMinWaterEC(item.data().min_water_ec);
                    if (item.data().max_water_ec == undefined || item.data().max_water_ec == null) setMaxWaterEC("");
                    else setMaxWaterEC(item.data().max_water_ec);
                    if (item.data().min_water_orp == undefined || item.data().min_water_orp == null) setMinWaterORP("");
                    else setMinWaterORP(item.data().min_water_orp);
                    if (item.data().max_water_orp == undefined || item.data().max_water_orp == null) setMaxWaterORP("");
                    else setMaxWaterORP(item.data().max_water_orp);
                    if (item.data().min_water_ph == undefined || item.data().min_water_ph == null) setMinWaterPH("");
                    else setMinWaterPH(item.data().min_water_ph);
                    if (item.data().max_water_ph == undefined || item.data().max_water_ph == null) setMaxWaterPH("");
                    else setMaxWaterPH(item.data().max_water_ph);
                    if (item.data().min_water_salinity == undefined || item.data().min_water_salinity == null) setMinWaterSalinity("");
                    else setMinWaterSalinity(item.data().min_water_salinity);
                    if (item.data().max_water_salinity == undefined || item.data().max_water_salinity == null) setMaxWaterSalinity("");
                    else setMaxWaterSalinity(item.data().max_water_salinity);
                });
            });
        }

        firebaseConnection();
    }, []);

    const RenderTextInput = (useStateFunctionArray: any) => {
        return useStateFunctionArray.map((state: any) => {
            return (
                <View
                    key={state.labelMin}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <View
                        style={{
                            marginBottom: 20,
                            borderColor: "black",
                            borderRadius: 10,
                            borderWidth: 2,
                            width: "32%",
                        }}
                    >
                        <TextInput
                            keyboardType="numeric"
                            style={{
                                color: "black"
                            }}
                            value={state.stateMin}
                            onChangeText={(value: any) => state.functionMin(value)}
                        />
                    </View>
                    <View style={{ alignItems: 'center', paddingTop: 8 }}>
                        {state.icon}
                    </View>
                    <View
                        style={{
                            marginBottom: 20,
                            borderColor: "black",
                            borderRadius: 10,
                            borderWidth: 2,
                            width: "32%",
                        }}
                    >
                        <TextInput
                            keyboardType="numeric"
                            style={{
                                color: "black"
                            }}
                            value={state.stateMax}
                            onChangeText={(value: any) => state.functionMax(value)}
                        />
                    </View>
                </View>
            );
        })
    }

    const setRangeForCondition = () => {
        let array_to_store_modal_content: any = [];
        functionUseStateAir.forEach((element: any) => {
            if (element.state == null) {
                array_to_store_modal_content = [...array_to_store_modal_content, { label: element.label }];
            }
        });
        functionUseStateSoil.forEach((element: any) => {
            if (element.state == null) {
                array_to_store_modal_content = [...array_to_store_modal_content, { label: element.label }];
            }
        });
        setModalActive(true);
        setModalContent(array_to_store_modal_content);
        if (modal_content.length === 0) {
            firestore().collection("range_condition").doc("VzY90U96wt8ysBEkMebC").set({
                plant_name: plant_name,
                min_soil_temperature: String(min_soil_temperature),
                max_soil_temperature: String(max_soil_temperature),
                min_soil_humidity: String(min_soil_humidity),
                max_soil_humidity: String(max_soil_humidity),
                min_soil_ec: String(min_soil_ec),
                max_soil_ec: String(max_soil_ec),
                min_soil_ph: String(min_soil_ph),
                max_soil_ph: String(max_soil_ph),
                min_soil_nitro: String(min_soil_nitro),
                max_soil_nitro: String(max_soil_nitro),
                min_soil_phosphorus: String(min_soil_phosphorus),
                max_soil_phosphorus: String(max_soil_phosphorus),
                min_soil_potalium: String(min_soil_potalium),
                max_soil_potalium: String(max_soil_potalium),
                min_air_temperature: String(min_air_temperature),
                max_air_temperature: String(max_air_temperature),
                min_air_humidity: String(min_air_humidity),
                max_air_humidity: String(max_air_humidity),
                min_air_atmosphere: String(min_air_atmosphere),
                max_air_atmosphere: String(max_air_atmosphere),
                min_air_brightness: String(min_air_brightness),
                max_air_brightness: String(max_air_brightness),
                min_water_temperature: String(min_water_temperature),
                max_water_temperature: String(max_water_temperature),
                min_water_ec: String(min_water_ec),
                max_water_ec: String(max_water_ec),
                min_water_orp: String(min_water_orp),
                max_water_orp: String(max_water_orp),
                min_water_ph: String(min_water_ph),
                max_water_ph: String(max_water_ph),
                min_water_salinity: String(min_water_salinity),
                max_water_salinity: String(max_water_salinity),
            });
        }
    }
    if (!plant_name) {
        return <Loader />
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ height: "12%", zIndex: 10 }}>
                <View>
                    <SearchableDropdown
                        onItemSelect={(item: any) => {
                            setPlantName(item.name);
                            setCondition(
                                setMinAirTemperature,
                                setMaxAirTemperature,
                                setMinAirHumidity,
                                setMaxAirHumidity,
                                setMinAirAtmosphere,
                                setMaxAirAtmosphere,
                                setMinAirBrightness,
                                setMaxAirBrightness,

                                setMinWaterTemperature,
                                setMaxWaterTemperature,
                                setMinWaterEC,
                                setMaxWaterEC,
                                setMinWaterORP,
                                setMaxWaterORP,
                                setMinWaterPH,
                                setMaxWaterPH,
                                setMinWaterSalinity,
                                setMaxWaterSalinity,

                                setMinSoilTemperature,
                                setMaxSoilTemperature,
                                setMinSoilHumidity,
                                setMaxSoilHumidity,
                                setMinSoilPH,
                                setMaxSoilPH,
                                setMinSoilEC,
                                setMaxSoilEC,
                                setMinSoilNitro,
                                setMaxSoilNitro,
                                setMinSoilPhosphorus,
                                setMaxSoilPhosphorus,
                                setMinSoilPotalium,
                                setMaxSoilPotalium,
                                item.condition
                            );
                        }}
                        defaultIndex={usePlant(plant_name).index}
                        containerStyle={{ padding: 5 }}
                        itemStyle={{
                            padding: 10,
                            backgroundColor: 'white',
                            borderColor: 'black',
                            borderWidth: 1,
                            borderRadius: 5,
                        }}
                        itemTextStyle={{ color: '#222' }}
                        itemsContainerStyle={{ maxHeight: 200 }}
                        items={data_plant}
                        textInputProps={
                            {
                                placeholder: plant_name,
                                underlineColorAndroid: "transparent",
                                style: {
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                },
                            }
                        }
                        listProps={
                            {
                                nestedScrollEnabled: true,
                            }
                        }
                    />
                </View>
            </View>
            {(!plant_name) ? <Loader /> : <View style={{ justifyContent: "center", alignItems: 'center', marginBottom: 20, zIndex: -999 }}>
                <Image source={{ uri: usePlant(plant_name).image }} style={{ width: 200, height: 200, borderRadius: 200 / 2 }} />
            </View>}


            <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={Images.soil} style={{ width: 40, height: 40 }} />
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <View>
                                <Text>Min</Text>
                            </View>
                            <View style={{ width: 57 }} />
                            <View>
                                <Text>Max</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView>
                        {RenderTextInput(functionUseStateSoil)}
                    </ScrollView>
                </View>
                <View style={{ width: 20 }} />
                <View style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faWind} size={40} color='black' />
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <View>
                                <Text>Min</Text>
                            </View>
                            <View style={{ width: 57 }} />
                            <View>
                                <Text>Max</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                        {RenderTextInput(functionUseStateAir)}
                    </ScrollView>
                </View>
                <View style={{ width: 20 }} />
                <View style={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faWater} size={40} color='#99CCFF' />
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <View>
                                <Text>Min</Text>
                            </View>
                            <View style={{ width: 57 }} />
                            <View>
                                <Text>Max</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                        {RenderTextInput(functionUseStateWater)}
                    </ScrollView>
                </View>
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{
                    height: 50,
                    width: 100,
                    justifyContent: "center",
                    borderBlockColor: "black",
                    borderWidth: 1,
                    borderRadius: 10,
                }}
                    onPress={setRangeForCondition}
                >
                    <Text style={{ textAlign: "center", color: "black" }}>
                        Set
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                isVisible={modal_active}
                animationIn="bounceIn"
                animationOut="bounceOut"
            >
                <View
                    style={{
                        backgroundColor: "white",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 20,
                    }}
                >
                    <View >
                        <Text style={{ color: "black" }}>Your condition range has been set</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => { setModalActive(false); }}
                        style={{
                            height: 50, width: 250, borderColor: "black", borderWidth: 1, marginTop: 50
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
            </Modal>
        </View>
    );
}

export default PlantNavigator;
