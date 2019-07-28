    
const IS_DEV = process.env.NODE_ENV !== 'production';

// server
const SERVER_PORT = process.env.PORT || 3001;
const WEBPACK_PORT = 8086; // For dev environment only
const MONGODB_STR = process.env.MONGODB_STR || "mongodb://localhost/test";

export {
  IS_DEV,
  MONGODB_STR,
  SERVER_PORT,
  WEBPACK_PORT,
};