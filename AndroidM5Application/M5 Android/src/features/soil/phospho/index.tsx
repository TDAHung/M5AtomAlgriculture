import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import Loader from '../../../components/loader';
import { Images } from '../../../assets';
import usePhosphorusRange from './usePhosphorusRange';

const maxDataPoints = 6
const screenWidth = Dimensions.get("window").width;
const enumDangerState = {
    high: "high",
    normal: "normal",
    low: "low",
};
const Phospho = () => {
    const [phospho, setPhospho] = useState<any>([]);
    const [phosphoState, setPhosphoState] = useState<any>([]);
    const [createdAtData, setCreatedAtData] = useState<any>([]);

    const range = usePhosphorusRange();
    let maxPhospho: any = 0;
    let minPhospho: any = 50;
    if (range.min_normal != -1 && range.max_normal != -1) {
        maxPhospho = range.max_normal;
        minPhospho = range.min_normal;
    }

    useEffect(() => {
        const firebaseConnection = () => {
            firestore().collection('env_phosphorus_state').onSnapshot(data => {
                data.forEach((item) => {
                    let ratio;
                    if (item.data().value > maxPhospho) ratio = 1;
                    else if (item.data().value < minPhospho) ratio = 0;
                    else ratio = (item.data().value - minPhospho) / (maxPhospho - minPhospho);
                    setPhosphoState([
                        ratio
                    ]);
                });
            })

            firestore().collection('env_phosphorus').onSnapshot(data => {
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
                setPhospho(tempValues);
                setCreatedAtData(created_at_data);
            });
        };

        firebaseConnection();

    }, [minPhospho, maxPhospho]);

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

    let chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 2,
        color: (opacity = 1) => getColor(phosphoState, opacity),
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

    if (phospho.length == 0) {
        return <Loader />
    }
    else {
        return (
            <View style={{ flex: 1 }}>
                {
                    renderLineChart(phospho, createdAtData)
                }
                <View>
                    <View style={styles.chartWrapper} >
                        {
                            renderProgressChart(phosphoState, ["Temperature"])
                        }
                        <View style={{ position: 'absolute', left: '36%', top: '43%', width: '30%' }}>
                            <Text style={{ fontSize: 25, color: getColor(phosphoState, 1), textAlign: 'center' }}>
                                {(phospho[phospho.length - 1] == undefined ? null
                                    : phospho[phospho.length - 1].toFixed(2))
                                }
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ textAlign: "center", color: getColor(phosphoState, 1), fontSize: 20 }}>
                            {`Your Phosphorus is ${getDangerState(phosphoState)}`}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

}

export default Phospho;
