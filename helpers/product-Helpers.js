const db= require('../config/connection')
const collection=require('../config/collections');
const { response } = require('../app');
const { log } = require('handlebars');
 var ObjectId=require('mongodb').ObjectId;
module.exports={
  addProduct:(product,callback)=>{
   
    db.get().collection('product').insertOne(product).then((data)=>{
      //  console.log(data)
      callback(data.insertedId.toString())
    })
  },


  getAllProducts:()=>{
     return new Promise(async (resolve, reject) =>{
    
        let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        resolve(products)
     })
    
  },
  deleteProduct:(proId)=>{
    return new Promise((resolve,reject)=>{
db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: new ObjectId(proId)}).then((response)=>{

  resolve(response)
})
    })
  },
  getProductDetails:(prodId)=>{
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: new ObjectId(prodId)}).then((product)=>{
        if (!product) {
          reject(new Error('Product not found'));
      } else {
resolve(product)
      }
      })
    })
  },
  updateProduct:(prodId,proDetails)=>{
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(prodId)},{
       $set:{
        Name:proDetails.Name,
        category: proDetails.category,
        Price: proDetails.Price,
        description:proDetails.description
       } 
      }).then((response)=>{
        resolve()
      })
    })
  },
  getadminOrders:(adminId)=>{
    return new Promise(async(resolve,reject) => {
      
      let orders=await db.get().collection(collection.ORDER_COLLECTION).find({adminId:new ObjectId(adminId)}).toArray()
      resolve(orders)
  
    })
  },

}
