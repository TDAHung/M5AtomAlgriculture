import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
interface IConditionRange {
    min_soil_temperature: number,
    max_soil_temperature: number,
};

const useTemperatureRange = () => {
    const [condition_range, setConditionRange] = useState<IConditionRange>({
        min_soil_temperature: -1,
        max_soil_temperature: -1,
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
        min: condition_range.min_soil_temperature,
        max: condition_range.max_soil_temperature,
    };
}

export default useTemperatureRange;
