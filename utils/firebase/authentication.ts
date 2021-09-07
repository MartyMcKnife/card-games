export const getError = (error: string) => {
  switch (error) {
    case "auth/invalid-email":
      return "Invalid email!";

    case "auth/operation-not-allowed":
      return "Unexpected error!";

    case "auth/weak-password":
      return "Weak password!";

    case "auth/user-not-found":
      return "User not found!";

    case "auth/wrong-password":
      return "Incorrect username or password!";

    case "auth/email-already-in-use":
      return "Email already in use!";

    case "auth/weak-password":
      return "Weak password!";

    default:
      return error;
  }
};
