// import ProductoCard from '../components/ProductCard.jsx';
// import { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useCupon } from '../hooks/useCupon.js';
// import { useCarrito } from '../hooks/useCarrito.js';
// import api from '../api/axios';
// import {
//   Box,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   CardActions,
//   Chip,
//   Divider,
//   CircularProgress,
//   Alert,
//   Container,
// } from '@mui/material';
// import Rating from '@mui/material/Rating';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import LocalOfferIcon from '@mui/icons-material/LocalOffer';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const DetalleProducto = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [producto, setProducto] = useState(null);
//   const [productosRelacionados, setProductosRelacionados] = useState([]);
//   const [cantidad, setCantidad] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [mensajeCarrito, setMensajeCarrito] = useState('');
//   const [mensajes, setMensajes] = useState([]);
//   const [nuevoMensaje, setNuevoMensaje] = useState('');
//   const { agregarProducto } = useCarrito();
//   const { cupon } = useCupon();

//   const calcularPrecioConDescuento = (precio, descuento) => {
//     return (precio * (1 - descuento / 100)).toFixed(2);
//   };

//   const obtenerPrecioFinal = () => {
//     if (!producto) return 0;
//     if (cupon && cupon.porcentajeDescuento > 0) {
//       return parseFloat(
//         calcularPrecioConDescuento(producto.precio, cupon.porcentajeDescuento)
//       );
//     }
//     if (producto.descuento > 0) {
//       return parseFloat(
//         calcularPrecioConDescuento(producto.precio, producto.descuento)
//       );
//     }
//     return producto.precio;
//   };

//   const mostrarPrecio = () => {
//     if (!producto) return null;
//     const precioFinal = obtenerPrecioFinal();

//     if (cupon && cupon.porcentajeDescuento > 0) {
//       return (
//         <Box>
//           <Typography
//             variant='h6'
//             sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
//             ${producto.precio.toFixed(2)}
//           </Typography>
//           <Typography
//             variant='h4'
//             fontWeight='bold'
//             sx={{ color: '#2b7fff' }}>
//             ${precioFinal.toFixed(2)}
//             <Typography
//               component='span'
//               sx={{ color: 'green', fontSize: '0.8rem', ml: 1 }}>
//               ({cupon.porcentajeDescuento}% OFF cupón)
//             </Typography>
//           </Typography>
//         </Box>
//       );
//     }

//     if (producto.descuento > 0) {
//       return (
//         <Box>
//           <Typography
//             variant='h6'
//             sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
//             ${producto.precio.toFixed(2)}
//           </Typography>
//           <Typography
//             variant='h4'
//             fontWeight='bold'
//             sx={{ color: '#ff5722' }}>
//             ${precioFinal.toFixed(2)}
//             <Typography
//               component='span'
//               sx={{ color: 'green', fontSize: '0.8rem', ml: 1 }}>
//               ({producto.descuento}% OFF)
//             </Typography>
//           </Typography>
//         </Box>
//       );
//     }

//     return (
//       <Typography
//         variant='h4'
//         fontWeight='bold'
//         color='primary'>
//         ${precioFinal.toFixed(2)}
//       </Typography>
//     );
//   };

//   const aumentarCantidad = () => setCantidad((prev) => prev + 1);
//   const disminuirCantidad = () =>
//     setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

//   const agregarAlCarrito = () => {
//     const precioFinal = obtenerPrecioFinal();
//     const total = precioFinal * cantidad;
//     const productoParaCarrito = {
//       id: producto.id,
//       nombre: producto.nombre,
//       precio: precioFinal,
//     };

//     agregarProducto(productoParaCarrito, cantidad);
//     setMensajeCarrito(
//       `${cantidad} ${
//         producto.nombre
//       }(s) agregado(s) al carrito por $${total.toFixed(2)}`
//     );
//     setTimeout(() => setMensajeCarrito(''), 4000);
//   };

//   const fetchMensajes = useCallback(async () => {
//     try {
//       const res = await api.get(`/productos/${id}/mensajes`);
//       setMensajes(res.data);
//     } catch (error) {
//       console.error('Error al obtener mensajes:', error);
//     }
//   }, [id]);

//   const enviarMensaje = async () => {
//     if (!nuevoMensaje.trim()) return;
//     try {
//       await api.post(`/productos/${id}/mensajes`, { texto: nuevoMensaje });
//       await fetchMensajes();
//       setNuevoMensaje('');
//     } catch (error) {
//       console.error('Error al enviar mensaje:', error);
//     }
//   };

//   const handleRatingChange = (idProducto, nuevoRating) => {
//     setProductosRelacionados((prev) =>
//       prev.map((p) =>
//         p.id === idProducto ? { ...p, estrellas: nuevoRating } : p
//       )
//     );
//   };

