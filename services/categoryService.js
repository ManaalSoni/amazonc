const DatabaseError = require("../helpers/DatabaseError");
const { getCollectionData, getData } = require("./firebaseService");


const COLLECTION_NAME = "categories";

const getCategories = async() => {
    try {
        const querySnapshot = await getCollectionData(COLLECTION_NAME);
        if(querySnapshot.empty) return null;
        const result = [];
        querySnapshot.forEach(doc => {
            result.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return result;
    } catch (error) {
        throw new DatabaseError("Could not read categories");
    }
}

const getCategoryById = async(id) => {
    try {
        const category = await getData(COLLECTION_NAME, id);
        return category.data();
    } catch (error) {
        throw new DatabaseError("Could not read category");
    }
}

module.exports = {
    getCategories,
    getCategoryById
}