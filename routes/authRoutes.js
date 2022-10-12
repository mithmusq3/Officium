const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth , checkUser } = require('../middleware/authMiddleware');



const router = Router();


// router.use('/',checkUser);
// router.use('/signup',checkUser);

    
router.get('/',checkUser,authController.login_get);
router.get('/signup',checkUser,authController.signup_get);
router.post('/signup',authController.signup_post);
router.post('/',authController.login_post);
router.get('/admin',authController.adm_login_get);
router.post('/admin',authController.adm_login_post);
router.get('/adminsign',authController.adm_signup_get);
router.post('/adminsign',authController.adm_signup_post);

router.get('/logout',authController.logout_get);
router.get('/logoutadmin',authController.logoutadmin_get);

module.exports = router;