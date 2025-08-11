const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;

const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "postgrespass",
    database: "ag-grid",
    port: 5432,
});

app.post('/data', async (req, res) => {
    
    const { name, salary, department } = req.body;
    try{

        const query = 'INSERT INTO employees (id, name, salary, department) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [id, name, salary, department];
        const result = await client.query(query,values)
        res.status(201).json(result);
    }catch(err) {
        console.error('Error inserting data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/data', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM employees');
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); 

app.delete('/data/:id', async (req, res) => {
    const id =req.params.id;
    try{
        const result = await client.query(' DELETE FROM employees WHERE id = $1 RETURNING * ', [id]);
        if(result.rowCount ===0){
            return res.status(404).json({error: 'Employee not found'});
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    }catch(err) {
        console.error('Error deleting data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.put('/data/:id', async (req,res)=>{
    const id = req.params.id;
    const { name, salary, department } = req.body;
    
    try{
        const query =' UPDATE employees SET name= $1, salary= $2, department= $2 WHERE id = $4 RETURNING *;';
        const values = [name, salary, department, id];
        const result = await client.query(query,values);
        if(result.rowCount === 0){
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(result);
    }catch(err) {
        console.error('Error updating data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


client.connect()
    .then(()=>{
     console.log('Connected to PostgreSQL')
        app.listen(PORT, ()=>{
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    })
    .catch(err => {
        console.error('Connection error', err.stack);
    })