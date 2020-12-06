const router = require('express').Router();
const users = require('../users/users-model.js');

router.post('/register', async (req, res) => {
  let user = req.body;

  try {
    const saved = await users.add(user);
    res.status(201).json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
