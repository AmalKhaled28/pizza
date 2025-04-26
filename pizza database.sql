create database pizza;
CREATE TABLE customer( id int AUTO_INCREMENT ,name VARCHAR(60) ,address VARCHAR(60) ,phone VARCHAR(14) UNIQUE, zipcode int ,email VARCHAR(60) UNIQUE ,password VARCHAR(60) UNIQUE ,PRIMARY KEY (id));
 CREATE TABLE customer_order ( orderNo int AUTO_INCREMENT ,Cid int ,orderDate DATE ,totalprice  FLOAT(24) ,
 PRIMARY KEY (orderNo),CONSTRAINT FK_customerOrder FOREIGN KEY (Cid) REFERENCES customer(id));
CREATE TABLE pizzamenu( Pizzaid int ,pizzaName VARCHAR(100) ,pizzaPrice FLOAT(24) , img_path VARCHAR(100) , PRIMARY KEY (Pizzaid));
CREATE TABLE order_pizza ( orderNo int ,Pizzaid int ,
 quantity int ,PRIMARY KEY (orderNo,Pizzaid) , 
 CONSTRAINT FK_customerOrderpizza FOREIGN KEY (orderNo)REFERENCES customer_order(orderNo),
 CONSTRAINT FK_pizaa FOREIGN KEY (Pizzaid) REFERENCES pizzamenu(Pizzaid));