const router = require('express').Router();
const { authMiddleware } = require('../auth');
const ctrl = require('../controllers/itemController');

router.use(authMiddleware);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.delete('/:id', ctrl.remove);

module.exports = router;
