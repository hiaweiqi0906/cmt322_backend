class DataNotExistError extends Error {
    constructor(message) {
      super(message); 
      this.name = "DataNotExistError"; 
    }
  }
  class UserNotSameError extends Error {
    constructor(message) {
      super(message); 
      this.name = "UserNotSameError"; 
    }
  }

  class ServerError extends Error {
    constructor(message) {
      super(message); 
      this.name = "ServerError"; 
    }
  }

  class DoNotHaveAccessError extends Error {
    constructor(message) {
      super(message); 
      this.name = "DoNotHaveAccessError"; 
    }
  }

module.exports = {
    DataNotExistError,
    UserNotSameError,
    DoNotHaveAccessError
};
