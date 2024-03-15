const express = require('express');
import userRoute from "./user.routes";
const router = express.Router();

const defaultRoutes = [
    {
        path: '/admin',
        route: userRoute
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;