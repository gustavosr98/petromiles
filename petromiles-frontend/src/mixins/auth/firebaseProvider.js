import firebase from "firebase/app";
import "firebase/auth";

export const providersMixin = {
  data: function() {
    return {
      providers: [
        {
          name: "google",
          provider: new firebase.auth.GoogleAuthProvider(),
          class: "text-capitalize font-weight-light black--text white",
          colorIcon: "red",
        },
        {
          name: "facebook",
          provider: new firebase.auth.FacebookAuthProvider(),
          class: "text-capitalize font-weight-light white--text indigo",
          colorIcon: "white",
        },
      ],
    };
  },
};
