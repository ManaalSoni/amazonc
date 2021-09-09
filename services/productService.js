const { addData, getData, updateData, deleteData, getDataOnCondition } = require("../services/firebaseService");
const DatabaseError = require("../helpers/DatabaseError");

const COLLECTION_NAME = "products";

const addProduct = async (data, userId) => {

    const { category, name, price, description, image, featured } = data;

    const newProduct = {
        category, name, price, description, image, 
        featured: Boolean(featured),
        sellerId: userId
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
        console.log(error);
        throw new DatabaseError("Product could not be added");
    }
}

const getProductById = async (id) => {
    try {
        const result = await getData(COLLECTION_NAME, id);
        return result.data();
    } catch (error) {
        throw new DatabaseError("Product could not be retreived");
    }
}

const getFeaturedProducts = async() => {
    try {
        const querySnapshot = await getDataOnCondition(COLLECTION_NAME, "featured", "==", true);
        const result = [];
        if(querySnapshot.empty) return result;
        querySnapshot.forEach(doc => {
            result.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return result;
    } catch (error) {
        throw new DatabaseError("Product could not be retreived");
    }
}

const getProductsByCategory = async(category) => {
    try {
        const querySnapshot = await getDataOnCondition(COLLECTION_NAME, "category", "==", category);
        const result = [];
        if(querySnapshot.empty) return result;
        querySnapshot.forEach(doc => {
            result.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return result;   
    } catch (error) {
        throw new DatabaseError("Product could not be retreived");
    }
}

const getSellerProducts = async(sellerId) => {
    try {
        const querySnapshot = await getDataOnCondition(COLLECTION_NAME, "sellerId", "==", sellerId);
        const result = [];
        if(querySnapshot.empty) return result;
        querySnapshot.forEach(doc => {
            result.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return result;
    } catch (error) {
        throw new DatabaseError("Product could not be retreived");
    }
}

const editProductById = async (id, data) => {

    const { price, description, featured, image } = data;

    const fieldsToEdit = {};
    if(price) fieldsToEdit.price = price;
    if(description) fieldsToEdit.description = description;
    if(image) fieldsToEdit.image = image;
    if(featured!==null || featured!==undefined) fieldsToEdit.featured = (featured===true||featured==="true");

    try {
        await updateData(COLLECTION_NAME, id, fieldsToEdit);
    } catch (error) {
        throw new DatabaseError("Product could not be edited");
    }
}

const deleteProductById = async (id) => {
    try {
        await deleteData(COLLECTION_NAME, id);
    } catch (error) {
        console.log(error);
        throw new DatabaseError("Product could not be deleted");
    }
}

module.exports = {
    addProduct,
    getProductById,
    getFeaturedProducts,
    getProductsByCategory,
    getSellerProducts,
    editProductById,
    deleteProductById
}