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
    });

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
    });

    describe('POST /', () => {
        let name, release_year, band_id;
        const exec = async () => {
          return await request(app)
            .post('/albums')
            .send({ name, release_year, band_id });
        };
      
        beforeEach(async () => {
          // Insert a band for testing
          const [result] = await connection.query('INSERT INTO bands (name) VALUES (?)', ['Band 1']);
          band_id = result.insertId;
          name = 'Album 1';
          release_year = 2001;
        });
      
        it('should return 400 if band_id does not exist', async () => {
          band_id = 9999; // Non-existing band_id
          const res = await exec();
          expect(res.status).toBe(400);
        });
      
        it('should return 400 if name is less than 3 characters', async () => {
          name = 'AB';
          const res = await exec();
          expect(res.status).toBe(400);
        });

        it('should return 400 if year is less than 1900', async () => {
            release_year = 19;
            const res = await exec();
            expect(res.status).toBe(400);
          });

          it('should return 400 if year is more than the current year', async () => {
            release_year = new Date().getFullYear();
            const res = await exec();
            expect(res.status).toBe(400);
          });
      
        it('should return 400 if name is more than 255 characters', async () => {
          name = new Array(257).join('a');
          const res = await exec();
          expect(res.status).toBe(400);
        });
      
        it('should return 200 and the created album on correct request body', async () => {
          const res = await exec();
          //this test is failing but working fine when i test it manually
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('name', name);
          expect(res.body).toHaveProperty('release_year', release_year);
          expect(res.body).toHaveProperty('band_id', band_id);
        });
      });
      
});
