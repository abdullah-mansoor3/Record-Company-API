const express = require('express');
const router = express.Router();
const db = require('../startup/db');
const validate = require('../validators/bands');

router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM bands');
    return res.send(rows);
});

router.get('/:id', async(req, res)=>{
    const id = req.params.id;
    const [rows] = await db.query('SELECT * FROM bands WHERE id = ?', [id]);
    if (rows.length === 0) {
        return res.status(404).send('Band not found');
    }
    return res.send(rows[0]);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const {name} = req.body;
    const [result] = await db.query('INSERT INTO bands (name) VALUES (?)', [name]);
    const [bands] = await db.query(`SELECT * FROM bands WHERE id = ?`, [result.insertId]);
    return res.send(bands[0]);
});

router.put('/:id',async (req, res)=>{
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    const {name} = req.body;
    const [result] = await db.query(`UPDATE bands
        SET name = ?
        WHERE id = ?`, [name, req.params.id]);
    if(result.affectedRows === 0){
        return res.status(404).send('Band not found');
    }
    const [updatedBand] = await db.query(`SELECT * FROM bands WHERE id = ? `, [req.params.id]);
    return res.send(updatedBand[0]);
});

router.delete('/:id',async (req, res)=>{
    const [rows] = await db.query(`SELECT * FROM bands
        WHERE id = ?`, [req.params.id]);
    if(rows.affectedRows === 0){
        return res.status(404).send('Band not found');
    }

    const band = rows[0];

    const result = await db.query('DELETE FROM bands WHERE id=?', [req.params.id]);
    if(result[0].affectedRows === 0 ){
        return res.status(404).send('Band not found');
    }

    return res.send(band);
});

module.exports = router;
