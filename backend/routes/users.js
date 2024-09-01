const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Função para conectar ao banco de dados
async function connectToDatabase() {
    try {
        if (!global.connection) {
            global.connection = await mysql.createConnection("mysql://gmartins:administrador@localhost:8484/PORTALDOCOMPRADOR");
            console.log('Connected to the PORTALDOCOMPRADOR database.');
        }
        return global.connection;
    } catch (error) {
        console.error('Error connecting to the MySQL database:', error);
        throw error;
    }
}

// Rota para listar usuários
router.get('/ListUsers', async (req, res) => {
    try {
        const conn = await connectToDatabase();
        const [rows] = await conn.query('SELECT * FROM USUARIOS;');
        return res.status(200).send(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// Rota para inserir novo usuário
router.put('/NewUser', async (req, res) => {
    try {
        const conn = await connectToDatabase();
        const { FirstName, LastName, Email, DataNascimento, UserName } = req.body;
        
        const query = `
            INSERT INTO USUARIOS (FirstName, LastName, Email, DataNascimento, UserName)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await conn.execute(query, [FirstName, LastName, Email, DataNascimento, UserName]);

        return res.status(201).send({ id: result.insertId, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send('Internal Server Error');
    }
});


// Rota para atualizar usuário
router.put('/Update', async (req, res) => {
    try {
        const conn = await connectToDatabase();
        const { UserID, FirstName, LastName, Email, DataNascimento } = req.body;
        
        const query = `
            UPDATE USUARIOS
            SET FirstName = ?, LastName = ?, Email = ?, DataNascimento = ?
            WHERE UserID = ?
        `;
        const [result] = await conn.execute(query, [FirstName, LastName, Email, DataNascimento, UserID]);
            console.log([result])
        if (result.affectedRows          === 0) {
            return res.status(404).send({ message: 'User not found' });
        }
        const updatedUser = `SELECT * FROM USUARIOS WHERE UserID = ?`
        const [UserUpdated] = await conn.execute(updatedUser, [UserID]);
        
        return res.status(200).send({ id: UserID, message: 'User updated successfully', UserUpdated });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).send('Internal Server Error');
    }
});
module.exports = router;
