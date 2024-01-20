const { Router } = require('express');
const sadminController = require('../controllers/sadminController.js');
const { requiresuperAuth } = require('../middleware/authsadminMiddleware');

const router = Router();



router.get('/sadmin',sadminController.sadmin_login_get);
router.get('/sadmindash',requiresuperAuth,sadminController.sadmin_get);
router.get('/listuser',requiresuperAuth,sadminController.listuser_get);
router.get('/listadmin',requiresuperAuth,sadminController.listadmin_get);
router.get('/listcompany',requiresuperAuth,sadminController.listcompany_get);
router.get('/company/:id',requiresuperAuth,sadminController.company_get);
router.get('/sadminlogout',sadminController.sadmin_logout_get);


router.post('/sadmin',sadminController.sadmin_login_post);
module.exports = router;