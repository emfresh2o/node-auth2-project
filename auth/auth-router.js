const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

const router = require('express').Router();
const users = require('../users/users-model.js');
const { isValid } = require('../users/users-service.js');

router.post('/register', async (req, res) => {
  const credentials = req.body;

  try {
    if (isValid(credentials)) {
      // const rounds = process.env.BCRYPT_ROUNDS ?
      //   parseInt(process.env.BCRYPT_ROUNDS) : 8;

      const rounds = process.env.BCRYPT_ROUNDS;

      const hash = bcryptjs.hashSync(credentials.password, rounds);
      credentials.password = hash;

      const user = await Users.add(credentials);
      const token = generateToken(user);
      res.status(201).json({ data: user, token });
    } else {
      next({
        apiCode: 400,
        apiMessage:
          'username or password missing, or password not alphanumeric',
      });
    }
  } catch (err) {
    console.log(err);
    next({ apiCode: 500, apiMessage: 'error saving new user', ...err });
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!isValid(req.body)) {
      next({
        apiCode: 400,
        apiMessage:
          'username or password missing, or password not alphanumeric',
      });
    } else {
      const [user] = await Users.findBy({ username: username });
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: 'welcome to the api', token: token });
      } else {
        next({ apiCode: 401, apiMessage: 'invalid credentials' });
      }
    }
  } catch (err) {
    next({ apiCode: 500, apiMessage: 'db error logging in', ...err });
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        next({ apiCode: 400, apiMessage: 'Error logging out', ...err });
      } else {
        res.send('Goodbye & thanks for playing!');
      }
    });
  } else {
    res.send('Already logged out!');
  }
});

function generateToken(user) {
  // added

  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role,
  };

  const options = {
    // added
    expiresIn: '1d',
  };

  const token = jwt.sign(payload, secret, options); // added

  return token;
}

module.exports = router;
