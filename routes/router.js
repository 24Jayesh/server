const express =require("express");
const router =new express.Router();

//import controllers 
const userContrllers =require('../Constrollers/usercontrollers')




//routers
router.post("/register",userContrllers.addUser);
router.post("/login",userContrllers.loginuser);



module.exports =router;