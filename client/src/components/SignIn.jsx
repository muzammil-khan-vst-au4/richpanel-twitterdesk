import React from 'react'
import {Avatar, Button, CssBaseline, Link, Box, Typography, makeStyles, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TwitterIcon from '@material-ui/icons/Twitter';

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    bird : {
      margin: theme.spacing(1)
    }
  }));

export const SignIn = () => {
    const classes = useStyles();
  
  const handleSignIn = async (e) => {
    e.preventDefault()
   window.open("http://localhost:4000/auth/twitter", "_self");
  };
 // }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignIn}
          >
            <TwitterIcon className={classes.bird} />
            Sign In With Twitter
          </Button>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}