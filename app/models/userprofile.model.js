module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("userprofile", {
      fullname: {
        type: Sequelize.STRING
      },
      gendre: {
        type: Sequelize.STRING
      },
      about: {
        type: Sequelize.STRING
      },
      birth: {
        type: Sequelize.DATE
      },
      age: {
        type: Sequelize.INTEGER
      },
      work: {
        type: Sequelize.STRING
      },
      study: {
        type: Sequelize.STRING
      }
    });
  
    return Profile;
  };