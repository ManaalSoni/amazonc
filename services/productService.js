const { addData, getData, updateData, deleteData } = require("../services/firebaseService");
const DatabaseError = require("../helpers/DatabaseError");

const COLLECTION_NAME = "products";

const addProduct = async (data) => {

    const { category, name, price, description, image, featured } = data;

    const newProduct = {
        category, name, price, description, image, featured
    }

    try {
        const id = await addData(COLLECTION_NAME, null, newProduct);

        return {
            product: {
                id,
                ...newProduct
            }
        }

    } catch (error) {
        throw new DatabaseError("Product could not be added");
    }
}

const getProductById = async (id) => {
    const result = await getData("products", id);
    return result.data();
}

const editProductById = async (id, data) => {

    const { price, description, featured, image } = data;

    const fieldsToEdit = {};
    if(price) fieldsToEdit.price = price;
    if(description) fieldsToEdit.description = description;
    if(image) fieldsToEdit.image = image;
    if(featured) fieldsToEdit.featured = featured;

    try {
        await updateData(COLLECTION_NAME, id, fieldsToEdit);
    } catch (error) {
        throw new DatabaseError("Product could not be edited");
    }
}

const deleteProductById = async (id) => {
    try {
        await deleteData("products", id);
    } catch (error) {
        console.log(error);
        throw new DatabaseError("Product could not be deleted");
    }
}

module.exports = {
    addProduct,
    getProductById,
    editProductById,
    deleteProductById
}