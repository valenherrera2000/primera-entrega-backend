const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '..', 'carrito.json');

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    const newCart = {
        id: generateCartId(),
        products: [],
    };

    try {
        fs.readFile(cartsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer carritos' });
            } else {
                const carts = JSON.parse(data);
                carts.push(newCart);
                fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Error al crear carrito' });
                    } else {
                        res.json(newCart);
                    }
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear carrito' });
    }
});

// Ruta para listar los productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const cid = req.params.cid;

    try {
        fs.readFile(cartsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer carritos' });
            } else {
                const carts = JSON.parse(data);
                const cart = carts.find((c) => c.id === cid);
                if (cart) {
                    res.json(cart.products);
                } else {
                    res.status(404).json({ error: 'Carrito no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos del carrito' });
    }
});

// Ruta para agregar un producto a un carrito por ID de carrito y ID de producto
router.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        fs.readFile(cartsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al leer carritos' });
            } else {
                const carts = JSON.parse(data);
                const cart = carts.find((c) => c.id === cid);
                if (cart) {
                    const existingProduct = cart.products.find((p) => p.id === pid);
                    if (existingProduct) {
                        // Si el producto ya existe, incrementa la cantidad
                        existingProduct.quantity += 1;
                    } else {
                        // Si el producto no existe en el carrito, agrégalo
                        cart.products.push({ id: pid, quantity: 1 });
                    }
                    fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), (err) => {
                        if (err) {
                            console.error(err);
                            res.status(500).json({ error: 'Error al agregar producto al carrito' });
                        } else {
                            res.json(cart.products);
                        }
                    });
                } else {
                    res.status(404).json({ error: 'Carrito no encontrado' });
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Función para generar un nuevo ID para carritos
function generateCartId() {
    const timestamp = new Date().getTime();
    return `cart-${timestamp}`;
}

module.exports = router;
