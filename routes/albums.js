const express = require('express');
const router = express.Router();
const db = require('../startup/db');

router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM albums');
    return res.send(rows);
});

router.get('/:id', async(req, res)=>{
    const id = req.params.id;
    const [rows] = await db.query('SELECT * FROM albums WHERE id = ?', [id]);
    if (rows.length === 0) {
        return res.status(404).send('Album not found');
    }
    return res.send(rows[0]);
});

module.exports = router;