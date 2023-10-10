const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'productos.json');

// Ruta raíz para listar productos con límite opcional
router.get('/', (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        fs.readFile(productsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer productos' });
            } else {
                let products = JSON.parse(data);
                if (limit) {
                    products = products.slice(0, limit);
                }
                res.json(products);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al listar productos' });
    }
});

// Ruta para obtener un producto por ID
router.get('/:pid', (req, res) => {
    const pid = req.params.pid;
    try {
        fs.readFile(productsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer productos' });
            } else {
                const products = JSON.parse(data);
                const product = products.find((p) => p.id === pid);
                if (product) {
                    res.json(product);
                } else {
                    res.status(404).json({ error: 'Producto no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener producto por ID' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    const newProduct = req.body;
    try {
        fs.readFile(productsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer productos' });
            } else {
                const products = JSON.parse(data);
                newProduct.id = generateProductId(products);
                products.push(newProduct);
                fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Error al agregar producto' });
                    } else {
                        res.json(newProduct);
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});

// Ruta para actualizar un producto por ID
router.put('/:pid', (req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    try {
        fs.readFile(productsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer productos' });
            } else {
                const products = JSON.parse(data);
                const index = products.findIndex((p) => p.id === pid);
                if (index !== -1) {
                    products[index] = { ...products[index], ...updatedProduct, id: pid };
                    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
                        if (err) {
                            console.error(err);
                            res.status(500).json({ error: 'Error al actualizar producto' });
                        } else {
                            res.json(products[index]);
                        }
                    });
                } else {
                    res.status(404).json({ error: 'Producto no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

// Ruta para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const pid = req.params.pid;
    try {
        fs.readFile(productsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer productos' });
            } else {
                const products = JSON.parse(data);
                const index = products.findIndex((p) => p.id === pid);
                if (index !== -1) {
                    products.splice(index, 1);
                    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
                        if (err) {
                            console.error(err);
                            res.status(500).json({ error: 'Error al eliminar producto' });
                        } else {
                            res.json({ message: 'Producto eliminado con éxito' });
                        }
                    });
                } else {
                    res.status(404).json({ error: 'Producto no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

// Función para generar un nuevo ID para productos
function generateProductId(products) {
    const ids = products.map((p) => parseInt(p.id));
    const maxId = Math.max(...ids);
    return (maxId + 1).toString();
}

module.exports = router;
