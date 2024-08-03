

// const bcrypt = require('bcrypt');
// const db = require('../config/connection');
// const collection = require('../config/collections');
// const { response } = require('../app');


//   module.exports = {
//     adminLogin:(adminData)=> {

//       console.log('adminData:', adminData);
//       let loginStatus=false;
//       let response = {};     
// return  new Promise(async(resolve, reject) => {
//   try { 
// const admin= await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:adminData.Email})
// if(!admin){
//   console.log('Admin not found');
//   resolve({ Status: false });
// } else {
//   bcrypt.compare(adminData.password,admin.password).then((Status)=>{
//     if(Status){
//       console.log('Success')
//      loginresponse.admin=admin
//      loginresponse.Status=true
//       resolve(loginresponse)
//     }else{
//       console.log('FAILED')
//       resolve({Status:false})
//     }
//   })
// }
// } catch (error) {
//   console.error('Error logging in admin:', error);
//   resolve({ Status: false });
// }


// })
//     }}
      
//   //     try {
//   //       console.log('adminData:', adminData);
//   //       if (!adminData || !adminData.email || !adminData.password) {
//   //         throw new Error('Invalid credentials provided');
//   //     }
//   //       const dbConnection = await db.get();
//   //       const ADMIN_COLLECTION = dbConnection.collection(collection.ADMIN_COLLECTION);
  
//   //       const adminCredentials
//   //        = await ADMIN_COLLECTION.findOne({ email: adminData.email })
//   //        if (err) {
//   //         console.error('Error fetching admin:', err);
//   //       } else {(!admin) 
//   //         console.error('Admin not found');
//   //       } 
//   //       if (!adminCredentials) {
//   //         console.log('Admin not found');
//   //         throw new Error('Admin not found');
//   //       }
  
//   //       const passwordMatch = await bcrypt.compare(adminData.Password, adminCredentials.Password);
//   //       if (passwordMatch) {
//   //         console.log('Admin login successful');
//   //         return { Status: true, admin: adminCredentials };
//   //       } else {
//   //         console.log('Invalid password');
//   //         throw new Error('Invalid password');
//   //       }
//   //     } catch (error) {
//   //       console.error('Error logging in admin:', error);
//   //       return { Status: false, message: 'Error logging in admin' };
//   //     }
//   //   },
//   // };
