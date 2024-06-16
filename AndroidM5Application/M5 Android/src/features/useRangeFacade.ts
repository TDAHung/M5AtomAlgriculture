import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

interface IConditionRange {
    min_soil_temperature: number,
    max_soil_temperature: number,
    min_soil_humidity: number,
    max_soil_humidity: number,
    min_soil_ec: number,
    max_soil_ec: number,
    min_soil_ph: number,
    max_soil_ph: number,
    min_soil_nitro: number,
    max_soil_nitro: number,
    min_soil_phosphorus: number,
    max_soil_phosphorus: number,
    min_soil_potalium: number,
    max_soil_potalium: number,
    min_air_temperature: number,
    max_air_temperature: number,
    min_air_humidity: number,
    max_air_humidity: number,
    min_air_atmosphere: number,
    max_air_atmosphere: number,
    min_air_brightness: number,
    max_air_brightness: number,
    min_water_temperature: number,
    max_water_temperature: number,
    min_water_ec: number,
    max_water_ec: number,
    min_water_ph: number,
    max_water_ph: number,
    min_water_orp: number,
    max_water_orp: number,
};

const useRangeFacade = () => {
    const [condition_range, setConditionRange] = useState<IConditionRange>({
        min_soil_temperature: -1,
        max_soil_temperature: -1,
        min_soil_humidity: -1,
        max_soil_humidity: -1,
        min_soil_ec: -1,
        max_soil_ec: -1,
        min_soil_ph: -1,
        max_soil_ph: -1,
        min_soil_nitro: -1,
        max_soil_nitro: -1,
        min_soil_phosphorus: -1,
        max_soil_phosphorus: -1,
        min_soil_potalium: -1,
        max_soil_potalium: -1,
        min_air_temperature: -1,
        max_air_temperature: -1,
        min_air_humidity: -1,
        max_air_humidity: -1,
        min_air_atmosphere: -1,
        max_air_atmosphere: -1,
        min_air_brightness: -1,
        max_air_brightness: -1,
        min_water_temperature: -1,
        max_water_temperature: -1,
        min_water_ec: -1,
        max_water_ec: -1,
        min_water_ph: -1,
        max_water_ph: -1,
        min_water_orp: -1,
        max_water_orp: -1,
    });

    useEffect(() => {
        const firebaseConnection = () => {
            firestore().collection('range_condition').onSnapshot(data => {
                data.forEach((item: any) => {
                    setConditionRange(item.data())
                });
            });
        };

        firebaseConnection();
    }, [])

    return condition_range;
}

export default useRangeFacade;
