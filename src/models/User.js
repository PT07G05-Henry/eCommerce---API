const { DataTypes } = require("sequelize");
const createHash = require("../../createHash")
// Exportamos una función que define el modelo
// Luego le inyectamos la conexión a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0, 50],
            msg: "The First Name has too many characters",
          },
        },
        set(value) {
          this.setDataValue(
            "first_name",
            value
              .toLowerCase()
              .split(" ")
              .map((w) => w[0].toUpperCase() + w.slice(1))
              .join(" ")
          );
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0, 50],
            msg: "The Last Name has too many characters",
          },
        },
        set(value) {
          this.setDataValue(
            "last_name",    
            value
              .toLowerCase()
              .split(" ")
              .map((w) => w[0].toUpperCase() + w.slice(1))
              .join(" ") 
          );
        },
      },
      birth_date: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Does not contain the email format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value){
          this.setDataValue("password", createHash(value))
        }
      },
      profile_picture: {
        type: DataTypes.TEXT,
        defaultValue:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
    },
    {
      timestamps: false,
    }
  );
};
