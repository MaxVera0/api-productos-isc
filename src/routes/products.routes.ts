import { Router } from 'express';
import { getAll, getById, create, update, deleteProduct, changePrice } from '../controllers/products.controller.js';

const router = Router();

router.get('/getAll', getAll);
router.get('/getById/:id', getById);
router.post('/create', create);
router.put('/update/:id', update);
router.delete('/delete/:id', deleteProduct);
router.patch('/change-price/:id', changePrice);

export default router;