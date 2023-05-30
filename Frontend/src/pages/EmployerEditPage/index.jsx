import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header/Header";
import { adminAuth } from "../../utils/accesses/adminAuth";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SnackbarContext } from "../../providers/snackbarProvider";
import { API_URL } from "../../utils/envProps";

const URL = API_URL;

const EditEmployer = () => {
  const params = useParams();
  const id = params.empId;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [emp, setEmp] = useState([]);
  const showSnackbar = useContext(SnackbarContext);

  useEffect(() => {
    fetch(`${URL}employers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status !== 200) {
        throw new Error("Something gone wrong");
      }
      res.json().then((result) => {
        setEmp(result);
      });
    });
  }, [emp]);

  const handleFormSubmit = (values) => {
    try {
      fetch(`${URL}employers/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((response) => {
        if (response.status !== 200) {
          throw new Error("Something gone wrong");
        }
        response
          .json()
          .then(
            (result) => setEmp(result),
            showSnackbar("Успешно променихте данните за служителя", "success")
          );
      });
    } catch (err) {
      showSnackbar(
        "Нещо се обърка , моля проверете полетата и опитайте отново",
        "error"
      );
    }
  };

  if (emp.length === 0) {
    return (
      <CircularProgress
        style={{
          color: "#6870fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          height: "80vh",
        }}
      />
    );
  }

  return (
    <Box m="20px">
      <Header title={`Променете информацията за ${emp?.username}`} />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{
          username: emp?.username,
          email: emp?.email,
          phoneNumber: emp?.phoneNumber,
          role: emp?.role,
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
              <FormControl sx={{ gridColumn: "span 2" }}>
                <InputLabel>Позиция</InputLabel>
                <Select
                  variant="outlined"
                  label="Позиция"
                  name="role"
                  value={values.role || ""}
                  onChange={handleChange}
                  error={!!touched.role && !!errors.role}
                  helpertext={touched.role && errors.role}
                >
                  <MenuItem value="админ">Администратор</MenuItem>
                  <MenuItem value="мениджър">Мениджър</MenuItem>
                  <MenuItem value="служител">Служител</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Запази
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

  phoneNumber: yup
    .string()
    .required("Полето е задължително")
    .min(10, "Полето не може да бъде по-малко от 10 символа , започващо с нула")
    .max(
      10,
      "Полето не може да бъде по-малко от 10 символа , започващо с нула"
    ),
});

export default adminAuth(EditEmployer);
