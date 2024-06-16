import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import SoilNavigator from '../features/soil/navigation';

import { faCalendar, faDiagramProject, faHome, faLeaf, faWater, faWind } from '@fortawesome/free-solid-svg-icons';
import { Image } from 'react-native';
import { Images } from '../assets';
import Pump from '../features/pump';
import AirNavigator from '../features/air/navigation';
import AuthStack from './authNavigation';
import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import Header from '../components/header';
import PlantNavigator from '../features/plant';
import WaterNavigator from '../features/water/navigation';
import CalendarComponent from '../features/calendar';
import DailySchedulerComponent from '../features/daily_scheduler';

const Tab = createMaterialBottomTabNavigator();

const AppNavigation = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    const onAuthStateChanged = (user: any) => {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    if (!user) {
        return (
            <NavigationContainer>
                <AuthStack />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Header />
            <Tab.Navigator
            >
                <Tab.Screen
                    name="Plant"
                    component={PlantNavigator}
                    options={{
                        tabBarLabel: 'Plant',
                        tabBarIcon: () => (
                            <FontAwesomeIcon icon={faLeaf} size={23} color='#966FD6' />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Soil"
                    component={SoilNavigator}
                    options={{
                        tabBarLabel: 'Soil',
                        tabBarIcon: () => (
                            <FontAwesomeIcon icon={faDiagramProject} size={23} color='#966FD6' />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Air"
                    component={AirNavigator}
                    options={{
                        tabBarLabel: 'Air',
                        tabBarIcon: () => (
                            <FontAwesomeIcon icon={faWind} size={23} color='#966FD6' />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Water"
                    component={WaterNavigator}
                    options={{
                        tabBarLabel: 'Water',
                        tabBarIcon: () => (
                            <FontAwesomeIcon icon={faWater} size={23} color='#966FD6' />
                        ),
                    }}
                />
                <Tab.Screen
                    name="PumpDevice"
                    component={Pump}
                    options={{
                        tabBarLabel: 'Pump',
                        tabBarIcon: () => (
                            <Image source={Images.pump} style={{ width: 23, height: 23, tintColor: '#966FD6' }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Calendar"
                    component={CalendarComponent}
                    options={{
                        tabBarLabel: 'Schedule',
                        tabBarIcon: () => (
                            <FontAwesomeIcon icon={faCalendar} size={23} color='#966FD6' />
                        ),
                    }}
                />
                <Tab.Screen
                    name="CyclicScheduler"
                    component={DailySchedulerComponent}
                    options={{
                        tabBarLabel: 'Daily',
                        tabBarIcon: () => (
                            <FontAwesomeIcon icon={faCalendar} size={23} color='#966FD6' />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}



export default AppNavigation;