//   useEffect(() => {
//     const fetchProducto = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const productoRes = await api.get(`/productos/${id}`);
//         const productoData = productoRes.data;
//         setProducto(productoData);
//         setRating(productoData.estrellas || 0);

//         try {
//           const relacionadosRes = await api.get(
//             `/productos/categoria/${productoData.idCategoria}`
//           );
//           const relacionados = relacionadosRes.data
//             .filter((p) => p.id !== parseInt(id))
//             .slice(0, 4);
//           setProductosRelacionados(relacionados);
//         } catch (err) {
//           console.error(err);
//           setProductosRelacionados([]);
//         }
//       } catch (err) {
//         console.error('Error al cargar producto:', err);
//         setError('Error al cargar el producto');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProducto();
//       fetchMensajes();
//     }
//   }, [id, fetchMensajes]);

//   if (loading) {
//     return (
//       <Box
//         display='flex'
//         justifyContent='center'
//         mt={4}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error || !producto) {
//     return (
//       <Container>
//         <Alert
//           severity='error'
//           sx={{ mt: 4 }}>
//           {error || 'Producto no encontrado'}
//         </Alert>
//         <Button
//           variant='outlined'
//           onClick={() => navigate(-1)}
//           sx={{ mt: 2 }}>
//           Volver
//         </Button>
//       </Container>
//     );
//   }

//   return (
//     <Container
//       maxWidth='lg'
//       sx={{ py: 4 }}>
//       <Button
//         startIcon={<ArrowBackIcon />}
//         onClick={() => navigate(-1)}
//         sx={{ mb: 3, color: '#666' }}>
//         Volver
//       </Button>

//       <Grid
//         container
//         spacing={4}
//         justifyContent='center'
//         alignItems='flex-start'>
//         <Grid
//           item
//           xs={12}
//           md={6}>
//           <Box
//             component='img'
//             src={producto.imagen}
//             alt={producto.nombre}
//             sx={{
//               width: '100%',
//               height: '300px',
//               objectFit: 'cover',
//               borderRadius: 2,
//               boxShadow: 3,
//             }}
//           />
//         </Grid>

//         <Grid
//           item
//           xs={12}
//           md={6}>
//           <Typography
//             variant='h5'
//             fontWeight='bold'
//             gutterBottom>
//             {producto.nombre}
//           </Typography>

//           <Typography
//             variant='body2'
//             color='text.secondary'
//             sx={{ mb: 1.5 }}>
//             {producto.descripcion}
//           </Typography>

//           {producto?.Categoria?.nombre && (
//             <Chip
//               label={producto.Categoria.nombre}
//               color='info'
//               sx={{ mb: 2 }}
//             />
//           )}

//           <Box sx={{ mb: 2 }}>{mostrarPrecio()}</Box>

//           <Divider sx={{ my: 2 }} />

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
//             <Typography
//               variant='body2'
//               fontWeight='bold'>
//               Cantidad:
//             </Typography>
//             <Button
//               onClick={disminuirCantidad}
//               disabled={cantidad <= 1}
//               variant='outlined'
//               size='small'>
//               <RemoveIcon />
//             </Button>
//             <Typography>{cantidad}</Typography>
//             <Button
//               onClick={aumentarCantidad}
//               variant='outlined'
//               size='small'>
//               <AddIcon />
//             </Button>
//           </Box>

//           <Typography
//             variant='h6'
//             fontWeight='bold'
//             sx={{ mb: 2 }}>
//             Total: ${(obtenerPrecioFinal() * cantidad).toFixed(2)}
//           </Typography>

//           <Button
//             variant='contained'
//             onClick={agregarAlCarrito}
//             startIcon={<ShoppingCartIcon />}
//             sx={{
//               backgroundColor: '#2b7fff',
//               '&:hover': { backgroundColor: '#1e5bb8' },
//             }}>
//             Agregar al Carrito
//           </Button>

//           {mensajeCarrito && (
//             <Typography
//               variant='body2'
//               sx={{ color: 'green', mt: 2 }}>
//               ✅ {mensajeCarrito}
//             </Typography>
//           )}
//         </Grid>
//       </Grid>

//       {/* Productos Relacionados */}
//       <Box sx={{ mt: 6 }}>
//         <Typography
//           variant='h5'
//           fontWeight='bold'
//           gutterBottom>
//           Productos Relacionados
//         </Typography>

//         <Grid
//           container
//           spacing={3}>
//           {productosRelacionados.map((rel) => (
//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={3}
//               key={rel.id}>
//               <ProductoCard
//                 producto={rel}
//                 rating={rating[rel.id]}
//                 onRatingChange={handleRatingChange}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* Mensajes del producto */}
//       <Box sx={{ mt: 6 }}>
//         <Typography
//           variant='h5'
//           fontWeight='bold'
//           gutterBottom>
//           Mensajes del producto
//         </Typography>

