import { Router } from 'express';
import productRoutes from './products.routes.js';

const router = Router();

// Aquí inyectamos el agrupador sin el prefijo principal que pondremos en el servidor
router.use('/', productRoutes);

export default router;