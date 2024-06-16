import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

interface IConditionRange {
    min_air_temperature: number,
    max_air_temperature: number,
};

const useTemperatureRange = () => {
    const [condition_range, setConditionRange] = useState<IConditionRange>({
        min_air_temperature: -1,
        max_air_temperature: -1,
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
    }, []);

    return {
        min: condition_range.min_air_temperature,
        max: condition_range.max_air_temperature,
    };
}

export default useTemperatureRange;
