import React, { ReactElement, useState } from "react";
import Hero from "../Helpers/Hero";
import { auth } from "../../utils/firebase/firebase-config";
import { signOut } from "@firebase/auth";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/button";

export default function Settings(): ReactElement {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSignOut = async () => {
    setLoading(true);
    await signOut(auth);
    router.push("/signin");
  };
  return (
    <Hero>
      <Button
        onClick={handleSignOut}
        colorScheme="blue"
        loadingText="Signing out..."
        isLoading={loading}
      >
        Sign Out
      </Button>
    </Hero>
  );
}
