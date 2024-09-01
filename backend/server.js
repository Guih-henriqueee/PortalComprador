const express = require('express');
const app = express();
const PORT = process.env.port || 5000;

// Middleware para parse de JSON
app.use(express.json());

// Importa as rotas de usuários
const userRoutes = require('./routes/users');

// Usa as rotas de usuários
app.use('/users', userRoutes);

// Rota Home
app.get('/Home', (req, res) => {
    return res.status(200).send("Estamos só começando!");
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