//         {mensajes.length === 0 ? (
//           <Typography
//             variant='body2'
//             color='text.secondary'>
//             Aún no hay mensajes para este producto.
//           </Typography>
//         ) : (
//           <ul style={{ paddingLeft: '1rem', marginBottom: '1.5rem' }}>
//             {mensajes.map((msg) => (
//               <li key={msg.id}>{msg.texto}</li>
//             ))}
//           </ul>
//         )}

//         <Typography
//           variant='subtitle1'
//           fontWeight='bold'
//           gutterBottom>
//           Agregar nuevo mensaje
//         </Typography>
//         <textarea
//           value={nuevoMensaje}
//           onChange={(e) => setNuevoMensaje(e.target.value)}
//           placeholder='Escribí tu mensaje...'
//           rows={4}
//           style={{
//             width: '100%',
//             padding: '0.8rem',
//             border: '1px solid #ccc',
//             borderRadius: '8px',
//             resize: 'vertical',
//             marginBottom: '1rem',
//           }}
//         />
//         <Button
//           variant='contained'
//           onClick={enviarMensaje}
//           sx={{
//             backgroundColor: '#2b7fff',
//             fontWeight: 'bold',
//             '&:hover': { backgroundColor: '#1e5bb8' },
//           }}>
//           Enviar Mensaje
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default DetalleProducto;

