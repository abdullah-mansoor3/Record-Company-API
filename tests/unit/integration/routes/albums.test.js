const request = require('supertest');
const mysql = require('mysql2/promise');
const config = require('config');
const app = require('../../../../index');

let connection;

beforeAll(async () => {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: config.get('mySqlPass'),
        database: 'record_company_test'
    });
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
});

afterAll(async () => {
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
    await connection.end();
});

describe('/albums', () => {
    beforeEach(async () => {
        await connection.query('DELETE FROM songs;'); // Delete child records first
        await connection.query('DELETE FROM albums;');
        await connection.query('DELETE FROM bands;');
    }, 10000);

    describe('GET /', () => {
        it('should return all albums', async () => {
            const [bandResult] = await connection.query('INSERT INTO bands (name) VALUES (?)', ['Band 1']);
            const bandId = bandResult.insertId;

            await connection.query(`
                INSERT INTO albums (name, release_year, band_id) VALUES
                ('Album 1', 2001, ?),
                ('Album 2', 2002, ?),
                ('Album 3', 2003, ?)
            `, [bandId, bandId, bandId]);

            const res = await request(app).get('/albums');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(a => a.name === 'Album 1')).toBeTruthy();
            expect(res.body.some(a => a.name === 'Album 2')).toBeTruthy();
            expect(res.body.some(a => a.name === 'Album 3')).toBeTruthy();
            expect(res.body.some(a => a.release_year === 2001)).toBeTruthy();
            expect(res.body.some(a => a.release_year === 2002)).toBeTruthy();
            expect(res.body.some(a => a.release_year === 2003)).toBeTruthy();
            expect(res.body.some(a => a.band_id === bandId)).toBeTruthy();
        });
    }, 10000);

    describe('GET /:id', () => {
        it('should return 404 if album with the given id does not exist', async () => {
            const res = await request(app).get('/albums/2343');
            expect(res.status).toBe(404);
        });

        it('should return the album if it exists', async () => {
            const [bandResult] = await connection.query('INSERT INTO bands (name) VALUES (?)', ['Band 1']);
            const bandId = bandResult.insertId;

            const [albumResult] = await connection.query('INSERT INTO albums (name, release_year, band_id) VALUES (?, ?, ?)', ['Album 1', 2001, bandId]);

            const res = await request(app).get(`/albums/${albumResult.insertId}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Album 1');
            expect(res.body).toHaveProperty('release_year', 2001);
            expect(res.body).toHaveProperty('band_id', bandId);
        });
    }, 10000);
});
