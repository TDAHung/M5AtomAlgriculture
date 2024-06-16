import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

interface IConditionRange {
    min_air_humidity: number,
    max_air_humidity: number,
};

const useHumidityRange = () => {
    const [condition_range, setConditionRange] = useState<IConditionRange>({
        min_air_humidity: -1,
        max_air_humidity: -1,
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
        min_normal: condition_range.min_air_humidity,
        max_normal: condition_range.max_air_humidity,
    };
}

export default useHumidityRange;
