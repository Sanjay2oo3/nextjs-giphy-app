import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../utils/firebase';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      toast.success(`Logged in as ${user.email}`);
      router.push('/');
    }
  }, [user,router]);

  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error('Email field cannot be empty.');
      return;
    }

    if (!password.trim()) {
      toast.error('Password field cannot be empty.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast.error('Email Id or Password is incorrect');
    }
  };

  const goToForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
  Hi! Welcome
</Typography>
<Typography variant="subtitle1" gutterBottom>
  I&apos;m waiting for you, please enter your detail
</Typography>
      </Box>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth sx={{ mt: 3 }}>
        Log In
      </Button>
      <Button variant="text" onClick={goToForgotPassword} fullWidth sx={{ mt: 1 }}>
        Forgot Password?
      </Button>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
  Don&apos;t have an account? <Button onClick={() => router.push('/auth/signup')}>Sign Up</Button>
</Typography>
      <ToastContainer />
    </Container>
  );
}

