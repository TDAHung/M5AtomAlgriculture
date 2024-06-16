import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

interface IConditionRange {
    min_soil_phosphorus: number,
    max_soil_phosphorus: number,
};

const usePhosphorusRange = () => {
    const [condition_range, setConditionRange] = useState<IConditionRange>({
        min_soil_phosphorus: -1,
        max_soil_phosphorus: -1,
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
        min_normal: condition_range.min_soil_phosphorus,
        max_normal: condition_range.max_soil_phosphorus,
    };
}

export default usePhosphorusRange;
