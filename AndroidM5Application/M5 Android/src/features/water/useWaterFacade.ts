import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

const useWaterFacade = () => {
    const [temperatureState, setTemperatureState] = useState<any>();
    const [ecState, setECState] = useState<any>();
    const [orpState, setORPState] = useState<any>();
    const [phState, setPHState] = useState<any>();

    useEffect(() => {
        const firebaseConnection = () => {
            firestore().collection('water_temperature_state').onSnapshot(data => {
                data.forEach((item) => {
                    setTemperatureState([
                        item.data()
                    ])
                });
            });

            firestore().collection('water_ec_state').onSnapshot(data => {
                data.forEach((item) => {
                    setECState([
                        item.data()
                    ])
                });
            });

            firestore().collection('water_orp_state').onSnapshot(data => {
                data.forEach((item) => {
                    setORPState([
                        item.data()
                    ])
                });
            });

            firestore().collection('water_ph_state').onSnapshot(data => {
                data.forEach((item) => {
                    setPHState([
                        item.data()
                    ])
                });
            });
        };

        firebaseConnection();
    }, [])

    return {
        temperatureState,
        ecState,
        orpState,
        phState
    };
}

export default useWaterFacade;
