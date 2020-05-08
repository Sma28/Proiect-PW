const {
    Food
} = require('../data');

const add = async (name, description, picture) => {
    const food = new Food({
        name : name,
        description : description,
        picture : picture
    });
    await food.save();
};

const getAll = async () => {
    return await Food.find();
};

const getById = async (id) => {
    return await Food.findById(id);
};

const updateById = async (id, description, picture) => {
    await Food.findByIdAndUpdate(id, { name ,description, picture });
};

const deleteById = async (id) => {
    await Food.findByIdAndDelete(id);
};

module.exports = {
    add,
    getAll,
    getById,
    updateById,
    deleteById
}