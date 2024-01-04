const express = require('express');
const router = express.Router();
const { dashboardStatistic } = require('../controllers/statisticController')
const { requireAuth, requireLawyerAndAdmin, requireAdmin } = require('../middlewares/authMiddleware')

router.get('/dashboard', requireAuth, requireAdmin, dashboardStatistic)

module.exports = router;