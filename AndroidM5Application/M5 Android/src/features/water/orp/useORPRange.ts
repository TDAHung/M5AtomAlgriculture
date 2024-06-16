import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

interface IConditionRange {
    min_water_orp: number,
    max_water_orp: number,
};

const usePHRange = () => {
    const [condition_range, setConditionRange] = useState<IConditionRange>({
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
    }, []);

    return {
        min_normal: condition_range.min_water_orp,
        max_normal: condition_range.max_water_orp,
    };
}

export default usePHRange;
