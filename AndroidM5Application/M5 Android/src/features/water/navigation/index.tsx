import { createStackNavigator } from '@react-navigation/stack';
import WaterStack from '..';
import Temperature from '../temperature';
import PH from '../ph';
import EC from '../ec';
import ORP from '../orp';
import Salinity from '../salinity';

const Stack = createStackNavigator();

const WaterNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MetricStack"
                component={WaterStack}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="Temperature" component={Temperature} />
            <Stack.Screen name="PH" component={PH} />
            <Stack.Screen name="EC" component={EC} />
            <Stack.Screen name="ORP" component={ORP} />
            <Stack.Screen name="Salinity" component={Salinity} />
        </Stack.Navigator>
    );
}

export default WaterNavigator;
