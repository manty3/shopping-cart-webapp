var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt');
var ObjectId=require('mongodb').ObjectId;


const Razorpay= require('razorpay');
const { response } = require('../app');

var instance = new Razorpay({ key_id: 'rzp_test_CCuuSte8l9muQc', key_secret: 'GvbyWzUwevCjaFRvoNbWpzaB' })


module.exports={
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        userData.Password = await bcrypt.hash(userData.Password, 10);
        const result = await db.get().collection(collection.USER_COLLECTION).insertOne(userData);
        resolve({ ...userData, _id: result.insertedId });  // resolve with the inserted document
      } catch (err) {
        reject(err);
      }
    });
  },
  doLogin:(userData)=>{
   
   return new Promise(async(resolve,reject)=>{
    let loginStatus=false
    let response = {}; 
      
      
 let user= await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
   if(user){
  bcrypt.compare(userData.Password,user.Password).then((Status)=>{
    if (Status){
  
    console.log('SUCCESS') 
    response.user=user
    response.Status=true
    resolve(response)
  }else{
     console.log('FAILED')
     resolve({Status:false})
   }

  })
   }else{
 console.log(' no user FAILED')
 resolve({Status:false})
   }
 })
  
  },
  addTocart:(prodId,userId)=>{

    let proObj={
      item: new ObjectId(prodId),
      quantity: 1,
    };
    return  new Promise(async(resolve) => {
      let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user: new ObjectId(userId)})
if (userCart){
  let proExist=userCart.products.findIndex(product => product.item==prodId);
  console.log(proExist)
  if(proExist != -1){
   db.get().collection(collection.CART_COLLECTION).updateOne({user: new ObjectId(userId),'products.item': new ObjectId(prodId)},
    {
     $inc:{'products.$.quantity':1}
    }
  ).then(()=>{
   resolve() 
  })
  }else{

db.get().collection(collection.CART_COLLECTION).updateOne({user:new ObjectId(userId)},
{
  $push:{products:proObj}

  }
    ).then(()=>{
      resolve()
    })
  }
}else{
  let cartObj={
    user: new ObjectId(userId),
    products:[ proObj],
  }
  db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then(()=>{
resolve()
  })
}
    })
  },
  getCartProducts:(userId)=>{
return new Promise(async(resolve, reject) => {
  try {

  let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
    {
      $match:{user:new ObjectId(userId)}
    },
    {
$unwind:'$products'

    },
    {
      $project:{

    
        item:'$products.item',
        quantity:'$products.quantity',
        product: '$product',

      }
    },
    {
      $lookup:{
        from:collection.PRODUCT_COLLECTION,
        localField:'item',
        foreignField:'_id',
        as:'product'
      }
    },
    {
      $project:{
        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
      }
    }
  ]).toArray()

  resolve(cartItems)
} catch (err) {
  reject(err);
}

   } )
},
getCartCount:(userId)=>{
  return new Promise(async(resolve, reject) => {
    try{
    
    let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
    let count = 0;
    if (cart){
count= cart.products.length
    }
    resolve(count)
  } catch (err) {
    reject (err);
  }
  })
}

