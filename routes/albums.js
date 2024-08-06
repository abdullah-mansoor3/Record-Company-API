const express = require('express');
const router = express.Router();
const db = require('../startup/db');
const validate = require('../validators/albums');

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

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { name, release_year, band_id } = req.body;

    // Check if the provided band_id exists
    const [bands] = await db.query('SELECT * FROM bands WHERE id = ?', [band_id]);
    if (bands.length === 0) {
        return res.status(400).send('Invalid band id');
    }

    const [result] = await db.query('INSERT INTO albums (name, release_year, band_id) VALUES (?, ?, ?)', [name, release_year, band_id]);

    const [album] = await db.query('SELECT * FROM albums WHERE id = ?', [result.insertId]);
    
    return res.status(201).send(album[0]);
});


module.exports = router;