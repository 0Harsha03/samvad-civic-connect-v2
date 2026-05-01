const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use DATABASE_URL if available, otherwise fallback to SQLite for local development
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '../../database.sqlite'),
      logging: false
    });

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Submitted'
  },
  photoUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.JSON,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  staffComment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assignedStaffId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['status'] }
  ]
});

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, Report, initDB };
