import { useState, useEffect } from 'react';
import { searchGifs } from '../../utils/giphy';
import GifItem from './GifItem';
import LoadingAnimation from './LoadingAnimation';
import { TextField, Grid, Button, Typography, Stack, Container, IconButton, Box } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { auth } from '../../utils/firebase';
import debounce from 'lodash.debounce';
import Favorites from './Favorites';
import { useRouter } from 'next/router'; 

const GifGallery = () => {
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const gifsPerPage = 6;
  const router = useRouter();  

  useEffect(() => {
    if (query) fetchGifs();
    else {
      setGifs([]);
      setTotalPages(0);
      setCurrentPage(1);
    }
  }, [query, currentPage,fetchGifs]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);


const fetchGifs = async () => {
    if (!auth.currentUser) return; // Prevent operation if the user is logged out
    setLoading(true);
    const gifData = await searchGifs(query);
    setLoading(false);
    setGifs(gifData);
    setTotalPages(Math.ceil(gifData.length / gifsPerPage));
  };
  

  const handleSearchChange = debounce((event) => {
    setCurrentPage(1);
    setQuery(event.target.value);
  }, 500);

  const getPaginatedGifs = () => {
    const startIndex = (currentPage - 1) * gifsPerPage;
    return gifs.slice(startIndex, startIndex + gifsPerPage);
  };

  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const toggleFavorite = (gif) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.id === gif.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== gif.id);
    } else {
      updatedFavorites = [...favorites, gif];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setGifs([]); // Clear any data that might rely on Firebase
      setFavorites([]);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Find your GIFs
        </Typography>
        <IconButton
          onClick={handleLogout}
          sx={{
            backgroundColor: '#FF0000', 
            color: '#FFFFFF',
            borderRadius: '12px',
            padding: '10px',
            '&:hover': {
              backgroundColor: '#FF6666',
            },
          }}
        >
          <Logout />
        </IconButton>
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for GIFs"
        onChange={handleSearchChange}
        sx={{ mb: 3, borderRadius: '12px', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
      />
      <Favorites favorites={favorites} />
      <Typography variant="h5" gutterBottom align="center" mt={3} mb={3} sx={{ fontWeight: 'bold' }}>
        Searched GIFs
      </Typography>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          <Grid container spacing={2}>
            {getPaginatedGifs().map((gif) => (
              <Grid item xs={12} sm={6} md={4} key={gif.id}>
                <GifItem
                  gif={gif}
                  isFavorite={favorites.some((fav) => fav.id === gif.id)}
                  onFavoriteChange={() => toggleFavorite(gif)}
                />
              </Grid>
            ))}
          </Grid>
          {totalPages > 0 && (
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mt={3}>
              <Button variant="outlined" onClick={goToPreviousPage} disabled={currentPage === 1}>
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                  onClick={() => goToPage(index + 1)}
                  sx={{ backgroundColor: currentPage === index + 1 ? '#FF69B4' : 'transparent' }}
                >
                  {index + 1}
                </Button>
              ))}
              <Button variant="outlined" onClick={goToNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </Stack>
          )}
          <Typography variant="body2" align="center" mt={2}>
            Page {currentPage} of {totalPages}
          </Typography>
        </>
      )}
    </Container>
  );
};

export default GifGallery;
