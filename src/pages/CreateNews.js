import { Helmet } from 'react-helmet-async';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// import { TiDelete } from 'react-icons/ti';
// import $ from 'jquery';
// import { logOut } from "../../utils/helpers/functions";

// @mui
import {
  Card,
  CardHeader,
  Stack,
  Button,
  MenuItem,
  Grid,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNewsBulletin } from 'src/redux/Slices/NewsSlice';
import { useNavigate } from 'react-router-dom';
import { getNewsBulletin } from 'src/api/newsBulletinApi';
import { createNews } from 'src/api/newsList';
import { createNotification } from '../../common/createNotification';
import { port } from 'src/constants/api';
import { Icon } from '@iconify/react';
import { createPodcast } from 'src/api/podcast';

function CreateNews() {
  // STATES
  const [itemData, setitemData] = useState('');
  const [loading, setloading] = useState(false);
  const [videoLink, setvideoLink] = useState('');
  const [inputLink, setinputLink] = useState('');
  const [videoData, setvideoData] = useState('');
  const [bulletin, setnewsBulletin] = useState('');
  const [mediaErrors, setmediaErrors] = useState({});
  const [dateValue, setDateValue] = useState(new Date());

  // CONSTANTS
  const formTop = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const pathName = window.location.pathname.split('/')[2];
  const path = pathName.charAt(0).toUpperCase() + pathName.slice(1);
  const { newsBulletin } = useSelector((state) => state.news);
  const filteredBulletin = newsBulletin.filter(
    // eslint-disable-next-line eqeqeq
    (newsBullet) => newsBullet.status == 1
  );
  const SUPPORTED_FORMATS_VIDEOS = ['video/mp4', 'video/webm', 'video/ogg', 'video/mpeg', 'video/mkv'];
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/webp', 'image/avif'];
  const validationSchema = Yup.object().shape({
    newsTitle: Yup.string().required('Title is required'),
    journalist: Yup.string().required('Journalist name is required'),
    summary: Yup.string().required('Summary is required'),
    description: Yup.string().required('Description is required'),

    bulletin: Yup.string().required('News bulletin is required'),
    picture: Yup.mixed()
      .test('required', 'Picture is required', (value) => {
        return value && value.length;
      })
      .test('fileType', 'Unsupported File Format', (value) => {
        return SUPPORTED_FORMATS.includes(value[0]?.type);
      }),
    link:
      inputLink &&
      Yup.string().test('fileType', 'Not correct URL', (value) => {
        return get_youtube_thumbnail(value, 'high');
      }),
  });
  const validationSchemaPodcast = Yup.object().shape({
    newsTitle: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    journalist: Yup.string().required('Journalist name is required'),
    video: Yup.mixed()
      .test('required', 'You need to provide a file', (value) => {
        return value && value.length;
      })
      .test('fileType', 'Not Supported', (value) => {
        return SUPPORTED_FORMATS_VIDEOS.includes(value[0]?.type);
      }),
    link:
      inputLink &&
      Yup.string().test('fileType', 'Not correct URL', (value) => {
        return get_youtube_thumbnail(value, 'high');
      }),
  });

  const formOptions = {
    resolver: yupResolver(pathName === 'news-podcast' ? validationSchemaPodcast : validationSchema),
  };
  const { register, handleSubmit, formState, setError, setValue, trigger } = useForm(formOptions);
  const { errors } = formState;

  //USE EFFECTS--------------------------------------
  useEffect(() => {
    getBulletin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    register('ckeditorInput');
    if (errors?.description?.message) {
      $('.ck-content').removeClass('ck-focused');
      $('.ck-content').addClass('errorCkEditor');
    }
  });

  // FUNCTIONS-----------------------------------------
  const getBulletin = async () => {
    try {
      const data = await getNewsBulletin();
      // eslint-disable-next-line eqeqeq
      const filteredBulletin = data.data.filter((e) => e.status == 1);
      dispatch(setNewsBulletin(filteredBulletin));
    } catch (error) {
      logOut(error.response.data.msg);
    }
  };
  function get_youtube_thumbnail(url, quality) {
    if (url) {
      var video_id, thumbnail, result;
      if ((result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))) {
        video_id = result.pop();
      } else if ((result = url.match(/youtu.be\/(.{11})/))) {
        video_id = result.pop();
      }
      if (video_id) {
        if (typeof quality == 'undefined') {
          quality = 'high';
        }
        var quality_key = 'maxresdefault'; // Max quality
        // eslint-disable-next-line eqeqeq
        if (quality == 'low') {
          quality_key = 'sddefault';
          // eslint-disable-next-line eqeqeq
        } else if (quality == 'medium') {
          quality_key = 'mqdefault';
          // eslint-disable-next-line eqeqeq
        } else if (quality == 'high') {
          quality_key = 'hqdefault';
        }
        thumbnail = 'http://img.youtube.com/vi/' + video_id + '/' + quality_key + '.jpg';
        return thumbnail;
      }
    }
    return false;
  }

  const onSubmitForm = async (data) => {
    setloading(true);

    // eslint-disable-next-line eqeqeq
    const handleRouteTo = (path) => {
      navigate(path);
    };

    const formData = new FormData();

    data?.picture && formData.append('files', data.picture[0]);
    formData.append('files', data.video[0]);
    pathName !== 'news-podcast' && formData.append('news_bulletin_id', data.bulletin);
    formData.append('title', data.newsTitle);
    formData.append('journalist_name', data.journalist);
    pathName !== 'news-podcast' && formData.append('summary', data.summary);
    formData.append('description', data.description);
    pathName === 'news-podcast'
      ? formData.append('publish', +data?.published)
      : formData.append('publish_status', +data?.published);
    formData.append('news_yt_video_link', data.link);
    formData.append('published_date', dateValue);
    pathName !== 'news-podcast' && formData.append('recent', +data?.recentNews);
    formData.append('updated_by_user_id', user?.id);
    if (pathName !== 'news-podcast') {
      try {
        await createNews(formData);
        handleRouteTo('/dashboard/news');
        createNotification('success', 'Created', 'News created Successfully');
      } catch (error) {
        logOut(error.response.data.msg);
        setloading(false);
      }
    } else {
      try {
        await createPodcast(formData);
        handleRouteTo('/dashboard/news-podcast');
        createNotification('success', 'Created', 'Podcast created Successfully');
      } catch (error) {
        logOut(error.response.data.msg);
        setloading(false);
        createNotification('error', 'Error', `error while create ${pathName}`);
      }
    }
  };

  const handleBulletinChange = (event) => {
    setnewsBulletin(event.target.value);
  };

  const handleFile = (e) => {
    trigger('picture');
    const image = e.target.files[0];
    if (!image) {
      return false;
    }
    register('picture');
    if (!image.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
      setitemData('');
      return false;
    }

    setitemData(URL.createObjectURL(e.target.files[0]));
    return e.target.files[0];
  };
  const handleVideo = (e) => {
    trigger('video');
    const video = e.target.files[0];

    if (!video.name.match(/\.(mp4)$/)) {
      setError('video', {
        type: 'custom',
        message: 'Not supported',
      });
      return false;
    }
    setvideoData(URL.createObjectURL(e.target.files[0]));
    return e.target.files[0];
  };

  return (
    <>
      <Helmet>
        <title> {path} </title>
      </Helmet>

      {loading && (
        <Box
          onClick={() => setloading(false)}
          sx={{
            display: 'flex',
            position: 'fixed',
            height: '100%',
            width: '75%',
            bottom: '0',
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',

            zIndex: '1000',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Container ref={formTop}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0}>
          <Typography variant="h4" gutterBottom>
            {path}
          </Typography>
        </Stack>
        <Breadcrumbs aria-label="breadcrumb" mb={5}>
          <Link style={{ textDecoration: 'none', color: 'black' }} to="/">
            Dashboard
          </Link>
          <Link style={{ textDecoration: 'none', color: 'black' }} to={`/dashboard/${pathName}`}>
            {path}
          </Link>
          <Typography color="text.primary">Create {path}</Typography>
        </Breadcrumbs>

        <Card>
          <CardHeader title={`Create ${path}`} />
          <Box
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmitForm)}
            sx={{ pt: 5, pl: 3, pr: 3, pb: 5 }}
          >
            <Grid container spacing={4} alignItems="start">
              <Grid item xs={12} md={6}>
                <TextField
                  {...register('newsTitle', { required: true })}
                  error={errors.newsTitle}
                  helperText={errors.newsTitle ? errors.newsTitle.message : false}
                  id="news-title"
                  label="Title"
                  name="newsTitle"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register('journalist', { required: true })}
                  error={errors.journalist}
                  helperText={errors.journalist ? errors.journalist.message : false}
                  id="journalist-name"
                  label="Journalist Name"
                  name="journalist"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              {pathName !== 'news-podcast' && (
                <Grid item xs={12} md={12}>
                  <TextField
                    {...register('summary', { required: true })}
                    id="news-summary"
                    label="Summary"
                    error={errors.summary}
                    helperText={errors.summary ? errors.summary.message : false}
                    name="summary"
                    variant="outlined"
                    rows={3}
                    multiline
                    fullWidth
                  />
                </Grid>
              )}

              <Grid item xs={12} md={12}>
                <div className={errors.description ? 'errorCkEditor' : ''}>
                  <CKEditor
                    name="description"
                    style={{
                      position: 'relative',
                      zIndex: '20',
                    }}
                    config={{
                      ckfinder: {
                        uploadUrl: `${port}/upload`,
                      },
                      placeholder: 'Description...',
                    }}
                    editor={ClassicEditor}
                    data={''}
                    onChange={(event, editor) => {
                      setValue('description', editor.getData());
                      trigger('description');
                    }}
                    onReady={(editor) => {
                      editor.editing.view.change((writer) => {
                        writer.setStyle('height', '100%', editor.editing.view.document.getRoot());
                      });
                    }}
                    onBlur={(event, editor) => {}}
                    onFocus={(event, editor) => {
                      if (errors.description?.message) {
                        $('.ck-content').removeClass('ck-focused');
                        $('.ck-content').addClass('errorCkEditor');
                      }
                    }}
                  />
                </div>
                {errors.description ? <p className="errorForm">{errors.description.message}</p> : ''}
              </Grid>

              {/* upload image  */}
              {pathName !== 'news-podcast' && (
                <Grid item xs={12} md={6}>
                  <div
                    className={errors.picture || mediaErrors.image ? 'errorCkEditor' : 'borderInput'}
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
                        error={errors.picture}
                        hidden
                      />
                    </Button>
                  </div>
                  {errors.picture ? <p className="errorForm">{errors.picture.message}</p> : ''}
                </Grid>
              )}

              {/* upload video  */}
              <Grid item xs={12} md={6}>
                <div
                  className={errors.video ? 'errorCkEditor' : 'borderInput'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '20px',
                    postition: 'relative',
                  }}
                >
                  {videoData ? (
                    <div style={{ position: 'relative' }}>
                      <video
                        controls
                        autoPlay
                        src={videoData}
                        style={{
                          position: 'relative',
                          marginBottom: '10px',
                          width: '290px',
                        }}
                        alt="data"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <>
                      <Icon fontSize="60px" icon="material-symbols:video-call-rounded" />
                      <span
                        style={{
                          color: '#8d9299',
                          fontSize: '14px',
                          marginBottom: '20px',
                        }}
                      >
                        Only mp4, mkv, webm,ogg and mpeg files are supported
                      </span>
                    </>
                  )}

                  <Button variant="contained" component="label">
                    Upload Video
                    <input
                      type="file"
                      name="video"
                      error={errors.video}
                      {...register('video', {
                        onChange: handleVideo,
                      })}
                      hidden
                    />
                  </Button>
                </div>
                {errors.video ? <p className="errorForm">{errors.video.message}</p> : ''}
              </Grid>

              {/* upload video link  */}

              <Grid item xs={12} md={6}>
                {videoLink ? (
                  <>
                    <div
                      onClick={() => {
                        setvideoLink('');
                        setinputLink('');
                      }}
                      style={{
                        position: 'absolute',
                        top: '0px',
                        right: '7px',
                        cursor: 'pointer',
                        fontSize: '26px',
                        color: 'red',
                      }}
                    >
                      <TiDelete />
                    </div>

                    <img
                      src={videoLink}
                      style={{
                        height: '250px',
                        marginBottom: '10px',
                        width: '590px',
                      }}
                      alt="something"
                      loading="lazy"
                    />
                  </>
                ) : (
                  <></>
                )}

                <TextField
                  {...register('link', {
                    required: true,
                    onChange: (data) => {
                      setmediaErrors({ ...mediaErrors, yt_link: '' });
                      setinputLink(data.target.value);
                    },
                  })}
                  value={inputLink}
                  error={errors.link}
                  id="link"
                  label="Video Link"
                  name="link"
                  variant="outlined"
                  fullWidth
                />
                {errors.link?.message && (
                  <span style={{ fontSize: '12px', color: '#D61E27' }}>{errors.link?.message}</span>
                )}
              </Grid>

              {pathName === 'news' && (
                <Grid item xs={12} md={6}>
                  <Stack spacing={3} direction="column">
                    <FormControl error={errors.bulletin?.message} name="bulletin" fullWidth variant="outlined">
                      <InputLabel id="demo-simple-select-standard-label">News Bulletin</InputLabel>
                      <Select
                        labelId="news-bulletin-label"
                        id="news-bulletin"
                        name="bulletin"
                        value={bulletin}
                        {...register('bulletin', {
                          required: true,
                          onChange: handleBulletinChange,
                        })}
                        label="News bulletin *"
                      >
                        {filteredBulletin.map((index, i) => {
                          const { id, name } = index;
                          return (
                            <MenuItem key={id} value={id}>
                              {name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <FormHelperText>{errors.bulletin?.message ? errors.bulletin?.message : false}</FormHelperText>
                    </FormControl>
                  </Stack>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <Stack spacing={3} direction="column">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormControl {...register('date')} style={{ width: '100%' }}>
                      <DesktopDatePicker
                        label="Date"
                        inputFormat="DD/MM/YYYY"
                        name="date"
                        value={dateValue}
                        onChange={(newValue) => {
                          setDateValue(newValue);
                        }}
                        renderInput={(params) => <TextField width={100} variant="outlined" {...params} />}
                      />
                    </FormControl>
                  </LocalizationProvider>
                </Stack>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormGroup>
                  <Stack spacing={3} direction="row">
                    <FormControlLabel
                      control={<Switch name="published" {...register('published')} color="success" />}
                      label="Published"
                    />
                    {pathName !== 'news-podcast' && (
                      <FormControlLabel
                        control={<Switch name="recentNews" {...register('recentNews')} color="success" />}
                        label="Trending News"
                      />
                    )}
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
}

export default CreateNews;
