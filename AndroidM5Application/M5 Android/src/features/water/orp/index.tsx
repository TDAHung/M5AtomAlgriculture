import { View, Text, Dimensions, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { ProgressChart, LineChart } from 'react-native-chart-kit';
import Loader from '../../../components/loader';
import useORPRange from './useORPRange';

const maxDataPoints = 6
const screenWidth = Dimensions.get("window").width;
const enumDangerState = {
    high: "high",
    normal: "normal",
    low: "low",
};

const ORP = () => {
    const [orp, setORP] = useState<any>([]);
    const [orpState, setORPState] = useState<Array<number>>([]);
    const [createdAtData, setCreatedAtData] = useState<any>([]);

    const range = useORPRange();
    let maxORP: any = 150;
    let minORP: any = 0;

    if (range.min_normal != -1 && range.max_normal != -1) {
        minORP = range.min_normal;
        maxORP = range.max_normal;
    }

    useEffect(() => {
        const firebaseConnection = () => {
            firestore().collection('water_orp_state').onSnapshot(data => {
                data.forEach((item) => {
                    let ratio;
                    if (item.data().value > maxORP) ratio = 1;
                    else if (item.data().value < minORP) ratio = 0;
                    else ratio = (item.data().value - minORP) / (maxORP - minORP);
                    setORPState([
                        ratio
                    ]);
                });
            })

            firestore().collection('water_orp').onSnapshot(data => {
                const dataFetch: any = [];
                data.forEach((item) => {
                    dataFetch.push(item.data());
                });
                dataFetch.sort((a: any, b: any) => a.created_at - b.created_at);
                let created_at_data: any = [];
                let tempValues: any = [];
                dataFetch.forEach((data: any) => {
                    tempValues.push(Number(data.value));
                    const createdAt = new Date(data.created_at);
                    const options: any = {
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'
                    };
                    const vietnameseDateFormat = createdAt.toLocaleTimeString('vi-VN', options);
                    created_at_data.push(vietnameseDateFormat);
                });
                setORP(tempValues);
                setCreatedAtData(created_at_data);
            });
        };

        firebaseConnection();

    }, [maxORP, minORP]);

    const getDangerState = (value: any) => {
        if (value[0] == 1) {
            return enumDangerState.high;
        }
        else if (value[0] == 0) {
            return enumDangerState.low;
        }
        else {
            return enumDangerState.normal;
        }
    }

    const getColor = (value: any, opacity: any) => {
        if (value[0] == 1) {
            return `rgba(222,12,28, ${opacity})`;
        }
        else if (value[0] == 0) {
            return `rgba(222,12,28, ${opacity})`;
        }
        else {
            return `rgba(25, 135, 84, ${opacity})`;
        }
    };

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 2,
        color: (opacity = 1) => getColor(orpState, opacity),
        style: {
            borderRadius: 15,
        },
    };

    const renderLineChart = (data: any, createdData: any) => {
        if (data.length === 0 || createdData.length === 0) {
            return null;
        } else {
            const limitData = (data: any) => {
                const dataLength = data.labels.length;
                if (dataLength <= maxDataPoints) {
                    return data;
                }

                const startIndex = dataLength - maxDataPoints;
                const limitedData = {
                    labels: data.labels.slice(startIndex),
                    datasets: data.datasets.map((dataset: any) => ({
                        ...dataset,
                        data: dataset.data.slice(startIndex),
                    })),
                };

                return limitedData;
            };

            const dataSet = {
                labels: createdData,
                datasets: [
                    { data: data, },
                ],
            };

            return <LineChart
                data={limitData(dataSet)}
                width={screenWidth}
                height={300}
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={chartConfig}
                bezier
            />
        }
    }

    const renderProgressChart = (dataState: any, label: any) => {
        if (dataState.length === 0) {
            return null;
        } else {
            const data = {
                labels: label,
                data: dataState
            };
            return <ProgressChart
                data={data}
                width={screenWidth}
                height={220}
                strokeWidth={10}
                radius={70}
                chartConfig={chartConfig}
                style={{
                    borderRadius: 16,
                }}
                hideLegend={true}
            />
        }
    }

    const styles = StyleSheet.create({
        chartWrapper: {
        }
    });

    if (orp.length == 0) {
        return <Loader />
    }
    else {
        return (
            <View style={{ flex: 1 }}>
                {
                    renderLineChart(orp, createdAtData)
                }
                <View>
                    <View style={styles.chartWrapper} >
                        {
                            renderProgressChart(orpState, ["Humidity"])
                        }
                        <View style={{ position: 'absolute', left: '36%', top: '43%', width: '30%' }}>
                            <Text style={{ fontSize: 25, color: getColor(orpState, 1), textAlign: 'center' }}>
                                {(orp[orp.length - 1] == undefined ? null
                                    : orp[orp.length - 1].toFixed(2))
                                }
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ textAlign: "center", color: getColor(orpState, 1), fontSize: 20 }}>
                            {`Your ORP is ${getDangerState(orpState)}`}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default ORP;
