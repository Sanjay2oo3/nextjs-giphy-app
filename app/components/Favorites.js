import React, { useEffect, useState } from 'react';
import { db, auth } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import GifItem from './GifItem';
import { Grid, Typography, Button, Stack, Container } from '@mui/material';
import { searchGifsById } from '../../utils/giphy';

const ITEMS_PER_PAGE = 3;

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError('User is not authenticated');
        return;
      }

      try {
        const docRef = doc(db, 'favorites', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const favoriteGifIds = docSnap.data().gifs;
          const gifs = await Promise.all(favoriteGifIds.map(id => searchGifsById(id)));
          setFavorites(gifs.filter(gif => gif !== null));
          setTotalPages(Math.ceil(gifs.length / ITEMS_PER_PAGE));
        } else {
          setFavorites([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to fetch favorites');
      }
    };

    fetchFavorites();
  }, [favorites]);

  const getPaginatedFavorites = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return favorites.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom align="center" mt={3} mb={3} sx={{ fontWeight: 'bold' }}>
        Favorites
      </Typography>
      {error ? (
        <Typography variant="body1" color="error" align="center">{error}</Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {favorites.length > 0 ? (
              getPaginatedFavorites().map((gif) => (
                <Grid item xs={12} sm={6} md={4} key={gif.id}>
                  <GifItem gif={gif} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" align="center">No favorites yet. Start adding some!</Typography>
            )}
          </Grid>
          {totalPages > 1 && (
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
        </>
      )}
    </Container>
  );
};

export default Favorites;
