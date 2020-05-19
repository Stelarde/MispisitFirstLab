var express= require('express'),
        path= require('path'),
        bodyParser= require('body-parser')
        cons = require('consolidate'),
        dust =require('dustjs-helpers'),
        pg= require ('pg'),
        app = express();

var connect= "postgres://Sereja:password@localhost/Transport";


var client = new pg.Client(connect , function(err, client, done){
    if (err) {
     return console.error('error fethcing data',err);
    }
   });
  
  // assign dust engine to .dust files
  app.engine('dust',cons.dust);
  
  // set default ext .dust
  app.set('view engine','dust');
  app.set('views',__dirname + '/views');
  
  // set public folder
  app.use(express.static(path.join(__dirname, 'public')));
  
  // body parser middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended : false }));
  
  app.get('/',function(req,res){
   // connect to postgres    
    console.log('Rendering index');
    res.render('layout');
  });

//====================================================City=========================================================
  app.get('/city',function(req,res){
    // connect to postgres     
     client.query('SELECT * FROM cityfrom', function(err, result) {
     if(err) {
      return console.error('error running query============================================', err);
     }
     console.log('Rendering city==========================================================');
     res.render('city', {city: result.rows});     
    }); 
   });

   app.post('/addCity',function(req,res){
    client.query("INSERT INTO cityto (city_namet) VALUES($1)",
    [req.body.name]);
    client.query("INSERT INTO cityfrom (city_namef) VALUES($1)",
    [req.body.name]);
          res.redirect('/city');
  });

  app.post('/deletecity',function(req,res){
    client.query("DELETE FROM cityfrom WHERE city_id=$1",
    [req.body.city_id]);
    client.query("DELETE FROM cityto WHERE city_id=$1",
    [req.body.city_id]);
          res.redirect('/city');
  })
//====================================================DRIVER=========================================================
    app.get('/driver',function(req,res){
      client.query('SELECT * FROM driver', function(err, result) {
        if(err) {
         return console.error('error running query============================================', err);
        }
        console.log('Rendering driver==========================================================');
        res.render('driver', {driver: result.rows});     
       }); 
     });  

     app.post('/addDriver',function(req,res){
      client.query("INSERT INTO driver(driver_name, driver_surname) VALUES($1,$2)",
      [req.body.name, req.body.surname]);
            res.redirect('/driver');
    });

    app.post('/deleteDriver',function(req,res){
      client.query("DELETE FROM driver WHERE driver_id=$1",
      [req.body.driver_id]);
            res.redirect('/driver');
    })
//====================================================TYPEORDER=========================================================
app.get('/typeorder',function(req,res){
  client.query('SELECT * FROM typeorder', function(err, result) {
    if(err) {
     return console.error('error running query============================================', err);
    }
    console.log('Rendering typeorder==========================================================');
    res.render('typeorder', {typeorder: result.rows});     
   }); 
 });  

 app.post('/addType',function(req,res){
  client.query("INSERT INTO typeorder(type_name) VALUES($1)",
  [req.body.Typename]);
        res.redirect('/typeorder');
});
//====================================================ADMINS=========================================================
app.get('/admin',function(req,res){
  client.query('SELECT * FROM admin', function(err, result) {
    if(err) {
     return console.error('error running query============================================', err);
    }
    console.log('Rendering typeorder==========================================================');
    res.render('admin', {admin: result.rows});     
   }); 
 });  


 app.post('/addAdmin',function(req,res){
  client.query("INSERT INTO admin(name,surname,login,password) VALUES($1,$2,$3,$4)",
  [req.body.name, req.body.surname, req.body.login, req.body.password]);
        res.redirect('/admin');
});

