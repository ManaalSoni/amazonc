const { addToArray, removeFromArray, addData, getData, deleteData } = require("../services/firebaseService");
const DatabaseError = require("../helpers/DatabaseError");

const COLLECTION_NAME = "reviews";

const addReview = async(id, data, userData) => {
    const now = new Date();
    const newReview = {
        ...data,
        ...userData,
        timestamp: now.toISOString()
    }
    try {
        await addToArray(COLLECTION_NAME, id, "reviews", newReview);
    } catch (error) {
        if(error.message.includes("NOT_FOUND")){
            try {
                await firstReview(id, newReview);
                return    
            } catch (error) {
                throw error;
            }
        }
        throw new DatabaseError("Review could not be added");
    }
}

const firstReview = async(id, data) => {
    let msg = "";
    try {
        const product = await getData("products", id);
        if(!product.exists){
            msg += ": Product does not exist";
            throw Error;
        }
        await addData(COLLECTION_NAME, id, {
            reviews: [data]
        });
    } catch (error) {
        throw new DatabaseError("Review could not be added"+msg);
    }
}

const getReviews = async(id) => {
    try {
        const result = await getData(COLLECTION_NAME, id);
        if(result.exists){
            return result.data().reviews;
        } else {
            return [];
        }
    } catch (error) {
        throw new DatabaseError("Reviews could not be fetched");
    }
}

const deleteReview = async (id, data) => {
    try {
        await removeFromArray(COLLECTION_NAME, id, "reviews", data)
    } catch (error) {
        console.log(error);
        throw new DatabaseError("Review could not be deleted");
    }
}

const deleteAllReviews = async (id) => {
    try {
        await deleteData(COLLECTION_NAME, id);
    } catch (error) {
        console.log(error);
        throw new DatabaseError("Reviews could not be deleted");
    }
}

module.exports = {
    addReview,
    getReviews,
    deleteReview,
    deleteAllReviews
}