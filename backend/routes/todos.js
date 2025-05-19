import express from 'express';
import db from './db.js'; 

const router = express.Router();

router.get('/', (req, res) => {
  db.query('SELECT * FROM todos WHERE deleted = 0 ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { task, reminder_time } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });

  db.query('INSERT INTO todos (task, reminder_time) VALUES (?, ?)', [task, reminder_time || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query('SELECT * FROM todos WHERE id = ?', [result.insertId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(rows[0]);
    });
  });
});

router.put('/:id/toggle', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE todos SET completed = NOT completed WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Task toggled' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo marked as deleted' });
  });
});

export default router;
