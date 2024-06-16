import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { Images } from '../../assets';
import { faDroplet, faExclamation, faSun, faTemperatureHalf } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { styles } from './style';
import useAirFacade from './useAirFacade';
import useRangeFacade from '../useRangeFacade';

const AirStack = ({ navigation }: { navigation: any }) => {
    const metrics = useAirFacade();
    const condition_range = useRangeFacade();

    const onClick = (address: string) => {
        navigation.navigate(`${address}`);
    };

    const checkWarning = (dataState: any, min: number, max: number) => {
        if (dataState) {
            if (Number(dataState[0].value) < min || Number(dataState[0].value) > max) {
                return (
                    <View style={styles.warning}>
                        <Animatable.View animation='swing' iterationCount={'infinite'} >
                            <FontAwesomeIcon icon={faExclamation} size={35} color='#CC3300' />
                        </Animatable.View>
                    </View>
                );
            } else return null;
        } else return null;
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.buttonWrapper}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={styles.button} onPress={() => { onClick('Temperature') }}>
                            <FontAwesomeIcon icon={faTemperatureHalf} size={50} color='#FF3333' />
                            {checkWarning(metrics.temperatureState, condition_range.min_air_temperature, condition_range.max_air_temperature)}
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}>Temperature</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={styles.humidity} onPress={() => { onClick('Humidity') }}>
                            <FontAwesomeIcon icon={faDroplet} size={50} color='#99CCFF' />
                            {checkWarning(metrics.humidityState, condition_range.min_air_humidity, condition_range.max_air_humidity)}
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}>Humidity</Text>
                    </View>
                </View>
                <View style={styles.buttonWrapper}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={styles.co2} onPress={() => { onClick('Atmosphere') }}>
                            <Image source={Images.co2} style={{ width: 50, height: 50 }} />
                            {checkWarning(metrics.atmosphereState, condition_range.min_air_atmosphere, condition_range.max_air_atmosphere)}
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}>CO2</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={styles.lux} onPress={() => { onClick('Brightness') }}>
                            <FontAwesomeIcon icon={faSun} size={50} color='#F7F700' />
                            {checkWarning(metrics.luxState, condition_range.min_air_brightness, condition_range.max_air_brightness)}
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}>Brightness</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default AirStack;
