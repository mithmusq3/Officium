const { Router } = require('express');
const sadminController = require('../controllers/sadminController.js');
const { requireAuthId, requireadminAuth , checkAdmin} = require('../middleware/adminauthMiddleware');

const router = Router();



    
router.get('/sadmin',requireadminAuth,checkAdmin,sadminController.sadmin_get);
router.get('/listuser',requireadminAuth,checkAdmin,sadminController.listuser_get);
router.get('/listadmin',requireadminAuth,checkAdmin,sadminController.listadmin_get);

module.exports = router;