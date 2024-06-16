import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

interface IConditionRange {
    min_water_ec: number,
    max_water_ec: number,
};

const useEcRange = () => {
    const [condition_range, setConditionRange] = useState<IConditionRange>({
        min_water_ec: -1,
        max_water_ec: -1,
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
        min_normal: condition_range.min_water_ec,
        max_normal: condition_range.max_water_ec,
    };
}

export default useEcRange;
