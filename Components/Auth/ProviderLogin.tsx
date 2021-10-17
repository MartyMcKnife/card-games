import { Button } from "@chakra-ui/button";
import VisuallyHidden from "@chakra-ui/visually-hidden";
import {
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "@firebase/auth";
import { FirebaseError } from "@firebase/util";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { getError } from "../../utils/firebase/authentication";
import { auth } from "../../utils/firebase/firebase-config";
import { createUser, getUser } from "../../utils/firebase/firestore";

interface Props {
  setError: React.Dispatch<
    React.SetStateAction<{
      code?: number;
      message: string;
    }>
  >;
  provider: "google" | "github";
}
//Lookup table, as each provider has basically the same logic
const lookup = {
  google: { provider: new GoogleAuthProvider(), icon: FaGoogle },
  github: { provider: new GithubAuthProvider(), icon: FaGithub },
};

export default function Google({ setError, provider }: Props): ReactElement {
  //Get our provider
  const prov = lookup[provider]["provider"];
  const Icon = lookup[provider]["icon"];

  const router = useRouter();
  return (
    <Button
      variant="outline"
      colorScheme="blackAlpha"
      onClick={async () => {
        try {
          //Signin our user with a popup
          const { user } = await signInWithPopup(auth, prov);
          //If the user doesn't already exist in the database (i.e. they signed up with a different provider), add them
          if (!(await getUser(user.uid))) {
            await createUser({
              userID: user.uid,
              email: user.email,
              userName: user.displayName,
              balance: 500,
            });
          }

          router.push("/");
        } catch (err) {
          const error: FirebaseError = err;
          setError({ message: getError(error.code) });
        }
      }}
    >
      <VisuallyHidden>Login with Google!</VisuallyHidden>
      <Icon color="black" size="16px" />
    </Button>
  );
}
