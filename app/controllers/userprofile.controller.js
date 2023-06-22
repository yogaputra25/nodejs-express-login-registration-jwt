const db = require("../models");
const config = require("../config/auth.config");
const responseHelper = require("../helpers/helper");
const Profile = db.profile;
const User = db.user;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.addProfile = async (req, res) => {
  // Save User to Database
  try {
    const user = await User.findAll({
      where: {
        id: req.body.userId,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    await User.update(
      { email: req.body.email,
        username: req.body.username,
    },
      {
        where: {
          id: req.body.userId,
        },
      }
    );
    let profile = await Profile.findOne({ where: { id: req.body.userId } });

    if (!profile) {
      profile = await Profile.create({
        id: req.body.userId,
        fullname: req.body.fullname,
        gendre: req.body.gendre,
        about: req.body.about,
        birth: req.body.birth,
        age: req.body.age,
        work: req.body.work,
        study: req.body.study,
      });
    }

    await Profile.update(
      {
        fullname: req.body.fullname,
        gendre: req.body.gendre,
        about: req.body.about,
        birth: req.body.birth,
        age: req.body.age,
        work: req.body.work,
        study: req.body.study,
      },
      {
        where: {
          id: req.body.userId,
        },
      }
    );
    const data = await User.findOne(
      
    //   {
    //     attributes: ['username', ],
    //   },
    //   {
    //     include: [Profile],
    //   },
      {
        where: {
          id: req.body.userId,
        },
        include: [Profile],
        attributes: ["username", "email"]
      }
      
    );

    return responseHelper.sendSuccessResponse(res, data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
    let data = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      token: token,
    };
    // return res.status(200).send({
    //   id: user.id,
    //   username: user.username,
    //   email: user.email,
    //   roles: authorities,
    //   token: token
    // });
    return responseHelper.sendSuccessResponse(res, data);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.getall = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: ["id", "username", "email"], // Hanya ambil atribut id dan username
    });
    return res.status(200).send(data);
  } catch (err) {
    this.next(err);
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!",
    });
  } catch (err) {
    this.next(err);
  }
};