import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCupon } from '../hooks/useCupon.js';
import { useCarrito } from '../hooks/useCarrito.js';
import api from '../api/axios';
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductCard from '../components/ProductCard.jsx';
import FormPersonalizacion from '../components/FormPersonalizacion.jsx';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();
  const { cupon } = useCupon();
  const [openModal, setOpenModal] = useState(false);
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [mensajeCarrito, setMensajeCarrito] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  console.log(rating);

  const calcularPrecioConDescuento = (precio, descuento) =>
    parseFloat((precio * (1 - descuento / 100)).toFixed(2));

  const obtenerPrecioFinal = () => {
    if (!producto) return 0;
    if (cupon?.porcentajeDescuento > 0)
      return calcularPrecioConDescuento(
        producto.precio,
        cupon.porcentajeDescuento
      );
    if (producto.descuento > 0)
      return calcularPrecioConDescuento(producto.precio, producto.descuento);
    return producto.precio;
  };

  const aumentarCantidad = () => setCantidad((prev) => prev + 1);
  const disminuirCantidad = () =>
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

  const agregarAlCarrito = () => {
    const precioFinal = obtenerPrecioFinal();
    const total = precioFinal * cantidad;
    agregarProducto(
      { id: producto.id, nombre: producto.nombre, precio: precioFinal },
      cantidad
    );
    setMensajeCarrito(
      `${cantidad} ${
        producto.nombre
      }(s) agregado(s) al carrito por $${total.toFixed(2)}`
    );
    setTimeout(() => setMensajeCarrito(''), 4000);
  };

  const fetchMensajes = useCallback(async () => {
    try {
      const res = await api.get(`/productos/${id}/mensajes`);
      setMensajes(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;
    try {
      await api.post(`/productos/${id}/mensajes`, { texto: nuevoMensaje });
      await fetchMensajes();
      setNuevoMensaje('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingChange = (idProducto, nuevoRating) => {
    setProductosRelacionados((prev) =>
      prev.map((p) =>
        p.id === idProducto ? { ...p, estrellas: nuevoRating } : p
      )
    );
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        // Producto
        const { data: productoRes } = await api.get(`/productos/${id}`);
        setProducto(productoRes.data);
        setRating(productoRes.data.estrellas || 0);

        // Relacionados
        try {
          const relacionadosRes = await api.get(
            `/productos/categoria/${productoRes.data.idCategoria}`
          );

          // Accedemos a data de forma segura
          const relacionadosArray =
            relacionadosRes?.data?.data || relacionadosRes?.data || [];

          const relacionados = relacionadosArray
            .filter((p) => p.id !== parseInt(id))
            .slice(0, 4);

          setProductosRelacionados(relacionados);
        } catch (err) {
          console.error('Error al cargar productos relacionados:', err);
          setProductosRelacionados([]);
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
    fetchMensajes();
  }, [id, fetchMensajes]);

  if (loading)
    return (
      <Box
        display='flex'
        justifyContent='center'
        mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error || !producto)
    return (
      <Container>
        <Alert
          severity='error'
          sx={{ mt: 4 }}>
          {error || 'Producto no encontrado'}
        </Alert>
        <Button
          variant='outlined'
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}>
          Volver
        </Button>
      </Container>
    );

  return (
    <Container
      maxWidth='lg'
      sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: '#666' }}>
        Volver
      </Button>

      <Grid
        container
        spacing={4}
        justifyContent='center'
        alignItems='flex-start'>
        <Grid
          item
          xs={12}
          md={6}>
          <Box
            component='img'
            src={producto.imagen}
            alt={producto.nombre}
            sx={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={6}>
          <Typography
            variant='h5'
            fontWeight='bold'
            gutterBottom>
            {producto.nombre}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 1.5 }}>
            {producto.descripcion}
          </Typography>
          {producto?.Categoria?.nombre && (
            <Chip
              label={producto.Categoria.nombre}
              color='info'
              sx={{ mb: 2 }}
            />
          )}

          <Box sx={{ mb: 2 }}>
            <Typography
              variant='h6'
              sx={{
                textDecoration:
                  producto.descuento > 0 ? 'line-through' : 'none',
                color: 'text.secondary',
              }}>
              ${producto.precio.toFixed(2)}
            </Typography>
            <Typography
              variant='h4'
              fontWeight='bold'
              sx={{ color: cupon ? '#2b7fff' : '#ff5722' }}>
              ${obtenerPrecioFinal().toFixed(2)}
              {cupon
                ? ` (${cupon.porcentajeDescuento}% OFF cupón)`
                : producto.descuento > 0
                ? ` (${producto.descuento}% OFF)`
                : ''}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Typography
              variant='body2'
              fontWeight='bold'>
              Cantidad:
            </Typography>
            <Button
              onClick={disminuirCantidad}
              disabled={cantidad <= 1}
              variant='outlined'
              size='small'>
              <RemoveIcon />
            </Button>
            <Typography>{cantidad}</Typography>
            <Button
              onClick={aumentarCantidad}
              variant='outlined'
              size='small'>
              <AddIcon />
            </Button>
          </Box>

          <Typography
            variant='h6'
            fontWeight='bold'
            sx={{ mb: 2 }}>
            Total: ${(obtenerPrecioFinal() * cantidad).toFixed(2)}
          </Typography>

          {producto.esPersonalizable ? (
            <>
              <Button
                variant='contained'
                onClick={() => setOpenModal(true)}
                sx={{
                  mt: 2,
                  backgroundColor: '#2b7fff',
                  '&:hover': { backgroundColor: '#1e5bb8' },
                }}>
                Personalizar Producto
              </Button>

              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ mt: 1 }}>
                Debes completar el formulario para poder agregar el producto al
                carrito.
              </Typography>

              <FormPersonalizacion
                open={openModal}
                onClose={() => setOpenModal(false)}
                product={producto}
                onSubmit={async (customData) => {
                  // customData = { nombreCliente, telefonoCliente, comentarios, archivos }
                  agregarProducto({ ...producto, customData }, cantidad);
                  setOpenModal(false);
                  setMensajeCarrito(
                    `${cantidad} ${producto.nombre}(s) agregado(s) al carrito`
                  );
                  setTimeout(() => setMensajeCarrito(''), 4000);
                }}
              />
            </>
          ) : (
            <Button
              variant='contained'
              onClick={agregarAlCarrito}
              startIcon={<ShoppingCartIcon />}
              sx={{
                mt: 2,
                backgroundColor: '#2b7fff',
                '&:hover': { backgroundColor: '#1e5bb8' },
              }}>
              Agregar al Carrito
            </Button>
          )}

          {mensajeCarrito && (
            <Typography
              variant='body2'
              sx={{ color: 'green', mt: 2 }}>
              ✅ {mensajeCarrito}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Productos Relacionados */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant='h5'
          fontWeight='bold'
          gutterBottom>
          Productos Relacionados
        </Typography>
        <Grid
          container
          spacing={3}>
          {productosRelacionados.map((rel) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={rel.id}>
              <ProductCard
                producto={rel}
                rating={rel.estrellas}
                onRatingChange={handleRatingChange}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mensajes del producto */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant='h5'
          fontWeight='bold'
          gutterBottom>
          Mensajes del producto
        </Typography>
        {mensajes.length === 0 ? (
          <Typography
            variant='body2'
            color='text.secondary'>
            Aún no hay mensajes para este producto.
          </Typography>
        ) : (
          <ul style={{ paddingLeft: '1rem', marginBottom: '1.5rem' }}>
            {mensajes.map((msg) => (
              <li key={msg.id}>{msg.texto}</li>
            ))}
          </ul>
        )}

        <Typography
          variant='subtitle1'
          fontWeight='bold'
          gutterBottom>
          Agregar nuevo mensaje
        </Typography>
        <textarea
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder='Escribí tu mensaje...'
          rows={4}
          style={{
            width: '100%',
            padding: '0.8rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            resize: 'vertical',
            marginBottom: '1rem',
          }}
        />
        <Button
          variant='contained'
          onClick={enviarMensaje}
          sx={{
            backgroundColor: '#2b7fff',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#1e5bb8' },
          }}>
          Enviar Mensaje
        </Button>
      </Box>
    </Container>
  );
};

export default DetalleProducto;
