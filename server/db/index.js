// MySQL Database Connection
const mysql = require('mysql');
const connection = mysql.createConnection({
    password:'A@123456789a',
    user:'root',
    database:'pizza',
    host:'localhost',
});
//Check MySQL Database Connection
connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connected!:)');
   }
 }); 

 //defines pizaadb object 
 //pizaadb exports all functions its making them accessible to other parts of the application.
let pizaadb = {};
//display all pizza in menu
pizaadb.allMenu = () => { 
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM pizzamenu`, (err, result) => {
            if(err) {
                return reject(err);
            }return resolve(result);
        });
    });
};
//get one pizza from menu by name
pizaadb.oneItem = (name) => { 
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM pizzamenu WHERE pizzaName = ?`,[name], (err, result) => {
            if(err) {
                return reject(err);
            }return resolve(result);
        });
    });
};
// add new pizaa 
pizaadb.AddPizza = (Pizzaid ,pizzaName, pizzaPrice, img_path) => {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO pizzamenu SET?', {Pizzaid: Pizzaid, pizzaName: pizzaName, pizzaPrice: pizzaPrice, img_path:img_path}, (err, result) => {
            if(err) {
                return reject(err);
            }else{
                connection.query('SELECT * FROM pizzamenu WHERE Pizzaid = ?', [result.insertId], (err, result) => {
                    if(err) {
                        return reject(err);
                    }return resolve(result);         
                })
            }
        })
    });
};

// update menu
pizaadb.updatePizza = (Pizzaid, pizzaName, pizzaPrice, img_path) => {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE pizzamenu SET  pizzaName = ? , pizzaPrice = ? , img_path = ? WHERE Pizzaid = ? ', [ pizzaName , pizzaPrice , img_path ,Pizzaid], (err, result) => {
            if(err) {
                return reject(err);
            }else{
                connection.query('SELECT * FROM pizzamenu WHERE Pizzaid = ?', [Pizzaid], (err, result) => {
                    if(err) {
                        return reject(err);
                    }return resolve(result);         
                })
             }        
        })
    });
};
//delete menu
pizaadb.deletePizza = (Pizzaid) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM pizzamenu WHERE Pizzaid = ?', [Pizzaid], (err, result) => {
            if(err) {
                return reject(err);
            }return resolve(result);     
        })
    });

   };

// check if email & password are exist or not 
pizaadb.authentication = (email, password) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM customer WHERE email = ? AND password = ?', [email, password], (err, result) => {
            if(err) {
                return reject(err);
            }return resolve(result);         
        })
    });
};
// insert customer 
pizaadb.registeration = (name ,email, password) => {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO customer SET?', {name: name, email: email, password: password}, (err, result) => {
            if(err) {
                return reject(err);
            }else{
                connection.query('SELECT * FROM customer WHERE id = ?', [result.insertId], (err, result) => {
                    if(err) {
                        return reject(err);
                    }return resolve(result);         
                })
            }
        })
    });
};


//display all customer
pizaadb.allCustomer = () => {
  
    return new Promise((resolve, reject) => {

        connection.query(`SELECT * FROM customer`, (err, result) => {

            if(err) {
                return reject(err);
            }return resolve(result);
        });
    });
};
//get one customer by id
pizaadb.oneCustomer= (id) => {
  
    return new Promise((resolve, reject) => {

        connection.query(`SELECT * FROM customer WHERE id = ?`,[id], (err, result) => {
            if(err) {
                return reject(err);
            }return resolve(result[0]);
        });
    });
};

//delete customer
pizaadb.deleteCustomer = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM customer WHERE id = ?', [id], (err, result) => {
            if(err) {
                return reject(err);
            }return resolve(result);     
        })
    });

   };

// uodate profile customer
pizaadb.updateProfile = (id , name , phone , zip_code , address ) => {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE customer SET name = ? , phone = ? , zipcode = ? , address = ? WHERE id = ? ', [name , phone , zip_code , address ,id], (err, result) => {
            if(err) {
                return reject(err);
            }else{
                connection.query('SELECT * FROM customer WHERE id = ?', [id], (err, result) => {
                    if(err) {
                        return reject(err);
                    }return resolve(result);         
                })
             }        
        })
    });
};


pizaadb.saveOrder = (customerId,date,total,cart) => {
    //we create variable to save order
    var orderPizza = [];

    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO customer_order SET?', {Cid: customerId, orderDate: date, totalprice: total}, (err, result) => {
            if(err) {
                return reject(err);
            }else{
                // return the last id for the inserted
                orderId = result.insertId;
                // for each pizza in cart take orderId & pizzaId & pizza quantity and insert it into order_pizza table 
                cart.forEach(pizza => {
                    orderPizza.push([orderId , pizza.pizzaId ,pizza.qty]);
                });
                connection.query('INSERT INTO order_pizza (orderNo, Pizzaid,quantity) VALUES ?', [orderPizza], (err, result) => {
                    if(err) {
                        return reject(err);
                    }
                    return resolve(result);         
                })

                
            }
        })
    });
};

module.exports = pizaadb ;