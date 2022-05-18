const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { nanoid } = require('nanoid');

require('dotenv').config();

const app = require('../../app');
const { User } = require('../../models/user');

const { DB_TEST_HOST, SECRET_KEY } = process.env;

describe('test users routes', () => {
  let server;
  beforeAll(() => (server = app.listen(3000)));
  afterAll(() => server.close());

  beforeEach(done => {
    mongoose.connect(DB_TEST_HOST).then(() => done());
  });

  afterEach(done => {
    mongoose.connection.db.dropCollection(() => {
      mongoose.connection.close(() => done());
    });
  });

  test('test login route', async () => {
    const avatarURL = gravatar.url('test@gmail.com');
    const verificationToken = nanoid();

    const newUser = {
      email: 'test@gmail.com',
      password: '123456',
      avatarURL,
      verificationToken,
    };

    const user = await User.create(newUser);

    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });

    await User.findByIdAndUpdate(user._id, { token });

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@gmail.com', password: '123456' })
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    const { body } = response;
    const userToken = await User.findById(user._id);
    expect(body.token).toBe(userToken);
  });
});
