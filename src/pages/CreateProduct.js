import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { createProduct, getOneProduct } from '../api/productsApi';

export const CreateProduct = () => {
  const [itemData, setitemData] = useState('');
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const pathName = window.location.pathname.split('/')[3];
  const path = pathName.split('-')[0].charAt(0).toUpperCase() + pathName.split('-')[0].slice(1);
  const formTop = useRef();
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/webp', 'image/avif'];

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('description is required'),
    price: Yup.number().required('Price  is required'),
    // summary: Yup.string().required('Summary is required'),

    // bulletin: Yup.string().required('News bulletin is required'),
    picture: Yup.mixed()
      .test('required', 'Picture is required', (value) => {
        return value && value.length;
      })
      .test('fileType', 'Unsupported File Format', (value) => {
        return SUPPORTED_FORMATS.includes(value[0]?.type);
      }),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };
  const { register, handleSubmit, formState, reset, setError, setValue, trigger } = useForm(formOptions);
  const { errors } = formState;

  const handleFile = (e) => {
    setitemData(URL.createObjectURL(e.target.files[0]));
  };
  const handleRouteTo = (path) => {
    navigate(path);
  };

  const [edit, setedit] = useState(false);

  const onSubmitForm = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('picture', data.picture[0]);
    formData.append('available', data.available);
    formData.append('published', data.published);
    formData.append('price', data.price);
    const res = await createProduct(formData);
    handleRouteTo(`/dashboard/products`);
  };
  console.log(pathName);
  useEffect(() => {
    if (pathName.includes('edit')) {
      setedit(true);
      getSingle();
    } else {
      setedit(false);
    }
  }, [pathName]);
  const { id } = useParams();
  console.log(id, 'id');
  const getSingle = async () => {
    const res = await getOneProduct(id);
    reset(res.data);
  };
  return (
    <>
      <Helmet>Create News</Helmet>
      <Container ref={formTop}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0}>
          <Typography variant="h4" gutterBottom>
            {path} Products
          </Typography>
        </Stack>
        <Breadcrumbs aria-label="breadcrumb" mb={5}>
          <Link style={{ textDecoration: 'none', color: 'black' }} to="/">
            Dashboard
          </Link>
          <Link style={{ textDecoration: 'none', color: 'black' }} to={`/dashboard/products`}>
            Products
          </Link>
          <Typography color="text.primary">{path} Products</Typography>
        </Breadcrumbs>

        <Card>
          <CardHeader title={` ${path} Products`} />
          <Box
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmitForm)}
            sx={{ pt: 5, pl: 3, pr: 3, pb: 5 }}
          >
            <Grid container spacing={4} alignItems="start">
              <Grid item xs={12} md={12}>
                <TextField
                  {...register('title', { required: true })}
                  error={errors.title}
                  helperText={errors.title ? errors.title.message : false}
                  id="news-title"
                  label="Title"
                  name="title"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  {...register('description', { required: true })}
                  error={errors.description}
                  helperText={errors.description ? errors.description.message : false}
                  id="description-name"
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  variant="outlined"
                  fullWidth
                />
              </Grid>

              {/* upload image  */}

              <Grid item xs={12} md={12}>
                <div
                  className={errors.picture ? 'errorCkEditor' : 'borderInput'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '20px',
                    postition: 'relative',
                  }}
                >
                  {itemData ? (
                    <>
                      <img
                        src={itemData}
                        style={{
                          height: '190px',
                          marginBottom: '10px',
                          width: '190px',
                        }}
                        alt="something"
                        loading="lazy"
                      />
                    </>
                  ) : (
                    <>
                      <Icon fontSize="60px" icon="material-symbols:image-rounded" />
                      <span
                        style={{
                          color: '#8d9299',
                          fontSize: '14px',
                          marginBottom: '20px',
                        }}
                      >
                        Only jpg, jpeg, gif and png files are supported
                      </span>
                    </>
                  )}

                  <Button variant="contained" component="label">
                    Upload image
                    <input
                      id="picture"
                      name="picture"
                      {...register('picture', {
                        onChange: handleFile,
                      })}
                      type="file"
                      // error={errors.picture}
                      hidden
                    />
                  </Button>
                </div>
                {errors.picture ? <p className="errorForm">{errors.picture.message}</p> : ''}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...register('price', { required: true })}
                  error={errors.price}
                  helperText={errors.price ? errors.price.message : false}
                  id="price"
                  type="number"
                  label="Price"
                  name="price"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <FormGroup>
                  <Stack spacing={3} direction="row">
                    <FormControlLabel
                      control={<Switch name="available" {...register('available')} color="success" />}
                      label="Available"
                    />
                    <FormControlLabel
                      control={<Switch name="published" {...register('published')} color="success" />}
                      label="Published"
                    />
                  </Stack>
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={12} className="d-flex space-between align-items-center">
                <Button type="submit" variant="contained">
                  SUBMIT
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </>
  );
};
