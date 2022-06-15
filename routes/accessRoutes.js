const { Router } = require('express');
const accessController = require('../controllers/accessController');
const { requireAuth , checkUser } = require('../middleware/authMiddleware');
const { requireadminAuth , checkAdmin} = require('../middleware/adminauthMiddleware');


const router = Router();

router.get('/newoffer', requireAuth, checkAdmin, accessController.newoffer_get);
router.get('/dashboard', requireAuth, checkUser, accessController.dashboard_get);
router.get('/adminpage',requireadminAuth, checkAdmin ,accessController.adminpage_get);
router.get('/:id', requireAuth, checkAdmin, accessController.descrip_get);


router.post('/newoffer',accessController.newoffer_post);

module.exports = router;