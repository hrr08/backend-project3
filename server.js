const express = require('express'),
      app = express(),
      port = process.env.PORT || 8080;


//configure the routes
app.use(require('./app/routes'));
      
 
//create server      
app.listen(port, function(){
    console.log("Listening to the port "+ port + "!");
})