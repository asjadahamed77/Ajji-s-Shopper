const port = 5000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { type } = require("os");

app.use(express.json());
app.use(cors());

// Connecting with MongoDB
mongoose.connect("mongodb+srv://asjad:asjad@cluster0.dzwxqlu.mongodb.net/e-commerce");

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Creating Upload EndPoint for Images
app.use('/images', express.static(path.join(__dirname, 'upload/images')));
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Schema for creating Products
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

app.post('/addproduct', async (req, res) => {
  let products = await Product.find({});
  let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({ success: true, name: req.body.name });
});

app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// Schema creating for User Model

const Users = mongoose.model('Users',{
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String
    },
    cartData:{
        type:Object
    },
    date:{
        type:Date,
        default:Date.now
    }
})

//creating endpoint for registering the user

app.post('/signup',async (req,res)=>{
    let check = await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,errors:'Existing user found with same email address'})
    }
    let cart = {}
    for(let i = 0 ; i < 300 ; i++){
        cart[i] = 0
    }
    const user = new Users({
        name : req.body.username,
        email : req.body.email,
        password : req.body.password,
        cartData : cart,
    })
    await user.save()

    const data = {
        user : {
            id:user._id
        }
    }

    const  token = jwt.sign(data,'secret_ecom')
    res.json({success:true,token})
})

// Creating EndPoint for User Login

app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email})
    if(user){
        const passCompare = req.body.password===user.password
        if(passCompare){
            const data = {
                user :{
                    id:user._id
                }
            }
            const  token = jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:'Wrong Password'})
        }
    }
    else{
        res.json({success:false,errors:'Wrong Email Address'})
    }
   
})

// Creating EndPoint for New Collection 
app.get('/newcollections', async (req,res)=>{
    let products = await Product.find(({}))
    let newcollection = products.slice(1).slice(-8)
    console.log("New Collections Fetched")
    res.send(newcollection)
})

// Creating EndPoint for Popular in Women 
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"})
    let popular_in_women = products.slice(0,4)
    console.log("Popular in Women Fetched")
    res.send(popular_in_women)
})

// creating middleware to fetch user

const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({errors:"Please authenticate valid token"})
    }
    else{
        try{
                const data = jwt.verify(token,'secret_ecom')
                req.user = data.user
                next()
        }catch(error){
            res.status(401).send({errors:"Please authenticate valid token"})
        }
    }
}

// Creating EndPoint for Adding Products in Cart Data
app.post('/addtocart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({_id: req.user.id});
    if (!userData) {
        return res.status(404).send({ error: "User not found" });
    }
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send("Added");
});
// Creating EndPoint for Removing Products in Cart Data
app.post('/removefromcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({_id: req.user.id});
   if( userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send("Removed");
});

// Creating EndPoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("Get Cart")
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData)
})

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});
