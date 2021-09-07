import {
  Text,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  FormControl,
  FormLabel,
  InputRightElement,
  Button,
  Flex,
  Link,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import Hero from "../Helpers/Hero";
import { BiEnvelope, BiHide, BiLock, BiShow } from "react-icons/bi";
import { auth } from "../../utils/firebase/firebase-config";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { FirebaseError } from "@firebase/util";
import { useRouter } from "next/router";
import ProviderLogin from "./ProviderLogin";
import DividerWithText from "../DividerWithText";
import { getError } from "../../utils/firebase/authentication";

export default function Login(): ReactElement {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ code?: number; message: string }>();
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email || !password) {
        setError({ message: "Email and Password is required!" });
        setLoading(false);
        return;
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
      }
    } catch (err: any) {
      const error: FirebaseError = err;
      setError({ message: getError(error.code) });
      setLoading(false);
    }
  };
  return (
    <Hero>
      <Heading fontSize="4xl">Login</Heading>
      <FormControl paddingX="2" marginTop="4">
        <SimpleGrid width="full" columns={2} spacing="3" my="4">
          <ProviderLogin setError={setError} provider="google" />
          <ProviderLogin setError={setError} provider="github" />
        </SimpleGrid>
        <DividerWithText>Or</DividerWithText>
        <FormLabel>Email Address</FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<BiEnvelope color="gray" />}
          />
          <Input
            placeholder="john@example.com"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            width={96}
          />
        </InputGroup>
        <FormLabel marginTop="4">Password</FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<BiLock color="gray" size="20" />}
          />
          <Input
            placeholder="•••••"
            type={showPassword ? "text" : "password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            width={96}
          />
          <InputRightElement
            children={
              showPassword ? (
                <BiShow color="gray" size="20" />
              ) : (
                <BiHide color="gray" size="20" />
              )
            }
            onClick={() => setShowPassword(!showPassword)}
            cursor="pointer"
          />
        </InputGroup>
        <Text fontSize="xs" marginTop="2">
          Don't have an account?{" "}
          <Link href="/signup" textColor="blue.600">
            Signup now!
          </Link>
        </Text>

        {error && (
          <Text textColor="red.600" fontSize="sm" mt="2">
            {error.message} {error.code && `Code: ${error.code}`}
          </Text>
        )}
        <Flex justifyContent="flex-end" width="full" marginTop="3">
          <Button
            colorScheme="blue"
            loadingText="Logging in..."
            isLoading={loading}
            onClick={handleLogin}
            type="submit"
          >
            Login!
          </Button>
        </Flex>
      </FormControl>
    </Hero>
  );
}
