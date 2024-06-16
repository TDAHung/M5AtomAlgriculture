import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

interface IConditionRange {
    min_soil_nitro: number,
    max_soil_nitro: number,
};

const useNitroRange = () => {
    const [condition_range, setConditionRange] = useState<IConditionRange>({
        min_soil_nitro: -1,
        max_soil_nitro: -1,
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
        min_normal: condition_range.min_soil_nitro,
        max_normal: condition_range.max_soil_nitro,
    };
}

export default useNitroRange;
