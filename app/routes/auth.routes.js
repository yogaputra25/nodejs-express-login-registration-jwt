const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");
const morgan = require('morgan');
// import { verifySignUp } from "../middleware/index.js";
// import controller from "../controllers/auth.controller.js" ;

module.exports = function(app) {
  app.use(morgan('dev'));
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  
  app.post("/api/auth/signin", controller.signin);
  app.get("/api/auth/getall", authJwt.verifyToken, controller.getall);

  app.post("/api/auth/signout", controller.signout);
};
