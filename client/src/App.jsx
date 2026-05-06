// Importación de herramientas de enrutado de React
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout principal (navbar + contenido)
import MainLayout from './layouts/MainLayout';

// Páginas de la aplicación
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Tienda from './pages/Tienda';
import Carrito from './pages/Carrito';
import Admin from './pages/Admin';
import Vendedor from './pages/Vendedor';
import MisPedidos from './pages/MisPedidos';
import ProductoDetalle from './pages/ProductoDetalle';

// Rutas protegidas
import RutaPrivada from './routes/RutaPrivada';
import RutaAdmin from './routes/RutaAdmin';
import RutaVendedor from './routes/RutaVendedor';

function App() {
  return (
    // BrowserRouter permite gestionar rutas sin recargar la página
    <BrowserRouter>
      <Routes>
        {/* 
          MainLayout envuelve todas las páginas.
          Incluye navbar y un <Outlet /> donde se renderiza cada vista.
        */}
        <Route element={<MainLayout />}>
          {/* Ruta principal */}
          <Route path="/" element={<Home />} />

          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Funcionalidades principales */}
          <Route path="/tienda" element={<Tienda />} />

          <Route
            path="/carrito"
            element={
              <RutaPrivada>
                <Carrito />
              </RutaPrivada>
            }
          />

          {/* Ruta protegida solo accesible por administradores */}
          <Route
            path="/admin"
            element={
              <RutaAdmin>
                <Admin />
              </RutaAdmin>
            }
          />

          {/* Ruta protegida para vendedores y administradores */}
          <Route
            path="/vendedor"
            element={
              <RutaVendedor>
                <Vendedor />
              </RutaVendedor>
            }
          />
          {/* Ruta protegida para usuarios registrados */}
          <Route
            path="/mis-pedidos"
            element={
              <RutaPrivada>
                <MisPedidos />
              </RutaPrivada>
            }
          />
          {/* Ruta producto detalle*/}
          <Route path="/producto/:id" element={<ProductoDetalle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;