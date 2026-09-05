import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/Toaster";

import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import api from "../api/axios";


const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);



  const handleLogin = async () => {

    setLoading(true);

    try {

      const response = await api.post("/auth/login", {
        email,
        password,
      });


      const token = response.data.token;


      localStorage.setItem("token", token);


      toaster.create({
        title:"Login successful",
        type:"success",
      });


      navigate("/dashboard");


    } catch(error) {


      console.error("Login failed:", error);


      toaster.create({
        title:"Login failed",
        description:"Invalid email or password",
        type:"error",
      });


    } finally {

      setLoading(false);

    }

  };



  return (

    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="6"
    >


      <Stack
        w="420px"
        bg="white"
        p="8"
        gap="6"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        shadow="xl"
      >


        {/* Logo */}

        <Box
          textAlign="center"
          fontSize="4xl"
        >
          📚
        </Box>



        <Heading
          textAlign="center"
          size="xl"
        >
          Welcome Back
        </Heading>



        <Text
          textAlign="center"
          color="gray.500"
        >
          Login to your Virtual Study Room
        </Text>



        <Stack gap="4">


          <Field.Root>

            <Field.Label>
              Email
            </Field.Label>


            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              borderRadius="lg"
              disabled={loading}
            />


          </Field.Root>




          <Field.Root>


            <Field.Label>
              Password
            </Field.Label>


            <Input

              type="password"

              placeholder="Enter your password"

              value={password}

              onChange={(e)=>setPassword(e.target.value)}

              borderRadius="lg"

              disabled={loading}

            />


          </Field.Root>



          <Button

            colorPalette="blue"

            size="lg"

            borderRadius="lg"

            loading={loading}

            onClick={handleLogin}

          >

            {loading ? "Logging in..." : "Login"}

          </Button>



        </Stack>




        <Box
          textAlign="center"
        >

          <Text
            fontSize="sm"
            color="gray.500"
          >
            Don't have an account?
          </Text>



          <Button

            mt="3"

            width="full"

            variant="outline"

            borderRadius="lg"

            onClick={()=>navigate("/register")}

          >

            Create Account

          </Button>


        </Box>



      </Stack>


    </Box>

  );

};


export default Login;