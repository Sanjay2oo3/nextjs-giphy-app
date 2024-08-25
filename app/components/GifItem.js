import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, IconButton, Box } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { db, auth } from '../../utils/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const GifItem = ({ gif, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const checkIfFavorite = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().gifs.includes(gif.id)) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error retrieving favorite data:', error);
    }
  };

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        await checkIfFavorite();
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [checkIfFavorite]);

  const toggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'favorites', user.uid);
      const docSnap = await getDoc(docRef);

      let updatedFavorites;
      if (docSnap.exists()) {
        const existingFavorites = docSnap.data().gifs;
        if (isFavorite) {
          updatedFavorites = existingFavorites.filter(id => id !== gif.id);
        } else {
          updatedFavorites = [...existingFavorites, gif.id];
        }
        await setDoc(docRef, { gifs: updatedFavorites });
      } else {
        updatedFavorites = [gif.id];
        await setDoc(docRef, { gifs: updatedFavorites });
      }
      setIsFavorite(!isFavorite);
      if (typeof onFavoriteChange === 'function') {
        onFavoriteChange(); // Notify parent component
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1, boxShadow: 2 }}>
      <CardMedia
        component="img"
        image={gif.images.fixed_height.url}
        alt={gif.title}
        sx={{ borderRadius: 1, marginBottom: 1 }}
      />
      <CardContent sx={{ padding: 0 }}>
        <Box display="flex" justifyContent="center">
          <IconButton onClick={toggleFavorite}>
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GifItem;
