module.exports = (req, res, next) => {
  console.log("IS this Request Authenticated ? "+req.isAuthenticated())
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}