,
changeProductQuantity:(details)=>{
   details.count=parseInt(details.count)
  details.quantity=parseInt(details.quantity)
  return new Promise((resolve,reject) => {
    if(details.count==-1 && details.quantity==1){
      db.get().collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(details.cart)},
      
      {
        $pull:{products:{item:new ObjectId(details.product)}}
      }
    ).then(()=>{
      resolve({ removeProduct : true})
    })
    }else{

    db.get().collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(details.cart),'products.item': new ObjectId(details.product)},
    {
      $inc:{'products.$.quantity': details.count}

    }
  ).then(()=>{
   resolve({Status:true}) 
  })
}   

  })
},
RemoveProduct:(details)=>{

  return new Promise((resolve, reject) => {
    db.get().collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(details.cart)},
      
      {
        $pull:{products:{item:new ObjectId(details.product)}}
      }
    ).then((result)=>{
      resolve({removeProduct:true})
    }).catch((err) => {
      reject(err);
    });
  })

},
getTotalAmount: (userId) => {
  return new Promise(async (resolve,reject) => {
      let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
          {
              $match: { user: new ObjectId(userId) }
          },
          {
              $unwind: '$products'
          },
          {
              $project: {
                  item: '$products.item',
                  quantity: '$products.quantity'
              }
          },
          {
              $lookup: {
                  from: collection.PRODUCT_COLLECTION,
                  localField: 'item',
                  foreignField: '_id',
                  as: 'product'
              }
          },
          {
              $project: {
                  item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
              }
          },
          {
              $group: {
                  _id: null,
                  total: {
                      $sum: {
                          $multiply: ['$quantity', { $toInt: '$product.Price' }]
                      }
                  }
              }
          }
      ]).toArray();
      if (total.length > 0) {
          resolve
          (total[0].total);
      } else {
          resolve(0); // No products in the cart, so total is 0
      }
  })
},
placeOrder:(order,products,total)=>{
  
  return new Promise((resolve,reject) => {
    console.log(order,products,total)

    if (products.length === 0) {
      // If there are no products in the cart, reject the promise
     console.log("no items in cart");
    
      return;
    } 

    let status=order['payment-method']==='COD'?'placed':'pending'
    let orderObj={
      deliveryDetails:{
        mobile:order.mobile,
        address:order.address,
        pincode:order.pincode

      },
      userId:new ObjectId(order.userId),
      paymentMethod:order['payment-method'],
      products:products,
      totalAmount:total,
      status:status,
      date:new Date()

    }
    db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
      db.get().collection(collection.CART_COLLECTION).deleteOne({user:new ObjectId(order.userId)})
      resolve(response.insertedId)
    })

  })
},
getCartProductList:(userId)=>{
  return new Promise(async(resolve,reject) => {
    let cart= await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
   resolve(cart.products)
  })
},
getUserOrders:(userId)=>{
  return new Promise(async(resolve,reject) => {
    
    let orders=await db.get().collection(collection.ORDER_COLLECTION).find({userId:new ObjectId(userId)}).toArray()
    console.log(orders)
    resolve(orders)

  })
},
getOrderProducts:(orderId)=>{
  return new Promise(async(resolve,reject) => {
   
  
    let orderItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
      {
        $match:{_id: new ObjectId(orderId) }
        
      },
      {
  $unwind:'$products'
    },
      {
        $project:{
  
      
          item:'$products.item',
          quantity:'$products.quantity',
         
  
        }
      },
      {
        $lookup:{
          from: collection.PRODUCT_COLLECTION,
          localField:'item',
          foreignField:'_id',
          as:'product'
        }
      },
      {
        $project:{
          item:1,
          quantity:1,
          product:{$arrayElemAt:['$product',0]}
        }
      }
    ]).toArray()
    console.log(orderItems);
    
    resolve(orderItems)

     } )
  },

  generateRazorpay:(orderId,total)=>{
    console.log("Order ID:", orderId);
    console.log("Total:", total);
    return new Promise((resolve,reject) => {
      instance.orders.create({
        amount:total * 100,
        currency:'INR',
        receipt:""+orderId,
        notes: {
          key1: "value3",
          key2: "value2"
      }
      },
  function(err,order){
    console.log("New order:",order)
    resolve(order)
  })
      // instance.orders.create(options,function(err,order){
      //   if(err){
      //     console.log(err)
          
      //   }else{
      //     console.log("new order:",order)
      //     resolve(order)
      //   }
      //   })

    })
  },
   verifyPayment:(details)=>{
return new Promise((resolve, reject) => {
const crypto= require('crypto');
console.log("Payment details received:", details);




const orderId = details['payment[razorpay_order_id]'];
const paymentId = details['payment[razorpay_payment_id]'];
const signature = details['payment[razorpay_signature]'];

console.log("Order ID:", orderId);
console.log("Payment ID:", paymentId);
console.log("Signature:", signature);







  let hmac = crypto.createHmac('sha256','GvbyWzUwevCjaFRvoNbWpzaB' )
  console.log("Using Razorpay Key Secret:", 'GvbyWzUwevCjaFRvoNbWpzaB'); // Remove this after debugging

  
  hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
  const generatedHmac = hmac.digest('hex');




  // console.log("Generated HMAC:", generatedHmac);
  // console.log("Expected HMAC:", signature);

  if (generatedHmac === signature) {
    console.log('Payment verified successfully');
    resolve();
  } else {
    console.log('Payment verification failed');
    reject(new Error("Payment verification failed"));
  }

  // if(hmac == details['payment[razorpay_signature']) {
  //   console.log('Payment verified successfully');
  //   resolve()
  // }else{
  //   console.log('Payment verification failed');
  //   reject()
  // }
})
   },
   changePaymentStatus:(orderId)=>{
    return new Promise((resolve,reject) => {
      db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:new ObjectId(orderId)},

      {
        $set:{
          status:'placed'
        }
      }
    ).then((result)=>{
      
      console.log(`Updated order status for order ID: ${orderId}`);

      resolve(result)
     
      
    }) .catch((error) => {
      console.error(`Error updating order status for order ID: ${orderId}`, error);
      reject(error);
    });
    
    })
  
   }
   

}


