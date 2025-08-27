import express from 'express';
import { createScreen, getScreensByCinema, getScreenDetails, updateScreen, deleteScreen } from '../controllers/screenController.js';
import { verifyAdmin } from '../middleware/adminAuth.js';


const router = express.Router({ mergeParams: true });


router.post('/:cinemaId', verifyAdmin, createScreen);
router.get('/', getScreensByCinema);
router.get('/:id', getScreenDetails);
router.put('/:id', verifyAdmin, updateScreen);
router.delete('/:id', verifyAdmin, deleteScreen);


export default router;