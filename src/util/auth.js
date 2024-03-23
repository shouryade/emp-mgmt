import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from "react";
import queryString from "query-string";
import firebase from "./firebase";
import { useUser, createUser, updateUser } from "./db";
import { history } from "./router";
import PageLoader from "./../components/PageLoader";

const MERGE_DB_USER = true;
const EMAIL_VERIFICATION = false;

const authContext = createContext();
export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook that enables any component to subscribe to auth state
export const useAuth = () => {
  return useContext(authContext);
};

function useAuthProvider() {
  const [user, setUser] = useState(null);

  // Format final user object and merge extra data from database
  const finalUser = usePrepareUser(user);

  // Connect analytics session to user
  useIdentifyUser(finalUser);

  // Handle response from authentication functions
  const handleAuth = async (response) => {
    const { user, additionalUserInfo } = response;

    // Ensure Firebase is actually ready before we continue
    await waitForFirebase();

    // Create the user in the database if they are new
    if (additionalUserInfo.isNewUser) {
      await createUser(user.uid, { email: user.email });

      // Send email verification if enabled
      if (EMAIL_VERIFICATION) {
        firebase.auth().currentUser.sendEmailVerification();
      }
    }

    // Update user in state
    setUser(user);
    return user;
  };

  const signup = (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(handleAuth);
  };

  const signin = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(handleAuth);
  };

  const signinWithProvider = (name) => {
    const providerData = allProviders.find((p) => p.name === name);

    const provider = new providerData.providerMethod();

    if (providerData.parameters) {
      provider.setCustomParameters(providerData.parameters);
    }

    return firebase.auth().signInWithPopup(provider).then(handleAuth);
  };

  const signout = () => {
    return firebase.auth().signOut();
  };

  const sendPasswordResetEmail = (email) => {
    return firebase.auth().sendPasswordResetEmail(email);
  };

  const confirmPasswordReset = (password, code) => {
    // Get code from query string object
    const resetCode = code || getFromQueryString("oobCode");

    return firebase.auth().confirmPasswordReset(resetCode, password);
  };

  const updateEmail = (email) => {
    return firebase
      .auth()
      .currentUser.updateEmail(email)
      .then(() => {
        // Update user in state (since onAuthStateChanged doesn't get called)
        setUser(firebase.auth().currentUser);
      });
  };

  const updatePassword = (password) => {
    return firebase.auth().currentUser.updatePassword(password);
  };

  // Update auth user and persist to database (including any custom values in data)
  // Forms can call this function instead of multiple auth/db update functions
  const updateProfile = async (data) => {
    const { email, name, picture } = data;

    // Update auth email
    if (email) {
      await firebase.auth().currentUser.updateEmail(email);
    }

    // Update auth profile fields
    if (name || picture) {
      let fields = {};
      if (name) fields.displayName = name;
      if (picture) fields.photoURL = picture;
      await firebase.auth().currentUser.updateProfile(fields);
    }

    // Persist all data to the database
    await updateUser(user.uid, data);

    // Update user in state
    setUser(firebase.auth().currentUser);
  };

  useEffect(() => {
    // Subscribe to user on mount
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, []);

  return {
    user: finalUser,
    signup,
    signin,
    signinWithProvider,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    updateEmail,
    updatePassword,
    updateProfile,
  };
}

// Format final user object and merge extra data from database
function usePrepareUser(user) {
  // Fetch extra data from database (if enabled and auth user has been fetched)
  const userDbQuery = useUser(MERGE_DB_USER && user && user.uid);

  // Memoize so we only create a new object if user or userDbQuery changes
  return useMemo(() => {
    // Return if auth user is null (loading) or false (not authenticated)
    if (!user) return user;

    // Data we want to include from auth user object
    let finalUser = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      name: user.displayName,
      picture: user.photoURL,
    };

    finalUser.providers = user.providerData.map(({ providerId }) => {
      return allProviders.find((p) => p.id === providerId).name;
    });

    // If merging user data from database is enabled ...
    if (MERGE_DB_USER) {
      // eslint-disable-next-line default-case
      switch (userDbQuery.status) {
        case "idle":
          return null;
        case "loading":
          return null;
        case "error":
          console.error(userDbQuery.error);
          return null;
        case "success":
          if (userDbQuery.data === null) return null;
          Object.assign(finalUser, userDbQuery.data);
      }
    }

    return finalUser;
  }, [user, userDbQuery]);
}

export const requireAuth = (Component) => {
  return (props) => {
    const auth = useAuth();

    useEffect(() => {
      if (auth.user === false) {
        history.replace("/auth/signin");
      }
    }, [auth]);

    if (!auth.user) {
      return <PageLoader />;
    }
    return <Component {...props} />;
  };
};

export const handleRecoverEmail = (code) => {
  let originalEmail;
  return firebase
    .auth()
    .checkActionCode(code)
    .then((info) => {
      originalEmail = info.data.email;
      return firebase.auth().applyActionCode(code);
    })
    .then(() => {
      return firebase.auth().sendPasswordResetEmail(originalEmail);
    })
    .then(() => {
      return originalEmail;
    });
};

// Handle Firebase email link for verifying email
export const handleVerifyEmail = (code) => {
  return firebase.auth().applyActionCode(code);
};

const allProviders = [
  {
    id: "password",
    name: "password",
  },
  {
    id: "google.com",
    name: "google",
    providerMethod: firebase.auth.GoogleAuthProvider,
  },
  {
    id: "facebook.com",
    name: "facebook",
    providerMethod: firebase.auth.FacebookAuthProvider,
    parameters: {
      // Tell fb to show popup size UI instead of full website
      display: "popup",
    },
  },
  {
    id: "twitter.com",
    name: "twitter",
    providerMethod: firebase.auth.TwitterAuthProvider,
  },
  {
    id: "github.com",
    name: "github",
    providerMethod: firebase.auth.GithubAuthProvider,
  },
];

// Connect analytics session to current user.uid
function useIdentifyUser(user) {
  useEffect(() => {
    console.log(user);
  }, [user]);
}

// Waits on Firebase user to be initialized before resolving promise
// This is used to ensure auth is ready before any writing to the db can happen
const waitForFirebase = () => {
  return new Promise((resolve) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve(user); // Resolve promise when we have a user
        unsubscribe(); // Prevent from firing again
      }
    });
  });
};

const getFromQueryString = (key) => {
  return queryString.parse(window.location.search)[key];
};
