const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const collections =require('../config/collections')
const db = require('../config/connection');
var userHelpers=require('../helpers/user-helpers')
var productHelpers = require('../helpers/product-Helpers');

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

  res.render('admin/view-products',{products});
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
    res.redirect('/admin/')
  })
})

router.get('/edit-product/:id',async(req,res)=>{
 
  let product= await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let id = req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files && req.files.Image) {
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
      if (err) {
        console.error("Error moving image file:", err);
        return res.status(500).send(err);
      }else {
        res.redirect('/admin');
      }
    }
  })
 
})

module.exports = router;
