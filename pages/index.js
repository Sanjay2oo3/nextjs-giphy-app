import dynamic from 'next/dynamic';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';
import { Button, Stack, Typography, Container, Box } from '@mui/material';
import { useRouter } from 'next/router';

const GifGallery = dynamic(() => import('../app/components/GifGallery'), { ssr: false });

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <Container maxWidth="lg">
      {user ? (
        <GifGallery />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          textAlign="center"
        >
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome to GIPHY World
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Find and share your favorite GIFs in a single click!
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button onClick={handleLogin} variant="contained" size="large">
              Login
            </Button>
            <Button onClick={handleSignUp} variant="contained" color="secondary" size="large">
              Sign Up
            </Button>
          </Stack>
        </Box>
      )}
    </Container>
  );
}
