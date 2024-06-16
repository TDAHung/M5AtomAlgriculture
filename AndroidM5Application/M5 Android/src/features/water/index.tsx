import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { Images } from '../../assets';
import { faDroplet, faExclamation, faTemperatureHalf } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { styles } from './style';
import useWaterFacade from './useWaterFacade';
import useRangeFacade from '../useRangeFacade';

const WaterStack = ({ navigation }: { navigation: any }) => {
    const metrics = useWaterFacade();
    const condition_range = useRangeFacade();

    const onClick = (address: string) => {
        navigation.navigate(`${address}`);
    };

    const checkWarning = (dataState: any, min: Number, max: Number) => {
        if (dataState) {
            if (dataState[0].value <= min || dataState[0].value >= max) {
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
                        <TouchableOpacity style={styles.humidity} onPress={() => { onClick('EC') }}>
                            <Image source={Images.ec} style={{ width: 50, height: 50, }} />
                            {checkWarning(metrics.ecState, condition_range.min_water_ec, condition_range.max_water_ec)}
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}>EC</Text>
                    </View>
                </View>
                <View style={styles.buttonWrapper}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={styles.co2} onPress={() => { onClick('ORP') }}>
                            <Image source={Images.orp} style={{ width: 50, height: 50 }} />
                            {checkWarning(metrics.orpState, condition_range.min_water_orp, condition_range.max_water_orp)}
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}>ORP</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={styles.lux} onPress={() => { onClick('PH') }}>
                            <Image source={Images.ph} style={{ width: 50, height: 50, }} />
                            {checkWarning(metrics.phState, condition_range.min_water_ph, condition_range.max_water_ph)}
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}>PH</Text>
                    </View>
                </View>
                <View style={styles.buttonWrapper}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity style={styles.co2} onPress={() => { onClick('Salinity') }}>
                            <Image source={Images.salinity} style={{ width: 50, height: 50 }} />
                            {/* {checkWarning(metrics.orpState, condition_range.min_water_orp, condition_range.max_water_orp)} */}
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center' }}>Salinity</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default WaterStack;
