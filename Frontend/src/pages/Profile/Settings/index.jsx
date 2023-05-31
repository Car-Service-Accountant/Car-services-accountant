import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header/Header";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SnackbarContext } from "../../../providers/snackbarProvider";
import { employerAuth } from "../../../utils/accesses/employerAuth";
import { API_URL } from "../../../utils/envProps";

const baseURL = API_URL;

const ProfileSettings = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { user } = useAuth();
  const navigate = useNavigate();
  const showSnackbar = useContext(SnackbarContext);

  const handleFormSubmit = (values) => {
    try {
      fetch(`${baseURL}employers/${user._id}`, {
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
          showSnackbar("Успешно променихте данните на профила си!", "success");
          navigate("/");
        });
      });
    } catch (err) {
      showSnackbar("Нещо се обърка моля опитайте отново!", "error");
    }
  };

  return (
    <Box m="20px">
      <Header
        title={`Здравейте ${user?.username}`}
        subtitle="Добавете информация за себе си"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          username: user?.username,
          email: user?.email,
          phoneNumber: user?.phoneNumber,
          role: user?.role,
          oldPassword: "",
          password: "",
        }}
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
                label="Име на служителя"
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
                type="text"
                label="Телефонен номер"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name="phoneNumber"
                error={!!touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                disabled
                label="Позиция"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.role}
                name="role"
                error={!!touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Стара парола"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.oldPassword}
                name="oldPassword"
                error={!!touched.oldPassword && !!errors.oldPassword}
                helperText={touched.oldPassword && errors.oldPassword}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Нова парола"
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
              <Button type="submit" color="secondary" variant="contained">
                Запази
              </Button>
              <Button
                style={{ marginLeft: 20 }}
                type="submit"
                color="secondary"
                variant="contained"
                onClick={() => navigate("/")}
              >
                Назад
              </Button>
            </Box>
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
    .min(4, "Полето трябва да съдържа между 4 и 16 символа")
    .max(16, "Полето трябва да съдържа между 4 и 16 символа"),

  oldPassword: yup
    .string()
    .min(4, "Полето трябва да съдържа между 4 и 16 символа")
    .max(16, "Полето трябва да съдържа между 4 и 16 символа"),

  phoneNumber: yup
    .string()
    .required("Полето е задължително")
    .min(10, "Полето не може да бъде по-малко от 10 символа , започващо с нула")
    .max(
      10,
      "Полето не може да бъде по-малко от 10 символа , започващо с нула"
    ),
});

export default employerAuth(ProfileSettings);
