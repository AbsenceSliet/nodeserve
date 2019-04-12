'use strict';

import express from 'express';
import Admin from '../controller/admin/admin'
const router = express.Router()

router.post('/login', Admin.login)
router.get('/getuserinfo', Admin.getAdminInfo)
router.post('/auth/upload/avatar/:admin_id', Admin.uploadImage)

export default router