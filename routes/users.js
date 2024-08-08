var express = require('express');
var router = express.Router();
const {USER_COLLECTION}=require('../config/collections')
const db = require('../config/connection');
const productHelpers = require('../helpers/product-Helpers');
const userHelpers=require('../helpers/user-helpers');
const { response } = require('../app');
const session = require('express-session');



const veriffyLogin=(req,res,next)=>{
  if(req.session.user && req.session.user.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/all-products',  async function(req, res, next) {
  let user=req.session.user
  
  let cartCount=null
  if (req.session.user){
   cartCount= await userHelpers.getCartCount(req.session.user._id)
  }
   let products=await productHelpers.getAllProducts().then((products)=>{
  
    res.render('user/view-products',{products,user,cartCount});
  })
   
  });
  router.get('/login',(req,res)=>{
    if(req.session.user  && req.session.user.loggedIn){
      res.redirect('/')
    }else{
      res.render('user/login',{"loginErr":req.session.userLoginErr})
      req.session.userLoginErr=false
    }
    
  })
  router.get('/signup',(req,res)=>{
    res.render('user/signup')
  })
  router.post('/signup',(req,res)=>{
userHelpers.doSignup(req.body).then((response)=>{
  console.log(response)
 
  req.session.user=response
  req.session.user.loggedIn=true
  res.redirect('/')
})
  })
  router.post('/login',(req,res)=>{
    userHelpers.doLogin(req.body).then((response)=>{
    
      if(response.Status){
        
        req.session.user=response.user
        req.session.user.loggedIn=true
res.redirect('/')
      }else{
        req.session.userLoginErr="Invalid Username or Password"
        res.redirect('/login')
      }
    })
  })
  router.get('/logout',(req,res)=>
  {
    req.session.user=null
    
    res.redirect('/')
  })
  router.get('/cart',veriffyLogin,async(req,res)=>{

    if (!req.session.user) {
      res.redirect('/login');
    } else {
    let products=await userHelpers.getCartProducts(req.session.user._id)
    let totalValue=0
    if(products.length>0){
       totalValue= await userHelpers.getTotalAmount(req.session.user._id) 
    }
     console.log( products);
    res.render('user/cart',{products,user:req.session.user,totalValue})
  }
  })

  
  router.get('/add-to-cart/:id',(req,res)=>{
    console.log("api callled")
    
   
 userHelpers.addTocart(req.params.id,req.session.user._id).then((response)=>{

  res.json({status:true})
  
  // res.redirect('/')
})
  })
 router.post('/change-product-quantity',(req,res,next)=>{
  console.log(req.body)
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total=await userHelpers.getTotalAmount(req.body.user)
res.json(response)
  })
 })
router.post('/Remove-button',(req,res)=>{
  console.log(req.body)
  userHelpers.RemoveProduct(req.body).then((response)=>{
    console.log(response)
    res.json(response)
  })
})


router.get('/place-order',veriffyLogin,async(req,res)=>{
  let total=await userHelpers.
  getTotalAmount(req.session.user._id)
  res.render('user/place-order',{total,user:req.session.user})

})
router.post('/place-order',async(req,res)=>{
  let products=await userHelpers.getCartProductList(req.body.userId)
  let totalPrice= await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
    if(req.body['payment-method'] ==='COD'){
      res.json({codSuccess:true})
    }else{
      userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
res.json(response)
      })
    }
    
  })
  console.log(req.body)
})
router.get('/order-success',(req,res)=>{
  res.render('user/order-success', {user:req.session.user})
})
router.get('/orders', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
  let orders = await userHelpers.getUserOrders(req.session.user._id)
  res.render('user/orders', { user: req.session.user, orders })
  }
})


router.get('/view-order-products/:id',(async(req,res)=>{
  if (!req.session.user) {
    res.redirect('/login');
  } else {
  let products=await userHelpers.getOrderProducts(req.params.id)
  console.log('Fetched products:', products);
  res.render('user/view-order-products',{user:req.session.user,products})
  }
}))

router.post('/verify-payment',(req,res)=>{
  console.log(req.body)
  userHelpers.verifyPayment(req.body).then(()=>{
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log("Payment successfull");
      res.json({status:true})
    })
  }).catch((err)=>{
console.log(err)
res.json({status:false,errMsg:'failed to change status'});
  })
})
module.exports = router;
