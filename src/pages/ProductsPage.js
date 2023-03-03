import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// @mui
import { Button, Container, Stack, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import Iconify from '../components/iconify/Iconify';
import { getAllProducts } from '../api/productsApi';
import { setProducts } from '../redux/slicers/ProductsSilce';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const handleRouteTo = (path) => {
    navigate(path);
  };
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const pathName = window.location.pathname.split('/')[2];
  const path = pathName.charAt(0).toUpperCase() + pathName.slice(1);
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    const res = await getAllProducts();
    dispatch(setProducts(res.data))
    console.log(res.data, 'data');
  };
  const { products } = useSelector((state) => state.products);
  console.log(products);

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {path}
          </Typography>
          
          <Button
            onClick={() => handleRouteTo(`create-${pathName}`)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create {pathName}
          </Button>
        </Stack>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={products} />
        {/* <ProductCartWidget /> */}
      </Container>
    </>
  );
}
