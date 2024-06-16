import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

interface IConditionRange {
    min_water_salinity: number,
    max_water_salinity: number,
};

const useSalinityRange = () => {
    const [condition_range, setConditionRange] = useState<IConditionRange>({
        min_water_salinity: -1,
        max_water_salinity: -1,
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
        min_normal: condition_range.min_water_salinity,
        max_normal: condition_range.max_water_salinity,
    };
}

export default useSalinityRange;
