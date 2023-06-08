import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Header/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { isLogedIn } from "../../utils/accesses/isLogedIn";

const Login = () => {
  const { handleLogin, handeDemoLogin } = useAuth();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const handleFormSubmit = async (values) => {
    const response = await handleLogin(values.email, values.password);
    if (response) {
      navigate('/')
    }
  };

  const onDemoLogin = async () => {
    await handeDemoLogin();
    navigate('/')
  }

  return (
    <Box m="20px">
      <Header title="Вход в системата" subtitle="Въведете E-mail-а и парола" />

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
                variant="filled"
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
                variant="filled"
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
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained" style={{ marginRight: '20px' }}>
                Вход
              </Button>
              <Button onClick={onDemoLogin} color="secondary" variant="contained">
                Демо профил
              </Button>
            </Box>
            <Typography display="flex" justifyContent="center" mt="20px">
              Ако все още нямате фирма , може да отворите такава като я
              регистрирате
              <Box ml={1}>
                <Link to="/register">Тук</Link>
              </Box>
            </Typography>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  email: yup
    .string()
    .email("Въвели сте грешен Е-мейл")
    .required("Полето е задължително"),

  password: yup
    .string()
    .required("Полето е задължително")
    .min(4, "Полето трябва да съдържа между 4 и 16 символа")
    .max(16, "Полето трябва да съдържа между 4 и 16 символа"),
});
const initialValues = {
  email: "",
  password: "",
};

export default isLogedIn(Login);
