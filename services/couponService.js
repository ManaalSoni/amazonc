const {
  addData,
  getData,
  getDataOnCondition,
  deleteData,
  getCollectionData,
} = require("../services/firebaseService");
const DatabaseError = require("../helpers/DatabaseError");
require("dotenv").config();
const COLLECTION_NAME = "coupons";

async function addCoupon(newCoupon, sellerId) {
  newCoupon.discount_rate = newCoupon.discount_rate;
  const { code, description, discount_rate } = newCoupon;
  let result = null;
  try {
    result = await getDataOnCondition(COLLECTION_NAME, "code", "==", code);
  } catch (error) {
    throw new DatabaseError("coupon could not be added");
  }

  let exists = false;
  const coupon = result.docs[0];
  if (coupon && coupon.data().sellerId == sellerId) exists = true;
  if (exists)
    return {
      exists,
      id: coupon.id,
    };
  try {
    const id = await addData(COLLECTION_NAME, null, {
      sellerId,
      code,
      description,
      discount_rate,
    });
    return {
      exists,
      id,
    };
  } catch (error) {
    throw new DatabaseError("coupon could not be added");
  }
}

async function getCouponById(id) {
  try {
    const result = await getData(COLLECTION_NAME, id);
    if (result.exists)
      return { exists: true, coupon: { ...result.data(), id: result.id } };
    else return { exists: false };
  } catch (error) {
    throw new DatabaseError(" Fail to retrieve coupon");
  }
}

async function getAllCoupons() {
  try {
    const result = await getCollectionData(COLLECTION_NAME);
    const docs = result.docs;
    const coupons = [];
    docs
      ? docs.forEach((coupon) => {
        coupons.push({ ...coupon.data(), id: coupon.id });
      })
      : null;
    if (coupons.length != 0) return { exists: true, coupons };
    return { exists: false, coupons };
  } catch (error) {
    throw new DatabaseError(" Fail to retrieve coupon");
  }
}

async function getCouponBySellerId(id) {
  let result = null;
  try {
    result = await getDataOnCondition(COLLECTION_NAME, "sellerId", "==", id);
  } catch (error) {
    throw new DatabaseError(" Fail to retrieve coupon");
  }
  const docs = result.docs;
  const coupons = [];
  docs
    ? docs.forEach((coupon) => {
      coupons.push({ ...coupon.data(), id: coupon.id });
    })
    : null;
  if (coupons.length != 0) return { exists: true, coupons };
  return { exists: false, coupons };
}

async function deleteCoupon(couponId, sellerId) {
  let result = null;
  try {
    result = await getCouponBySellerId(sellerId);
  } catch (error) {
    if (error instanceof DatabaseError)
      throw new DatabaseError("coupon could not be deleted");
    throw error;
  }
  const coupons = result.coupons;
  let exists = false;
  for (let i = 0; i < coupons.length; i++) {
    let coupon = coupons[i];
    if (coupon.id == couponId) {
      try {
        await deleteData(COLLECTION_NAME, couponId);
      } catch (error) {
        throw new DatabaseError("coupon could not be deleted");
      }
      exists = true;
      break;
    }
  }
  return exists;
}

module.exports = {
  addCoupon,
  getCouponById,
  getCouponBySellerId,
  deleteCoupon,
  getAllCoupons,
};
