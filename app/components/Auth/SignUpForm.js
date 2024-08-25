import { useState } from 'react';
import { auth } from '../../../utils/firebase';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        toast.error('Email is already registered');
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      toast.error('Error signing up: ' + error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Hi! Welcome
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Let&apos;s create an account
        </Typography>
      </Box>
      <TextField
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSignUp} fullWidth sx={{ mt: 3 }}>
        Sign Up
      </Button>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Have an account? <Button onClick={() => router.push('/auth/login')}>Log In</Button>
      </Typography>
      <ToastContainer />
    </Container>
  );
}
