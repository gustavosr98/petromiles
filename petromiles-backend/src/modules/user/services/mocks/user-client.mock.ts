export const expectedActiveClient = {
  idUserClient: 1,
  salt: '$2b$10$Y5k78ONz0kMCCS0ZokDGu.',
  googleToken: null,
  facebookToken: null,
  email: 'test@petromiles.com',
  password: '$2b$10$Y5k78ONz0kMCCS0ZokDGu.kuk2hW3Jfldc.bKnZUk4fsFu59KM4uW',
  stateUser: [
    {
      state: {
        idState: 1,
        name: 'active',
        description: 'This state indicates that the object is ready to be used',
      },
    },
  ],
};
export const expectedDeletedClient = {
  idUserClient: 2,
  salt: '$2b$10$Y5k78ONz0kMCCS0ZokDGu.',
  googleToken: null,
  facebookToken: null,
  email: 'test2@petromiles.com',
  password: '$2b$10$Y5k78ONz0kMCCS0ZokDGu.kuk2hW3Jfldc.bKnZUk4fsFu59KM4uW',
  stateUser: [
    {
      state: {
        idState: 2,
        name: 'deleted',
        description: 'This state indicates that the object is ready to be used',
      },
    },
  ],
};
