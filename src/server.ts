import express, { Application } from 'express';
import productRoutes from './routes/index.js'; // Lo activaremos en el siguiente paso

class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    private middlewares() {
        // Obligatorio: procesar JSON antes de las rutas
        this.app.use(express.json());
    }

    private routes() {
        this.app.use('/api/v1/products', productRoutes); // <- Línea descomentada
        
        this.app.get('/api/v1/ping', (req, res) => {
            res.json({ message: 'API funcionando y conectada' });
        });
    }

    public listen() {
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    }
}

export default Server;