
const newUser =require('../models/user');
const bcrypt =require('bcryptjs');


//for user registration 
exports.addUser=async(req,res)=>{
     const {fname,mobile,email,password,cpassword,address}=req.body;
     
      //checking validation
    if(!fname || !mobile || !email || !password || !cpassword){
        return res.status(400).json({error:"All fields are required!"})
    }

    else{
         try{
            const preuser = await newUser.findOne({email:email})
            
            if(preuser){
                return res.status(400).json({error:"This email is Already Exist!"})
            }else if(password !==cpassword){
               return res.status(400).json({error:"Password and Confirm Password does not match"});
            }else{
                const finalUser =  new newUser({
                    fname,mobile,email,password,cpassword,address
                });

            //password hasing 
            const storeData =await finalUser.save();
            console.log(storeData);
           res.status(201).json({message:'User Added Successfully!'});
            }
            


            
         }catch(error){
             console.log("catch block error");
            return res.status(400).json(error);
         }
    }

}


//login user
exports.loginuser =async(req,res)=>{
    const {email,password}=req.body;

    //check validation
    if(!email || !password){
        return  res.status(400).json({error:"Please enter all fields!"})
    } 
    else{
        try{
            const userValid = await newUser.findOne({email:email})

            if(userValid){
                const isMatch = await bcrypt.compare(password,userValid.password);
                if(!isMatch){
                    res.status(400).json({error:"Invalid Credentials"});
                }
                else{
                    //generating token 
                    const token =await userValid.generateAuthtoken();
                   // console.log(token);

                    const result = {
                        userValid,
                        token
                     }

                    res.status(200).json({status:200,result});
                }
            }

        }
        catch(error){
            console.log("catch block error");
            return res.status(400).json(error);
        }
    }

} 