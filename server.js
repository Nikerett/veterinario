var express = require("express") 
var app = express()
var connpool = require("./database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

require("./endpoints/tasks.js")(app,connpool)
require("./endpoints/veterinario.js")(app,connpool)
// Insert here other API endpoints

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
