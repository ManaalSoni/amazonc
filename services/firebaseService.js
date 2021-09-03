const firebase = require("firebase")
const dotenv = require('dotenv');
dotenv.config();
const {
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
} = process.env;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
}

const fb = firebase.initializeApp(firebaseConfig);
const db = fb.firestore();

async function addData(collection, id, data) {
  if (!id) {
    const res = await db.collection(collection).add(data);
    return res.id;
  }
  else 
    await db.collection(collection).doc(id).set(data);
}

async function updateData(collection, id, data) {
  await db.collection(collection).doc(id).update(data)
}

async function deleteData(collection, id) {
  await db.collection(collection).doc(id).delete()
}

async function getData(collection, id) {
  return await db.collection(collection).doc(id).get()
}

async function getCollectionData(collection) {
  return await db.collection(collection).get()
}

async function getDataOnCondition(collection, key, operator, value) {
  const data = await db.collection(collection).where(key, operator, value).get();
  return data;
}

async function getAllDataOnCondition(collection, key, operator, value) {
  return await db.collection(collection).where(key, operator, value).get()
}

module.exports = {
  firebase: fb,
  db,
  getData,
  getDataOnCondition,
  getCollectionData,
  getAllDataOnCondition,
  addData,
  updateData,
  deleteData,
}
