function auth(req, res, next) {
  if(req.session.nome != undefined) {
    return next();
  }
  else {
    res.redirect('/login');
  }
}

module.exports = auth;