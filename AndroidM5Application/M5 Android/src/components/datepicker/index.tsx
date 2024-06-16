import { format } from 'date-fns';
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

const DatePickerCustom: React.FC<{
    label: string,
    placeholder?: string,
    onChange: (value: Date) => void,
    dateSelected: Date;
    mode: string;
    formatType?: string;
    maximumDate?: Date;
    minimumDate?: Date;
}> = ({ label, placeholder,
    onChange, dateSelected,
    mode = 'date', formatType,
    minimumDate, maximumDate }) => {
        const [showPicker, setShowPicker] = useState(false);
        return (
            <Pressable
                onPress={() => setShowPicker(true)}
                style={{
                    borderRadius: 15,
                    borderColor: '#E6E6E6',
                    borderWidth: 1,
                    paddingVertical: 10,
                    paddingLeft: 13,
                    width: '45%',
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: '#CDCDCD',
                                fontSize: 12
                            }}>{label}</Text>
                        {/* <Text>{format(dateSelected ?? new Date(), formatType ?? 'MMM do yyyy')}</Text> */}
                        <Text style={{ color: 'black' }}>{format(dateSelected ?? new Date(), formatType ?? 'MMM do yyyy')}</Text>

                    </View>
                </View>
                <DatePicker
                    modal
                    mode={mode}
                    open={showPicker}
                    maximumDate={maximumDate}
                    minimumDate={minimumDate}
                    date={dateSelected}
                    onConfirm={(date) => {
                        setShowPicker(false)
                        onChange(date)
                    }}
                    onCancel={() => {
                        setShowPicker(false)
                    }}
                />
            </Pressable>
        )
    }

export default DatePickerCustom;
