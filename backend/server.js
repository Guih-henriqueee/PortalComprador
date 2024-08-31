const express = require('express');
const app = express();
const PORT = process.env.port || 5000;


app.use(express.json());


app.get('/home', (request, response)=>{
    response.status(200).send("Estamos só começando!")
});

app.listen(PORT, () =>{
    console.log(`App is running in ${PORT}`)

});
