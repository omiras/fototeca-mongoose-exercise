// Express modules
const express = require('express');

// Modulo Mongoose
const mongoose = require('mongoose')

const uri = "YOUR-URI-HERE/fototeca-mongoose"; 

// Custom modules
const imageRoutes = require('./routes/images');

// Server variables
const app = express();
app.set('view engine', 'ejs');

// Add middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(imageRoutes);

// Primero tenemos que conectarnos correctamente a la base de datos. Después, ya podemos empezar a escuchar por el puerto 3000
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then( result => {
    app.listen(3000)
})
