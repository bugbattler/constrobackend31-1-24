const express =require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router(); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport')
require('dotenv').config();
const cors=require('cors');
const checkAuth = require('./src/middleware/check-auth');

app.use(cors({
    origin: '*'
}));

app.use(bodyParser.json({ limit: '50mb', extended: true })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(passport.initialize());

const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
app.use(busboy({limits:{files: 10, fileSize: 20480,highWaterMark: 20 * 1024 * 1024}})); //-------------Settting size here
app.use(busboyBodyParser());

const PORT = process.env.PORT;
const DBName = process.env.DBName;
const DBUser = process.env.DBUser;
const DBPassword = process.env.DBPassword;


const connectionStr=`mongodb+srv://${DBUser}:${DBPassword}@realestatecluster.pzyq3.mongodb.net/${DBName}?retryWrites=true&w=majority`
mongoose.connect(connectionStr, { useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    if (err)
        console.log('Not connected to the database: ' + err);
    else
        console.log('Successfully connected to MongoDB..'); 

});

// Routes

// const roleRoutes = require('./src/routes/role.routes')(router)
// app.use('/api/role',roleRoutes);

// const policyRoutes = require('./src/routes/policies.routes')(router)
// app.use('/api/policy',policyRoutes);

// const adminUserRoutes = require('./src/routes/admin-user.routes')(router)
// app.use('/api/user',adminUserRoutes);

// const stateRoutes = require('./src/routes/basic_routes/state_api')(router)
// app.use('/api/state',checkAuth, stateRoutes)

// const cityRoutes = require('./src/routes/basic_routes/city_api')(router)
// app.use('/api/city',checkAuth, cityRoutes);

// const commonRoutes = require('./src/routes/basic_routes/common_api_routes')(router)
// app.use('/api/common', commonRoutes);

// const providerCategoryRoutes = require('./src/routes/service_provider_routes/service_provider_category_routes')(router)
// app.use('/api/category', providerCategoryRoutes);

// const providerExpertiseRoutes = require('./src/routes/service_provider_routes/service_provider_expertise_routes')(router)
// app.use('/api/expertise', providerExpertiseRoutes);

// const providerRoutes = require('./src/routes/service_provider_routes/service_provider_routes')(router)
// app.use('/api/provider' , providerRoutes);

// const clientRequestRoutes = require('./src/routes/service_provider_routes/client_request_routes')(router)
// app.use('/api/provider',clientRequestRoutes)

// const receiverRoutes = require('./src/routes/service_receiver_routes/service_receiver.routes')(router)
// app.use('/api/receiver',receiverRoutes)

// const vendorRequestRoutes = require('./src/routes/service_receiver_routes/vendor_bank_req.routes')(router)
// app.use('/api/receiver',vendorRequestRoutes)

// const vendorBankRoutes = require('./src/routes/service_receiver_routes/vendor_bank.routes')(router)
// app.use('/api/receiver',vendorBankRoutes)

// const service_provider_admin = require('./src/routes/Reports/serviceProviderReport.routes')(router)
// app.use("/api/service_provider_admin",service_provider_admin);

// const service_receiver_admin = require('./src/routes/Reports/serviceReceiverReport.routes')(router)
// app.use("/api/service_receiver_admin",service_receiver_admin);

// const tender_routes = require('./src/routes/tender/tender_registration.routes')(router)
// app.use("/api/tender",tender_routes);

// const tender_application_routes = require('./src/routes/tender/tender_application_routes')(router)
// app.use("/api/tender",tender_application_routes);

// const project_routes = require('./src/routes/service_receiver_routes/project_registartion.routes')(router)
// app.use("/api/project",project_routes);

// const razorpay_routes = require('./src/routes/basic_routes/razorpay_order')(router)
// app.use("/api/razorpay", razorpay_routes);




const roleRoutes = require('./src/routes/role.routes')(router)
app.use('/api',roleRoutes);

const policyRoutes = require('./src/routes/policies.routes')(router)
app.use('/api',policyRoutes);

const adminUserRoutes = require('./src/routes/admin-user.routes')(router)
app.use('/api',adminUserRoutes);

const stateRoutes = require('./src/routes/basic_routes/state_api')(router)
app.use('/api',checkAuth, stateRoutes)

const cityRoutes = require('./src/routes/basic_routes/city_api')(router)
app.use('/api',checkAuth, cityRoutes);

const commonRoutes = require('./src/routes/basic_routes/common_api_routes')(router)
app.use('/api', commonRoutes);

const providerCategoryRoutes = require('./src/routes/service_provider_routes/service_provider_category_routes')(router)
app.use('/api', providerCategoryRoutes);

const providerExpertiseRoutes = require('./src/routes/service_provider_routes/service_provider_expertise_routes')(router)
app.use('/api', providerExpertiseRoutes);

const providerRoutes = require('./src/routes/service_provider_routes/service_provider_routes')(router)
app.use('/api' , providerRoutes);

const clientRequestRoutes = require('./src/routes/service_provider_routes/client_request_routes')(router)
app.use('/api',clientRequestRoutes)

const receiverRoutes = require('./src/routes/service_receiver_routes/service_receiver.routes')(router)
app.use('/api',receiverRoutes)

const vendorRequestRoutes = require('./src/routes/service_receiver_routes/vendor_bank_req.routes')(router)
app.use('/api',vendorRequestRoutes)

const vendorBankRoutes = require('./src/routes/service_receiver_routes/vendor_bank.routes')(router)
app.use('/api',vendorBankRoutes)

const service_provider_admin = require('./src/routes/Reports/serviceProviderReport.routes')(router)
app.use("/api",service_provider_admin);

const service_receiver_admin = require('./src/routes/Reports/serviceReceiverReport.routes')(router)
app.use("/api",service_receiver_admin);

const tender_routes = require('./src/routes/tender/tender_registration.routes')(router)
app.use("/api",tender_routes);

const tender_application_routes = require('./src/routes/tender/tender_application_routes')(router)
app.use("/api",tender_application_routes);

const project_routes = require('./src/routes/service_receiver_routes/project_registartion.routes')(router)
app.use("/api",project_routes);

const razorpay_routes = require('./src/routes/basic_routes/razorpay_order')(router)
app.use("/api", razorpay_routes);

app.get("/", (req, res) => {
    return res.send("Welcome To API");
  });
app.listen(PORT, function () {
    console.log(`Running the server on port ${PORT} `); 
});