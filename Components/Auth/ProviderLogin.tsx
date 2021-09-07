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

const lookup = {
  google: { provider: new GoogleAuthProvider(), icon: FaGoogle },
  github: { provider: new GithubAuthProvider(), icon: FaGithub },
};

export default function Google({ setError, provider }: Props): ReactElement {
  const prov = lookup[provider]["provider"];
  const Icon = lookup[provider]["icon"];
  const router = useRouter();
  return (
    <Button
      variant="outline"
      colorScheme="blackAlpha"
      onClick={async () => {
        try {
          const { user } = await signInWithPopup(auth, prov);
          if (!(await getUser(user.uid))) {
            await createUser({
              userID: user.uid,
              email: user.email,
              userName: user.displayName,
              balance: {
                "1000": 0,
                "500": 0,
                "100": 1,
                "50": 5,
                "25": 10,
                "5": 15,
                "1": 10,
              },
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
