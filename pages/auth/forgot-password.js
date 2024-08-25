import { useState } from 'react';
import { auth } from '../../utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button, TextField, Typography, Stack } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      toast.error("Email field cannot be empty. Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(<span style={{ color: 'green' }}>Password reset email sent. Please check your inbox.</span>);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Password reset error: ", error);
      if (error.message.includes('auth/user-not-found')) {
        toast.error("This email address is not registered. Please try again.");
      } else if (error.message.includes('auth/invalid-email')) {
        toast.error("Invalid email address. Please enter a valid email.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Stack spacing={2} maxWidth="400px" margin="auto" mt={5}>
      <Typography variant="h4" textAlign="center">Forgot Password</Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handlePasswordReset} fullWidth>
        Send Reset Link
      </Button>
      {message && <Typography textAlign="center">{message}</Typography>}
      <ToastContainer />
    </Stack>
  );
}
