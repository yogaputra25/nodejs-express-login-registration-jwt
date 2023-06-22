const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/userprofile.controller");
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
  
  
  
  app.post("/api/profile/user",authJwt.verifyToken,[
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted
  ], controller.addProfile);
 
};
