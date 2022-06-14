const { Router } = require('express');
const accessController = require('../controllers/accessController');
const { requireAuth , checkUser } = require('../middleware/authMiddleware');
const { requireadminAuth , checkAdmin} = require('../middleware/adminauthMiddleware');


const router = Router();

router.get('/dashboard', requireAuth, checkUser, accessController.dashboard_get);
router.get('/adminpage',requireadminAuth, checkAdmin ,accessController.adminpage_get);
router.get('/descrip', requireAuth, accessController.descrip_get);
router.get('/newoffer',accessController.newoffer_get)

module.exports = router;