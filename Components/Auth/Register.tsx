import {
  Text,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Box,
  FormLabel,
  InputRightElement,
  Button,
  Flex,
  Link,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import Hero from "../Helpers/Hero";
import { BiEnvelope, BiHide, BiLock, BiShow, BiUser } from "react-icons/bi";
import { auth } from "../../utils/firebase/firebase-config";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { User } from "../../interfaces/app";
import { createUser } from "../../utils/firebase/firestore";
import { FirebaseError } from "@firebase/util";
import { getError } from "../../utils/firebase/authentication";

export default function Register(): ReactElement {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ code?: number; message: string }>();
  const [username, setUsername] = useState<string>();
  const router = useRouter();
  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email) {
        setError({ message: "Email is required!" });
        setLoading(false);
        return;
      }
      if (!password) {
        setError({ message: "Password is required!" });
        setLoading(false);
        return;
      }
      if (!username) {
        setError({ message: "Username is required!" });
        setLoading(false);
        return;
      }
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser: User = {
        userID: user.uid,
        email: email,
        userName: username,
        balance: 635,
      };
      await createUser(newUser);
      router.push("/");
    } catch (err: any) {
      const error: FirebaseError = err;
      setError({ message: getError(error.code) });

      setLoading(false);
    }
  };
  return (
    <Hero>
      <Heading fontSize="4xl">Register</Heading>
      <Box paddingX="2" marginTop="4">
        <form>
          <FormLabel fontWeight="medium" fontSize="sm">
            Username
          </FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<BiUser color="gray" size="20" />}
            />
            <Input
              placeholder="Gameing123"
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
              required
            />
          </InputGroup>
          <FormLabel fontWeight="medium" fontSize="sm" marginTop="4">
            Email Address
          </FormLabel>
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
              required
            />
          </InputGroup>
          <FormLabel marginTop="4" fontWeight="medium" fontSize="sm">
            Password
          </FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<BiLock color="gray" size="20" />}
            />
            <Input
              placeholder="???????????????"
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              required
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
            Have an account?{" "}
            <Link href="/signin" textColor="blue.600">
              Sign in now!
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
              loadingText="Signing up..."
              isLoading={loading}
              onClick={handleLogin}
            >
              Sign up!
            </Button>
          </Flex>
        </form>
      </Box>
    </Hero>
  );
}
