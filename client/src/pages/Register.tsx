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


const Register = () => {


  const navigate = useNavigate();


  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);




  const handleRegister = async () => {


    setLoading(true);


    try {


      await api.post("/auth/register", {

        name,

        email,

        password,

      });



      toaster.create({

        title:"Registration successful",

        description:"You can login now",

        type:"success",

      });



      navigate("/");



    } catch(error) {


     console.error("Registration failed:", error);



      toaster.create({

        title:"Registration failed",

        description:"Please try again",

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

          
         🎓

        </Box>




        <Heading

          textAlign="center"

          size="xl"

        >

          Create Account

        </Heading>




        <Text

          textAlign="center"

          color="gray.500"

        >

          Join the Virtual Study Room community

        </Text>





        <Stack gap="4">



          <Field.Root>


            <Field.Label>

              Name

            </Field.Label>



            <Input

              placeholder="Enter your name"

              value={name}

              onChange={(e)=>setName(e.target.value)}

              borderRadius="lg"

              disabled={loading}

            />


          </Field.Root>





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

              placeholder="Create a password"

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

            onClick={handleRegister}

          >


            {loading ? "Creating account..." : "Create Account"}


          </Button>



        </Stack>





        <Box

          textAlign="center"

        >



          <Text

            fontSize="sm"

            color="gray.500"

          >

            Already have an account?

          </Text>




          <Button

            mt="3"

            width="full"

            variant="outline"

            borderRadius="lg"

            onClick={()=>navigate("/")}

            disabled={loading}

          >

            Back to Login

          </Button>



        </Box>




      </Stack>


    </Box>


  );


};


export default Register;