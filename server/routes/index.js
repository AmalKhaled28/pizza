const express = require('express');
const db = require('../db');
const router = express.Router();
const session = require("express-session");

router.use(express.urlencoded({ extended: true }))
router.use(express.json());  
const flash = require('express-flash');//
router.use(flash());

//It configures middleware like parsing form data and JSON data

//Set up Session Middleware
router.use(session({
    resave: true,
    saveUninitialized: true,
    secret:"yash is a super star",
    cookie: { secure: false, maxAge: 14400000 },
}))

//go to login page 
    router.get('/login', function(req, res){    
        res.render('login')
    })
//
    router.post('/authentication', async function(req, res, next) {
// take email & password from login form
        const { email , password } = req.body;

        try{
    
            let result = await db.authentication(email,password);
           //check if email & password are exist in database or not 
           // email & password are not exist
            if (result.length == 0) {
                req.flash('error', 'Please correct enter email and Password!')
                return res.redirect('login')
            }
            else {
                // email & password are exist
                //  create variable in session called loggedin = true   
                req.session.loggedin = true;
               // create variable in session  called authUser is the data's user that do login 
                req.session.authUser = result[0];
                return res.redirect('home');
            } 
            //if server is not avalibale
        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);
        }
    })

//go to register page 
    router.get('/register', function(req, res, next){    
        res.render('register')
    })
// take name & email & password from register form in html and put them in database
    router.post('/post-register', async function(req, res, next){   
        const {name , email , password } = req.body;

        try{
            // put them in database 
            let result = await db.registeration(name,email,password);
            //no data was sent 
            if (result.length == 0) {
                req.flash('error', 'Please  enter correct values!')
                return res.redirect('register')
            }
            else {
                req.session.loggedin = true;
                req.session.authUser = result[0];
                return res.redirect('home');
            } 

        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);
        }
    });
       
    router.get('/home', function(req, res, next) {
        // if we login in the ssession we go to home else we redirect in login page 
        if (req.session.loggedin) {
            res.render('home');
        } else {
            req.flash('success', 'Please login first!');
            res.redirect('login');
        }
    });
