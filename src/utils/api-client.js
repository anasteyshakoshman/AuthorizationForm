const mockUser = {
  login: 'admin',
  password: 'admin',
  token: '123',
}

const getAuthUser = (login, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if ((login === mockUser.login && password === mockUser.password)) {
        resolve({
          token: mockUser.token,
          expires: Date.now() + 1000 * 60 * 60,
        })
      } else {
        reject('Incorrect login or password')
      }
    }, 600)
  });
};

const checkIfValid = (token) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === mockUser.token) {
        resolve({
          login: mockUser.login,
        })
      } else {
        reject('Incorrect token')
      }
    }, 600)
  });
}

module.exports = {
  getAuthUser,
  checkIfValid,
}
