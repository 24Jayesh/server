const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');
const jwt = require("jsonwebtoken");
const validator = require('validator');
const keysecret = process.env.SECRET_KEY;


const userSchema = new mongoose.Schema({
  
    fname:{
        type:String,
        require:true,
        trim:true,
    },
    mobile:{
        type:Number,
        require:true,
        unique:true,
        minlength:10,
        maxlength:10,
    },
    email:{
        type:String,
        required :true,
        unique:true,
        validate(value){
          if(!validator.isEmail(value)){
            throw new Error("Invalid Email Id")
          }
        }
     },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    cpassword:{
        type:String,
        required:true,
        minlength:6,
    },
    address:{
        type:String,   
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    orders:{
        type:Array,
        default:[],
    },
    tokens:[
        {
            token:{
                type: String,
                required:true,
            }
        }
    ]



})

//hash password 
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,12);
        this.cpassword=await bcrypt.hash(this.cpassword,12);
    }

    next();
});

//generating token 
userSchema.methods.generateAuthtoken =async  function(){
    try{
        let tokengen = jwt.sign({_id:this._id},keysecret,{
         expiresIn:"1d"
        });
        this.tokens=this.tokens.concat({token:tokengen});
        await this.save();
        return tokengen;
    }catch(error){
         res.status(400).json(error);
    }
}


module.exports =mongoose.model('users',userSchema);