// session login true 
    router.get("/contact", (req, res) => {
        if (req.session.loggedin) {
            res.render("contact");
        } else {
            req.flash('success', 'Please login first!');
            res.redirect('login');
        }
    });

    router.get("/about", (req, res) => {
        if (req.session.loggedin) {
            res.render("about");
        } else {
            req.flash('success', 'Please login first!');
            res.redirect('login');
        }
    });

    router.get("/menu",async (req, res) => {
        if (req.session.loggedin) {
            let pizzas = await db.allMenu();
            res.render("menu",{ pizzas : pizzas});
        } else {
            req.flash('success', 'Please login first!');
            res.redirect('login');
        }
    });

    router.get("/profile", (req, res) => {
        if (req.session.loggedin) {
            let user = req.session.authUser;
            res.render("profile" , {user:user});
        } else {
            req.flash('success', 'Please login first!');
            res.redirect('login');
        }
    });

    router.get("/shoppingcart", (req, res) => {
        if (req.session.loggedin) {
        //if session cart is not exist create one 
            if(!req.session.cart){
                req.session.cart = [];
            }
            res.render("shoppingcart",{ cart : req.session.cart });

        } else {
            req.flash('success', 'Please login first!');
            res.redirect('login');
        }
    });
    router.post("/addCart",async (req, res) => {
        //if session cart is not exist create one 
        if(!req.session.cart){
            req.session.cart = [];
        }
       // take valuse from menu form
        const { qty , pizza_id , pizza_name, pizza_img ,pizza_price} = req.body;
        cart = req.session.cart; 
        // check with pizza id in the cart if then it will return the index of pizaa else return -1
        indexInCart = cart.findIndex(x => x.pizzaId === pizza_id);
        // there is a pizza in cart 
        if(indexInCart != -1){
            //increse Quntity pizaa
          cart[indexInCart].qty = parseInt(cart[indexInCart].qty) +parseInt(qty);
        }else{
            //there is no pizza in cart and we will add pizza to cart 
            const cart_item = {
                pizzaId : pizza_id,
                pizzaName : pizza_name,
                pizzaPrice : pizza_price ,
                qty : qty,
                img_path : pizza_img,
            };
            //  put it in the cart
            cart.push(cart_item);
        }
        req.session.cart = cart;
        res.redirect("menu");
    });

    router.post("/deleteItemInCart",async (req, res) => {
         ///pizaa id
        const { pizza_id } = req.body;

        cart = req.session.cart;
        // we take id and removed it from cart
        // creates new cart by filtering the cart is existing , keeping only items whose pizzaId doesn't match the provided one.
        req.session.cart = cart.filter((obj) => obj.pizzaId != pizza_id);

        res.redirect("shoppingcart");
    });
    


    

    router.post("/updateProfile", async (req, res) => {
        //take name & phone & zip_code & address from profile form
        const {id , name , phone , zip_code , address } = req.body;

        try{
            let result = await db.updateProfile(id , name , phone , zip_code , address );
            if (result.length == 0) {
                req.flash('error', 'Please  enter correct values!')
                return res.redirect('profile')
            }
            else {
                req.session.authUser = result[0];
                return res.redirect('profile');
            } 

        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);
        }
    });
    
    // Logout user
    router.get('/logout', function (req, res) {
        req.session.destroy();
        res.redirect('login');
    });


    //get all customer
    router.get('/customer', async (req,res,next) => {
  
    try{
        let result = await db.allCustomer();
        res.json(result);
    }catch(e){
        console.log(e);
        res.json(e);
        res.sendStatus(500);

    }

    });

    //get one customer
    router.get('/customer/:id', async (req,res,next) => {

    try{
        let result = await db.oneCustomer(req.params.id);
        res.json(result);
    }catch(e){
        console.log(e);
        res.json(e);
        res.sendStatus(500);

    }

    });
    
    router.delete('/deleteCustomer/:id', async (req,res,next) => {
        id = req.params.id
        try{
            let result = await db.deleteCustomer(id);
            res.json(result);
        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);

        }
    
    });


    

    router.post('/checkout', async function(req, res, next){   
        // take total price from shopping cart
        const { total_price } = req.body;
        
        cart = req.session.cart;
        date = new Date();
        // take customer id from authUser from session 
        customerId = req.session.authUser.id;

        try{
            let result = await db.saveOrder(customerId,date,total_price,cart);
            //if error exit
            if (result.length == 0) {
                req.flash('error', 'Something went wrong!')
                return res.redirect('home')
            }
            else {
                // to make the cart empty
                req.session.cart = [];
                return res.redirect('home');
            } 
        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);
        }
    });

    
/* Pizza API routes */
//get all menu
    router.get('/menupiizza', async (req,res,next) => {
  
        try{
            let result = await db.allMenu();
            res.json(result);
        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);

        }

    });

    // get one pizza by name
    router.get('/menupiizza/:name', async (req,res,next) => {
  
        try{
            let result = await db.oneItem(req.params.name);
            res.json(result);
        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);
    
        }
    
    });


   // add new pizza
    router.post('/addpiizza', async (req,res,next) => {
        const {Pizzaid , pizzaName , pizzaPrice , img_path } = req.body;
        try{
            let result = await db.AddPizza(Pizzaid, pizzaName, pizzaPrice, img_path);
            res.json(result);
        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);
    
        }
    
    });

    router.put('/updatePizza', async (req,res,next) => {
        
        const {Pizzaid, pizzaName , pizzaPrice , img_path } = req.body;
        try{
            let result = await db.updatePizza(Pizzaid, pizzaName, pizzaPrice, img_path);
            res.json(result);
        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);
    
        }
    
    });
    
    
    router.delete('/deletePizza/:pizzaId', async (req,res,next) => {
        pizzaId = req.params.pizzaId
        try{
            let result = await db.deletePizza(pizzaId);
            res.json(result);
        }catch(e){
            console.log(e);
            res.json(e);
            res.sendStatus(500);

        }
    
    });



module.exports = router;