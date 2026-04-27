const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const pool = require('./db');
const initDatabase = require('./db/init');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const [tasks] = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error getting tasks' });
    }
});

// add task
app.post('/api/tasks', async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        await pool.query(
            'INSERT INTO tasks (title) VALUES (?)',
            [title]
        );

        res.json({ message: 'Task created' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error creating task' });
    }
});

// delete task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

// toggle completed / pending
app.put('/api/tasks/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            'UPDATE tasks SET completed = NOT completed WHERE id = ?',
            [id]
        );

        res.json({ message: 'Task updated' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

const PORT = process.env.PORT || 3000;

initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});