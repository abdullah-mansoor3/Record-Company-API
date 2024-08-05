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
});

afterAll(async () => {
  await connection.end();
});

describe('/bands', () => {
  beforeEach(async () => {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('DELETE FROM bands;'); 
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
  });

  describe('GET /', () => {
    it('should return all bands', async () => {
      await connection.query(`
        INSERT INTO bands (name) VALUES
        ('Band 1'),
        ('Band 2'),
        ('Band 3');
      `);

      const res = await request(app).get('/bands');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(b => b.name === 'Band 1')).toBeTruthy();
      expect(res.body.some(b => b.name === 'Band 2')).toBeTruthy();
      expect(res.body.some(b => b.name === 'Band 3')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return 404 if band with the given id does not exist', async () => {
      const res = await request(app).get('/bands/2343');
      expect(res.status).toBe(404);
    });

    it('should return the band if it exists', async () => {
      const [result] = await connection.query('INSERT INTO bands (name) VALUES (?)', ['Band 1']);
      const id = result.insertId;

      const res = await request(app).get(`/bands/${id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Band 1');
    });
  });

  describe('POST /', () => {
    let name;
    const exec = async () => {
        return await request(app)
            .post('/bands')
            .send({ name });
    };

    beforeEach(() => {
        name = 'band1';
    });

    it('should return 400 if name is less than 3 characters', async () => {
        name = '12';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 255 characters', async () => {
        name = new Array(257).join('a');
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 on correct request body', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
        console.log(res.body);
        expect(res.body).toHaveProperty('id'); 
        expect(res.body).toHaveProperty('name', 'band1'); 
    });
});


  describe('PUT /:id', () => {
    let name, id;
    const exec = async () => {
      return await request(app)
        .put('/bands/' + id)
        .send({ name });
    };

    beforeEach(async () => {
      await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await connection.query('DELETE FROM bands;');
      await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

      const [result] = await connection.query('INSERT INTO bands (name) VALUES (?)', ['Band 1']);
      id = result.insertId;
      name = 'band1';
    });

    it('should return 400 if name is less than 3 characters', async () => {
      name = '12';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 255 characters', async () => {
      name = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 404 if band with the given id does not exist', async () => {
      id = 8398;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return 200 and the updated object if request is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', name);
      expect(res.body).toHaveProperty('id', id);
    });
  });

  describe('DELETE /:id', () => {
    let id;
    const exec = async () => {
      return await request(app)
        .delete('/bands/' + id)
        .send();
    };

    beforeEach(async () => {
      const [result] = await connection.query('INSERT INTO bands (name) VALUES (?)', ['Band 1']);
      id = result.insertId;
    });

    it('should return 404 if band with the given id does not exist', async () => {
      id = 8398;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should delete the band if it exists and return the band', async () => {
      const res = await exec();
      const [band] = await connection.query('SELECT * FROM bands WHERE id = ?', [id]);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', id);
      expect(res.body).toHaveProperty('name', 'Band 1');
      expect(band.length).toBe(0);
    });
  });
});
