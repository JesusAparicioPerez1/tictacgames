import { useEffect, useState } from 'react';
import api from '../services/api';

function Carrito() {
    const [carrito, setCarrito] = useState([]);
    const [mensaje, setMensaje] = useState('');

    // Cargar carrito
    useEffect(() => {
        const obtenerCarrito = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await api.get('/carrito', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            setCarrito(res.data.carrito);
        } catch (error) {
            console.error(error);
            setMensaje('Error al cargar el carrito');
        }
        };

        obtenerCarrito();
    }, []);

    // Confirmar pedido
    const confirmarPedido = async () => {
        try {
        const token = localStorage.getItem('token');

        const res = await api.post(
            '/carrito/confirmar',
            {},
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        setMensaje(`Pedido creado correctamente (ID: ${res.data.cod_pedido})`);
        setCarrito([]);
        } catch (error) {
        console.error(error);
        setMensaje(
            error.response?.data?.mensaje || 'Error al confirmar pedido'
        );
        }
    };

    return (
        <main>
        <h2>Carrito</h2>

        {mensaje && <p>{mensaje}</p>}

        {carrito.length === 0 ? (
            <p>El carrito está vacío</p>
        ) : (
            <div>
            {carrito.map((item) => (
                <div key={item.cod_producto}>
                <h3>{item.nombre_producto}</h3>
                <p>Cantidad: {item.cantidad}</p>
                <p>Precio unitario: {item.precio_unitario} €</p>
                </div>
            ))}

            {/* BOTÓN CLAVE */}
            <button onClick={confirmarPedido}>
                Confirmar pedido
            </button>
            </div>
        )}
        </main>
    );
}

export default Carrito;