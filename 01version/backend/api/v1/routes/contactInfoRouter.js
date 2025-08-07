import express from 'express';
import * as contactInfoController from '../controllers/contactInfoController.js';

const router = express.Router();

router.post('/', contactInfoController.createContact);
router.get('/', contactInfoController.getContacts);

export default router;
