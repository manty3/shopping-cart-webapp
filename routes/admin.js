const express = require('express');
const router = express.Router();
const {ADMIN_COLLECTION}=require('../config/collections')
const db = require('../config/connection');
var userHelpers=require('../helpers/user-helpers')
var productHelpers = require('../helpers/product-Helpers');
// var adminHelpers = require('../helpers/admin-helpers')
const session = require('express-session');
/* GET users listing. */

const ADMIN_EMAIL = 'akshaymadathil3@gmail.com';
const ADMIN_PASSWORD = 'Admin@123#';

const verifyAdminLogin = (req, res, next) => {
  if (req.session.admin && req.session.admin.loggedIn) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};









router.get('/login', (req, res) => {
  if (req.session.admin && req.session.admin.loggedIn) {
    res.redirect('/admin');
  } else {
    res.render('admin/login', { "loginErr": req.session.adminLoginErr });
    req.session.adminLoginErr = false;
  }
});

router.post('/login', (req, res) => {
  const { Email, Password } = req.body;
  
  if (Email === ADMIN_EMAIL && Password === ADMIN_PASSWORD) {
    req.session.admin = { Email, Password };
    req.session.admin.loggedIn = true;
  
    res.redirect('/admin');
  } else {
      req.session.adminLoginErr = 'Invalid username or password';
      res.redirect('/admin/login');
    }
  });


// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin/login');
    }
  });
});








router.get('/',verifyAdminLogin, function(req, res, next) {
productHelpers.getAllProducts().then((products)=>{

  res.render('admin/view-products',{admin:req.session.admin,products});
})
  

  
});

router.get('/add-items',function(req,res){
  res.render('admin/add-items')
});
router.post('/add-items',(req,res)=>{
  // console.log(req.body);
  //  console.log(req.files.image);
   productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    console.log(id)
     image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
        if (!err){
          res.render("admin/add-items")  
      }else{
      console.log(err)
      }
      })
   
   })
})
router.get('/delete-Product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId)
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/products')
  })
})

router.get('/edit-product/:id',async(req,res)=>{
  let product= await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updataProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image) {
      let image=req.files.image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
 
})

// router.get('/admin/login', (req, res) => {
//   if (req.session.admin && req.session.admin.loggedIn) {
//     res.redirect('/');
//   } else {
//     res.render('user/login', { "loginErr": req.session.userLoginErr });
//     req.session.userLoginErr = false;
//   }
// });


// router.post('/admin/login', (req, res) => {
//   const { username, password } = req.body;
//   adminHelpers.authenticateAdmin(username, password).then((admin) => {
//     if (admin) {
//       req.session.admin = admin;
//       req.session.admin.loggedIn = true;
//       res.redirect('/admin/login');
//     } else {
//       req.session.userLoginErr = 'Invalid username or password';
//       res.redirect('/admin');
//     }
//   });
// });


router.get('/orders',async (req, res) => {

  let orders = await userHelpers.getadminOrders(req.session.admin._id)
  // Fetch orders and render the page
  res.render('admin/orders', {  orders })
});

module.exports = router;
