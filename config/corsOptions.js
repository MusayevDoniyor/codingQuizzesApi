const allowedOrigins = ["http://localhost:3000", "http://192.168.119.208:3000"];

module.exports = {
  origin: function (origin, cb) {
    if (!origin || !allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
