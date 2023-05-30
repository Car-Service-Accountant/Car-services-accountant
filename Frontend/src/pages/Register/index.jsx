import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/useAuth";
import { isLogedIn } from "../../utils/accesses/isLogedIn";
import { Link } from "react-router-dom";
import { API_URL } from "../../utils/envProps";

const URL = API_URL;

const Register = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { handleRegister } = useAuth();

  const handleFormSubmit = (values) => {
    fetch(`${URL}auth/register/company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error("Something gone wrong");
      }
      response.json().then((result) => {
        handleRegister(result);
        return;
      });
    });
  };

  return (
    <Box m="20px">
      <Header title="Регистриране на фирма" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Име на фирмата"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="E-mail"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                label="Парола"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                label="Повторете паролата"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rePassword}
                name="rePassword"
                error={!!touched.rePassword && !!errors.rePassword}
                helperText={touched.rePassword && errors.rePassword}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Регистриране
              </Button>
            </Box>
            <Typography display="flex" justifyContent="center" mt="20px">
              Ако вече имате фирма или сте служител в някоя , моля влезте от
              <Box ml={1}>
                <Link to="/login">Тук</Link>
              </Box>
            </Typography>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  username: yup
    .string()
    .required("Полето е задължително")
    .min(3, "Полето трябва да е между 3 и 20 символа")
    .max(20, "Полето трябва да е между 3 и 20 символа"),

  email: yup
    .string()
    .email("Въвели сте грешен Е-мейл")
    .required("Полето е задължително"),

  password: yup
    .string()
    .required("Полето е задължително")
    .min(4, "Полето трябва да съдържа между 4 и 16 символа")
    .max(16, "Полето трябва да съдържа между 4 и 16 символа"),

  rePassword: yup
    .string()
    .required("Полето е задължително")
    .min(4, "Полето трябва да съдържа между 4 и 16 символа")
    .max(16, "Полето трябва да съдържа между 4 и 16 символа"),
});
const initialValues = {
  username: "",
  email: "",
  password: "",
  rePassword: "",
};

export default isLogedIn(Register);