app.post('/deleteAdmin',function(req,res){
  client.query("DELETE FROM admin WHERE id=$1",
  [req.body.id]);
        res.redirect('/admin');
})
//====================================================ORDERS=========================================================
app.get('/order',function(req,res){
  client.query(' SELECT * FROM orderk JOIN driver ON driver.driver_id=orderk.driver_id JOIN cityto ON cityto.city_id = orderk.cityto_id JOIN cityfrom ON cityfrom.city_id = orderk.cityfrom_id JOIN admin ON admin.id = orderk.admin_id JOIN typeorder ON typeorder.type_id = orderk.typeofproduct_id', function(err, result10) {
    if(err) {
     return console.error('error running query============================================', err);
    }
    console.log('Rendering order==========================================================');
    client.query('select * from driver ', function(err, result) {
      if(err) {
       return console.error('error running query============================================', err);
      }
      console.log('Rendering orderAdd==========================================================');
  
      client.query('select * from cityfrom ', function(err, result1) {
        if(err) {
         return console.error('error running query============================================', err);
        }
        console.log('Rendering orderAdd==========================================================');
        
        client.query('select * from admin ', function(err, result2) {
          if(err) {
           return console.error('error running query============================================', err);
          }
          console.log('Rendering orderAdd==========================================================');
          
          client.query('select * from typeorder ', function(err, result3) {
            if(err) {
             return console.error('error running query============================================', err);
            }
            console.log('Rendering orderAdd==========================================================');
            
            client.query('select * from cityto ', function(err, result4) {
              if(err) {
               return console.error('error running query============================================', err);
              }
              console.log('Rendering orderAdd2==========================================================');
              
              res.render('order', {order:result10.rows, addCityFrom: result1.rows, addDrivers: result.rows, addAdmin:result2.rows, addType:result3.rows, addCityTo:result4.rows});
              });   
           });        
         });     
       });     
     });   
   }); 
 }); 

 

 app.get('/orderhistory',function(req,res){
  client.query(' SELECT * FROM orderkhistory JOIN driver ON driver.driver_id=orderkhistory.driver_id JOIN cityto ON cityto.city_id = orderkhistory.cityto_id JOIN cityfrom ON cityfrom.city_id = orderkhistory.cityfrom_id JOIN admin ON admin.id = orderkhistory.admin_id JOIN typeorder ON typeorder.type_id = orderkhistory.typeofproduct_id', function(err, result) {
    if(err) {
     return console.error('error running query============================================', err);
    }
    console.log('Rendering order==========================================================');
    res.render('orderhistory', {orderhistory: result.rows});     
   }); 
 }); 

 //====================================================ORDERSADDGET=========================================================

 app.get('/orderAdd',function(req,res){
  client.query('select * from driver ', function(err, result) {
    if(err) {
     return console.error('error running query============================================', err);
    }
    console.log('Rendering orderAdd==========================================================');

    client.query('select * from cityfrom ', function(err, result1) {
      if(err) {
       return console.error('error running query============================================', err);
      }
      console.log('Rendering orderAdd==========================================================');
      
      client.query('select * from admin ', function(err, result2) {
        if(err) {
         return console.error('error running query============================================', err);
        }
        console.log('Rendering orderAdd==========================================================');
        
        client.query('select * from typeorder ', function(err, result3) {
          if(err) {
           return console.error('error running query============================================', err);
          }
          console.log('Rendering orderAdd==========================================================');
          
          client.query('select * from cityto ', function(err, result4) {
            if(err) {
             return console.error('error running query============================================', err);
            }
            console.log('Rendering orderAdd==========================================================');
            
            res.render('orderAdd', {addCityFrom: result1.rows, addDrivers: result.rows, addAdmin:result2.rows, addType:result3.rows, addCityTo:result4.rows});  });   
         });        
       });     
     });     
   }); 
 });  


//====================================================ORDERSADDPOST=========================================================



app.post('/orderADDNew',function(req,res){
  client.query("INSERT INTO orderk (admin_id, cityfrom_id, cityto_id, driver_id, typeofproduct_id,weight,size_x,size_y,size_z,costdelivery,dateotpr,dateprbt) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
  [req.body.admin_id, 
    req.body.cityfrom, 
    req.body.cityto, 
    req.body.iddriver, 
    req.body.idtype,
    req.body.weight,
    req.body.size_x,
    req.body.size_y,
    req.body.size_z,
    req.body.costdelivery,
    req.body.dateotpr,
    req.body.dateprbt]);  
      res.redirect('/order');
});


app.post('/deleteOrder',function(req,res){
  client.query("INSERT INTO  orderkhistory  SELECT * FROM orderk WHERE order_id=$1", 
  [req.body.order_id]); 

  client.query("DELETE FROM orderk WHERE order_id=$1",
  [req.body.order_id]);
   res.redirect('/order');
});




//====================================================ORDERSADDPOST=========================================================

//====================================================ORDERSEdit=========================================================
app.post('/orderedit',function(req,res){
  client.query("UPDATE  orderk SET admin_id=$1, cityfrom_id=$2, cityto_id=$3, driver_id=$4, typeofproduct_id=$5, weight=$6, size_x=$7, size_y=$8, size_z=$9, costdelivery=$10, dateotpr=$11, dateprbt=$12 WHERE order_id=$13", 
  [ req.body.admin_id, 
    req.body.cityfrom, 
    req.body.cityto, 
    req.body.iddriver, 
    req.body.idtype,
    req.body.weight,
    req.body.size_x,
    req.body.size_y,
    req.body.size_z,
    req.body.costdelivery,
    req.body.dateotpr,
    req.body.dateprbt,
    req.body.orderid]); 
    console.log('ADMIN===================================='+req.body.admin_id); 
    console.log('cityfrom===================================='+req.body.cityfrom); 
    console.log('city_to===================================='+req.body.cityto); 
    console.log('iddriver===================================='+req.body.iddriver); 
    console.log('idtype===================================='+req.body.idtype); 
    console.log('weight===================================='+req.body.weight); 
    console.log('size_x===================================='+req.body.size_x); 
    console.log('size_y===================================='+req.body.size_y); 
    console.log('size_z===================================='+req.body.size_z); 
    console.log('costdelivery===================================='+req.body.costdelivery); 
    console.log('dateotpr===================================='+req.body.dateotpr); 
    console.log('dateprbt===================================='+req.body.dateprbt); 
    console.log('ID===================================='+req.body.orderid); 
    
  res.redirect('/order');
  
});
//====================================================ORDERSEdit=========================================================





//////////////////
  // server
  app.listen(3005, function(){
    client.connect();
    console.log('Server Started On Port 3005');
  });

 