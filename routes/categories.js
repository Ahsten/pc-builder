const express = require('express')
const router = express.Router()

const category_controller = require('../controllers/category')

router.get('/', category_controller.category_list)

router.get('/category/:id', category_controller.part_list)

router.get('/part/:id', category_controller.part_detail)

module.exports = router;