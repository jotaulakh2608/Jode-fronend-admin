import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';
import { port } from '../../../constants/const';
import { deleteProduct, getAllProducts } from '../../../api/productsApi';
import { setProducts } from '../../../redux/slicers/ProductsSilce';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { title, picture, price, colors, status, priceSale, _id } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRouteTo = (path) => {
    navigate(path);
  };

  const deleteFunc = async (id) => {
    await deleteProduct(id);
    await getProducts();
  };
  const getProducts = async () => {
    const res = await getAllProducts();
    dispatch(setProducts(res.data));
    console.log(res.data, 'data');
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <StyledProductImg alt={title} src={`${port}/images/${picture}`} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}
          <Stack display={'flex'} direction={'row'}>
            <Button type="button" onClick={() => handleRouteTo(`edit-products/${_id}`)}>
              Edit
            </Button>
            <Button type="button" color="error" onClick={() => deleteFunc(_id)}>
              Delete
            </Button>
          </Stack>
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {priceSale && fCurrency(priceSale)}
            </Typography>
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
