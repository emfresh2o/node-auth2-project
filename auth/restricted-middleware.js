const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  console.log('auth header: ', req.headers.authorization);
  const token = req.headers.authorization ?
      req.headers.authorization.split(' ')[1] :
      '';
  console.log("token: ", token);

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'Invalid Credentials' });
      } else {
        req.decodedToken = decodedToken;
        next()
      }
    });

  } else {
    res.status(401).json({ message: 'Invalid Credentials' });
  }

};