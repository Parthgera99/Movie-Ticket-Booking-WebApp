import express from 'express';
import { createShow, getShowsByScreen, getShowDetails, updateShow, deleteShow } from '../controllers/showController.js';
import { verifyAdmin } from '../middleware/adminAuth.js';


const showRouter = express.Router({ mergeParams: true });


showRouter.post('/:screenId', verifyAdmin, createShow); // mounted under /screens/:screenId/shows
showRouter.get('/:screenId', getShowsByScreen);
showRouter.get('/details/:id', getShowDetails);
showRouter.put('/:id', verifyAdmin, updateShow);
showRouter.delete('/:id', verifyAdmin, deleteShow);


export default showRouter;