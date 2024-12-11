const express = require('express')
const { postPredict, getDataPredict, deleteData, getData } = require('../controller/controller')

const router = express.Router();

router.post('/', postPredict);
router.get('/histories/:id_user', getDataPredict);
router.get('/:id', getData);
router.delete('/:id', deleteData);

module.exports = router