import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header/Header";

const baseURL = "http://localhost:3005/car";

const CreateCar = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
    fetch(`${baseURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((response) => {
      console.log(response);
      if (response.status !== 200) {
        throw new Error("Something gone wrong");
      }
      //TODO : Redirect probably
    });
  };

  return (
    <Box m="20px">
      <Header
        title="Добавяне на кола"
        subtitle="Създайте профил на автомобила"
      />

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
                label="Собственик на колата"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Owner}
                name="Owner"
                error={!!touched.Owner && !!errors.Owner}
                helperText={touched.Owner && errors.Owner}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Марка на колата"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.carMark}
                name="carMark"
                error={!!touched.carMark && !!errors.carMark}
                helperText={touched.carMark && errors.carMark}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
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
                variant="filled"
                type="text"
                label="Модел на колата"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.carModel}
                name="carModel"
                error={!!touched.carModel && !!errors.carModel}
                helperText={touched.carModel && errors.carModel}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Номер на колата"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.CarNumber}
                name="CarNumber"
                error={!!touched.CarNumber && !!errors.CarNumber}
                helperText={touched.CarNumber && errors.CarNumber}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Добави
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  Owner: yup
    .string()
    .required("Полето е задължително")
    .min(3, "Полето трябва да е между 3 и 20 символа")
    .max(20, "Полето трябва да е между 3 и 20 символа"),

  CarNumber: yup
    .string()
    .min(
      8,
      'Полето трябва да съдържа 8 символа предържайте се към примера "PB3313MG"'
    )
    .max(
      8,
      'Полето трябва да съдържа 8 символа предържайте се към примера "PB3313MG"'
    ),

  carModel: yup.string().required("Полето е задължително"),

  carMark: yup.string().required("Полето е задължително"),

  phoneNumber: yup
    .string()
    .required("Полето е задължително")
    .min(10, "Полето не може да съдържа 10 символа")
    .max(10, "Полето не може да съдържа 10 символа"),
});
const initialValues = {
  Owner: "",
  CarNumber: "",
  carModel: "",
  carMark: "",
  phoneNumber: "",
};

export default CreateCar;
