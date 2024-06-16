const setCondition = (
    setMinAirTemperature: any,
    setMaxAirTemperature: any,
    setMinAirHumidity: any,
    setMaxAirHumidity: any,
    setMinAirAtmosphere: any,
    setMaxAirAtmosphere: any,
    setMinAirBrightness: any,
    setMaxAirBrightness: any,

    setMinWaterTemperature: any,
    setMaxWaterTemperature: any,
    setMinWaterEC: any,
    setMaxWaterEC: any,
    setMinWaterORP: any,
    setMaxWaterORP: any,
    setMinWaterPH: any,
    setMaxWaterPH: any,
    setMinWaterSalinity: any,
    setMaxWaterSalinity: any,

    setMinSoilTemperature: any,
    setMaxSoilTemperature: any,
    setMinSoilHumidity: any,
    setMaxSoilHumidity: any,
    setMinSoilPH: any,
    setMaxSoilPH: any,
    setMinSoilEC: any,
    setMaxSoilEC: any,
    setMinSoilNitro: any,
    setMaxSoilNitro: any,
    setMinSoilPhosphorus: any,
    setMaxSoilPhosphorus: any,
    setMinSoilPotalium: any,
    setMaxSoilPotalium: any,
    plant_condition: any,
) => {
    setMinAirTemperature(String(plant_condition.air.min_temperature));
    setMaxAirTemperature(String(plant_condition.air.max_temperature));
    setMinAirHumidity(String(plant_condition.air.min_temperature));
    setMaxAirHumidity(String(plant_condition.air.max_humidity));
    setMinAirAtmosphere(String(plant_condition.air.min_temperature));
    setMaxAirAtmosphere(String(plant_condition.air.max_atmosphere));
    setMinAirBrightness(String(plant_condition.air.min_temperature));
    setMaxAirBrightness(String(plant_condition.air.max_brightness));

    setMinWaterTemperature(String(plant_condition.water.min_temperature));
    setMaxWaterTemperature(String(plant_condition.water.max_temperature));
    setMinWaterEC(String(plant_condition.water.min_ec));
    setMaxWaterEC(String(plant_condition.water.max_ec));
    setMinWaterORP(String(plant_condition.water.min_orp));
    setMaxWaterORP(String(plant_condition.water.max_orp));
    setMinWaterPH(String(plant_condition.water.min_ph));
    setMaxWaterPH(String(plant_condition.water.max_ph));
    setMinWaterSalinity(String(plant_condition.water.min_salinity));
    setMaxWaterSalinity(String(plant_condition.water.max_salinity));

    setMinSoilTemperature(String(plant_condition.soil.min_temperature));
    setMaxSoilTemperature(String(plant_condition.soil.max_temperature));
    setMinSoilHumidity(String(plant_condition.soil.min_humidity));
    setMaxSoilHumidity(String(plant_condition.soil.max_humidity));
    setMinSoilPH(String(plant_condition.soil.min_ph));
    setMaxSoilPH(String(plant_condition.soil.max_ph));
    setMinSoilEC(String(plant_condition.soil.min_ec));
    setMaxSoilEC(String(plant_condition.soil.max_ec));
    setMinSoilNitro(String(plant_condition.soil.min_nitro));
    setMaxSoilNitro(String(plant_condition.soil.max_nitro));
    setMinSoilPhosphorus(String(plant_condition.soil.min_phosphorus));
    setMaxSoilPhosphorus(String(plant_condition.soil.max_phosphorus));
    setMinSoilPotalium(String(plant_condition.soil.min_potassium));
    setMaxSoilPotalium(String(plant_condition.soil.max_potassium));
}

export default setCondition;
