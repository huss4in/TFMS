import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

class CognitoAuthBackend {
  constructor(config) {
    if (config) {
      this.userPool = new CognitoUserPool({
        UserPoolId: config.UserPoolId,
        ClientId: config.ClientId,
      });
    }
  }

  loginUser = (Username, Password) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username,
        Pool: this.userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username,
        Password,
      });

      let success = (data) => {
        data.username = Username;

        localStorage.setItem("authUser", JSON.stringify(data));
        resolve(data);
      };

      user.authenticateUser(authDetails, {
        onSuccess: success,
        newPasswordRequired: success,
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  logout = () => {
    return new Promise((resolve, reject) => {
      localStorage.removeItem("authUser");
      resolve(true);
    });
  };

  editProfileAPI = (email, password) => {
    return new Promise((resolve, reject) => {});
  };

  forgetPassword = (email) => {
    return new Promise((resolve, reject) => {});
  };

  socialLoginUser = (data, type) => {
    let credential = {};
    if (type === "google") {
    } else if (type === "facebook") {
    }
    return new Promise((resolve, reject) => {
      if (!credential) {
      } else {
        reject("Invalid Credentials");
      }
    });
  };

  setLoggedInUser = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  getAuthenticatedUser = () => {
    return localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser"))
      : null;
  };

  _handleError(error) {
    return error.message;
  }
}

let _CognitoBackend = null;

const initCognitoBackend = (config) => {
  if (!_CognitoBackend) {
    _CognitoBackend = new CognitoAuthBackend(config);
  }
  return _CognitoBackend;
};

const getCognitoBackend = () => {
  return _CognitoBackend;
};

export { initCognitoBackend, getCognitoBackend };
