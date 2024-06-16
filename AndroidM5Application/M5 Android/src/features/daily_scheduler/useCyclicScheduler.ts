import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const useCyclicScheduler = () => {
    const [schedulerData, setSchedulerData] = useState<any>();

    useEffect(() => {
        const firebaseConnection = () => {
            firestore().collection('cyclic_scheduler').onSnapshot(data => {
                let schedulers: any = [];
                data.forEach((item: any) => {
                    let scheduler = item.data();
                    scheduler.id = item.id;
                    schedulers.push(scheduler);
                });
                setSchedulerData(schedulers);
            });
        };

        firebaseConnection();
    }, [])

    return schedulerData;
}

export default useCyclicScheduler;
