const express = require('express');
const   router = express.Router();  
const { getReqPosts, getProjectListByNim, loginMahasiswa, registerMahasiswa } = require("../controllers/controller");

router.get('/reqpost', getReqPosts);
router.get('/project/:nim', getProjectListByNim);
router.post('/loginMahasiswa', loginMahasiswa);
router.post('/registerMahasiswa', registerMahasiswa);

module.exports = router;