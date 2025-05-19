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

router.put('/:id/reminder', (req, res) => {
  const { id } = req.params;
  const { reminder_time } = req.body;
  if (!reminder_time) return res.status(400).json({ error: 'Reminder time is required' });

  const now = new Date();
  const reminderDate = new Date(reminder_time);
  if (reminderDate < now) return res.status(400).json({ error: 'Reminder time cannot be in the past' });

  db.query('UPDATE todos SET reminder_time = ? WHERE id = ?', [reminder_time, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Reminder updated' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE todos SET deleted = 1 WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo marked as deleted' });
  });
});

export default router;
