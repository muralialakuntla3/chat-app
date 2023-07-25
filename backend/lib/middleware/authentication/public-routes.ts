const publicRoutes = [
  "/api/v1/users/sign-in",
  "/api/v1/users/sign-up",
  "/api/v1/users/forgot-password",
  "/api/v1/users/reset-password",
  /^\/socket.io.*$/, // For socket.io token comes in handshake auth payload and it is checked separately in socket middleware {{authenticateSocket}}
]; // Skip auth check for sign in and sign up

export default publicRoutes;
