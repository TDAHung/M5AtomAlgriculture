import data_plant from '../../utils/data_plants.json'
const usePlant = (plant_name: string) => {
    const index = data_plant.findIndex((plant) => {
        return plant.name === plant_name;
    });
    const condition = data_plant[index].condition;
    const name = data_plant[index].name;
    const image = data_plant[index].image;
    return { condition, name, image, index };
}

export default usePlant;
