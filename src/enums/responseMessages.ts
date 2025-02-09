export const Error = {
  clientError: {
    badRequest: 'Bad Request',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    notFound: 'Not Found',
    methodNotAllowed: 'Method Not Allowed',
    conflict: 'Conflict',
    unprocessableEntity: 'Unprocessable Entity'
  }
}

export const Message = {
  global: {
    invalidCredentials: 'Invalid credentials',
    loggedIn: 'Logged in successfully',
    loginFailed: 'Login failed',
    userNotFoundAndLoggedOut: 'User not found or already logged out',
    userLoggedOut: 'User logged out successfully'
  },
  user: {
    registrationFailed: 'User registration failed',
    userExists: 'User already exists',
    created: 'User created successfully',
    profilePictureOrAvatarOptionsRequired:
      'Either profilePicture or avatarOptions must be provided.',
    emailAndPasswordRequired: 'Email and password are required'
  },
  jwt: {
    invalidToken: 'Invalid token',
    invalidValiables: 'Invalid jwt environment variables'
  }
}
