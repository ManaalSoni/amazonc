const { db } = require("../services/firebaseService");

const addDataToDB = async(dataArray, collectionName) => {
    dataArray.forEach(data => {
        db.collection(collectionName).add(data);
    });
}

module.exports = {
    addDataToDB
}