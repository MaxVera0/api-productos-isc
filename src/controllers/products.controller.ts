import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../conf/dbConnection.js';

export const getAll = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE active = TRUE');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error interno en la base de datos' });
    }
};

export const getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'El ID debe ser un entero positivo' });

    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ? AND active = TRUE', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
        
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error interno en la base de datos' });
    }
};

export const create = async (req: Request, res: Response) => {
    const { name, price, stock, description, brand, img } = req.body;
    if (Number(price) <= 0 || isNaN(Number(price))) return res.status(400).json({ error: 'El precio debe ser numérico y mayor a cero' });

    try {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO products (name, price, stock, description, brand, img) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, stock, description, brand || null, img || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno en la base de datos' });
    }
};

export const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'El ID debe ser un entero positivo' });
    
    const { name, price, stock, description, brand, img } = req.body;
    if (Number(price) <= 0 || isNaN(Number(price))) return res.status(400).json({ error: 'El precio debe ser numérico y mayor a cero' });

    try {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE',
            [name, price, stock, description, brand || null, img || null, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
        
        res.status(200).json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno en la base de datos' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'El ID debe ser un entero positivo' });

    try {
        const [result] = await pool.query<ResultSetHeader>('UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado o ya inactivo' });
        
        res.status(200).json({ message: 'Producto dado de baja lógicamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno en la base de datos' });
    }
};

export const changePrice = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'El ID debe ser un entero positivo' });

    const { price } = req.body;
    if (Number(price) <= 0 || isNaN(Number(price))) return res.status(400).json({ error: 'El precio debe ser numérico y mayor a cero' });

    try {
        const [result] = await pool.query<ResultSetHeader>('UPDATE products SET price = ? WHERE id = ? AND active = TRUE', [price, id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
        
        res.status(200).json({ message: 'Precio modificado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno en la base de datos' });
    }
};