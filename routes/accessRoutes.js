const { Router } = require('express');
const accessController = require('../controllers/accessController');
const { requireAuth , checkUser } = require('../middleware/authMiddleware');
const { requireadminAuth , checkAdmin} = require('../middleware/adminauthMiddleware');


const router = Router();

router.get('/newoffer', requireadminAuth, checkAdmin, accessController.newoffer_get);
router.get('/dashboard', requireAuth, checkUser, accessController.dashboard_get);
router.get('/adminpage',requireadminAuth, checkAdmin ,accessController.adminpage_get);
router.get('/:id', requireadminAuth, checkAdmin, accessController.descrip_get);
router.delete('/:id', requireadminAuth, checkAdmin, accessController.descrip_delete);

router.get('/user/:id', requireAuth, checkUser, accessController.userdescrip_get);
router.post('/user/:id', requireAuth, checkUser, accessController.userdescrip_post);

router.post('/newoffer',accessController.newoffer_post);

module.exports = router;