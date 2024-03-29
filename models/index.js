const dbConfig = require("../config/dbConfig");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });



//   const { Sequelize, DataTypes } = require('sequelize');

  // Create an instance of Sequelize with your database credentials
//   const sequelize = new Sequelize('your_database', 'your_username', 'your_password', {
//     host: 'localhost',
//     dialect: 'postgres', // or any other dialect you're using
//   });
  
  // Define Sequelize models


  // ------------------------------------------------------CUSTOMER TYPE------------------------------------------------------------
  const CustomerType = sequelize.define('CustomerType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  // ------------------------------------------------------ CUSTOMER ------------------------------------------------------------
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['male', 'female']]
      }
    },
    email: DataTypes.STRING,
    contact: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        len: [10, 10]
      }
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pincode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        len: [6, 6]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    GSTIN: DataTypes.STRING,
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
  
  // ------------------------------------------------------ PRODUCT ------------------------------------------------------------
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  // ------------------------------------------------------ ORDER ------------------------------------------------------------
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    BillNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
    },
    TotalAmount: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'created',
      validate: {
        isIn: [['created', 'paid', 'shipped', 'delivered']]
      }
    }
  });
  
  // ------------------------------------------------------ SHIPPING ------------------------------------------------------------
  const Shipping = sequelize.define('Shipping', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    LogisticName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ShippingDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    TrackingNo: DataTypes.STRING
  });
  
  
  
  
  // ------------------------------------------------------ ORDER DETAIL ------------------------------------------------------------
  
  const OrderDetail = sequelize.define('OrderDetail', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rate: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    gst: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      defaultValue: 0 // Adding default value 0
    }
  });
  


  // ------------------------------------------------------ TRANSACTION ------------------------------------------------------------

  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    remark: {
      type: DataTypes.STRING,
    },
    Amount: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    TransactionDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  const ShippingPreferences = sequelize.define('ShippingPreferences', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    LogisticName: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
  



  // ------------------------------------------------------ MAPPING ------------------------------------------------------------

  // Define Relationships
  CustomerType.hasMany(Customer, { foreignKey: 'typeid' });
  Customer.belongsTo(CustomerType, { foreignKey: 'typeid' });
  
  Customer.hasMany(Order, { foreignKey: 'customerId' });
  Order.belongsTo(Customer, { foreignKey: 'customerId' });
  
  Order.hasMany(OrderDetail, { foreignKey: 'orderid' });
  OrderDetail.belongsTo(Order, { foreignKey: 'orderid' });
  
  Shipping.hasMany(Order, { foreignKey: 'shippingID' });
  Order.belongsTo(Shipping, { foreignKey: 'shippingID' });
  
  Order.hasMany(Transaction, { foreignKey: 'orderId' });
  Transaction.belongsTo(Order, { foreignKey: 'orderId' });

  Customer.hasMany(Transaction, { foreignKey: 'customerId' });
  Transaction.belongsTo(Customer, { foreignKey: 'customerId' });
  
  Product.hasMany(OrderDetail, { foreignKey: 'pid' });
  OrderDetail.belongsTo(Product, { foreignKey: 'pid' });

  Customer.hasMany(ShippingPreferences, {foreignKey : 'customerId'});
  ShippingPreferences.belongsTo(Customer, {foreignKey : 'customerId'});
  




  // ------------------------------------------------------ SYNCING THE MODELS ------------------------------------------------------------

  // sequelize.drop().then(() => {
  //   console.log('All tables dropped!');
  // }).catch((error) => {
  //   console.error('Error dropping tables:', error);
  // });
  // Sync all defined models to the database
  sequelize.sync()
    .then(() => {
      console.log('All models were synchronized successfully.');
    })
    .catch(err => {
      console.error('An error occurred while synchronizing the models:', err);
    });
  
//     sequelize.sync({ force: false }).then(() => {
//     console.log("re-synce done");
  
  
//   });


  // ------------------------------------------------------ EXPORTING THE MODELS ------------------------------------------------------------

  module.exports = {
    CustomerType,
    Customer,
    Product,
    Order,
    Shipping,
    OrderDetail,
    Transaction,
    ShippingPreferences,
    sequelize // In case you need the Sequelize instance elsewhere
  };
  



  
  