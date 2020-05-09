export function LoginMiddleware(req, res, next) {
  req.body.username = req.body.email;
  if (req.body.password === undefined) {
    req.body.password = ' ';
  }
  next();
}
