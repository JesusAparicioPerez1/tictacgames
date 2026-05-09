// Importación de herramientas de enrutado de React
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout principal
import MainLayout from './layouts/MainLayout';

// Páginas de la aplicación
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import MisPedidos from './pages/MisPedidos';
import Admin from './pages/Admin';
import Vendedor from './pages/Vendedor';

// Rutas protegidas
import RutaPrivada from './routes/RutaPrivada';
import RutaAdmin from './routes/RutaAdmin';
import RutaVendedor from './routes/RutaVendedor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/tienda" element={<Tienda />} />

          <Route
            path="/producto/:id"
            element={<ProductoDetalle />}
          />

          <Route
            path="/carrito"
            element={
              <RutaPrivada>
                <Carrito />
              </RutaPrivada>
            }
          />

          <Route
            path="/mis-pedidos"
            element={
              <RutaPrivada>
                <MisPedidos />
              </RutaPrivada>
            }
          />

          <Route
            path="/admin"
            element={
              <RutaAdmin>
                <Admin />
              </RutaAdmin>
            }
          />

          <Route
            path="/vendedor"
            element={
              <RutaVendedor>
                <Vendedor />
              </RutaVendedor>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;