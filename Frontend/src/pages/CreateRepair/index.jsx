import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { v4 } from "uuid";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header/Header";
import { Navigate } from "react-router-dom";
import { useState } from "react";

const baseURL = "http://localhost:3005";

const CreateRepair = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [car, setCar] = useState(null);
  const [parts, setParts] = useState([]);
  const [repairsServices, setRepairsServices] = useState([]);
  const [sendData, setSendData] = useState(false);

  const carHandleFormSubmit = async (values) => {
    const currentCar = await getCar(values.carNumber);
    setCar(...currentCar);
  };

  const partsHandleFormSubmit = (values) => {
    setParts((prevRepairs) => [...prevRepairs, { id: v4(), ...values }]);
  };

  const deleteRepairHandler = (id) => {
    setParts((prevRepairs) => prevRepairs.filter((repair) => repair.id !== id));
  };

  const repairServiceHandleFormSubmit = (values) => {
    setRepairsServices((prevRepairs) => [
      ...prevRepairs,
      { id: v4(), ...values },
    ]);
  };

  const finalizeRepair = async () => {
    const carId = car._id;
    const stackedParts = parts.map((obj) => {
      const { part, priceForClient, priceForService } = obj;
      return {
        partName: part,
        servicePrice: parseInt(priceForService),
        clientPrice: parseInt(priceForClient),
      };
    });
    const stackedRepayerServices = repairsServices.map(
      (service) => service.serviceType
    );
    const totalLaborCost = repairsServices.reduce(
      (acc, curr) => Number(acc) + Number(curr.laborCost),
      0
    );

    const data = {
      service: stackedRepayerServices,
      parts: stackedParts,
      priceForLabor: totalLaborCost,
      note: "Empty by default for now",
    };

    fetch(`${baseURL}/repair/${carId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error("Something gone wrong");
      }
      setSendData(true);
    });
  };

  if (sendData) {
    return <Navigate to="/" />;
  }

  const deleteRepairServicesHandler = (id) => {
    setRepairsServices((prevRepairs) =>
      prevRepairs.filter((repair) => repair.id !== id)
    );
  };
  console.log(car);
  return (
    <Box m="20px">
      {car ? (
        <Header title={`Добавяне на ремонт ${car.carNumber}`} />
      ) : (
        <Header title="Добавете кола за ремонт" />
      )}

      {!car && (
        <>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <Typography>Номер на колата</Typography>
          </Box>
          <Formik
            onSubmit={carHandleFormSubmit}
            initialValues={carInitialValues}
            validationSchema={carCheckoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onFocus={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Име на служителя"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.carNumber}
                    name="carNumber"
                    error={!!touched.carNumber && !!errors.carNumber}
                    helperText={touched.carNumber && errors.carNumber}
                    sx={{ gridColumn: "span 2" }}
                  />
                </Box>
              </form>
            )}
          </Formik>
        </>
      )}
      {car && (
        <>
          <Box display="grid" gap="30px">
            <Box
              display="grid"
              gap="10px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <Typography fontSize={20} sx={{ gridColumn: "span 2" }}>
                Информация на колата
              </Typography>
              <Divider sx={{ gridColumn: "span 4" }}></Divider>
            </Box>
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
                value={car.carNumber}
                variant="outlined"
                label="Номер"
                sx={{ gridColumn: "span 2" }}
                disabled
              />
              <TextField
                fullWidth
                value={car.owner}
                variant="outlined"
                label="Собственик"
                sx={{ gridColumn: "span 2" }}
                disabled
              />
              <TextField
                fullWidth
                value={car.phoneNumber}
                variant="outlined"
                label="Телефонен номер"
                sx={{ gridColumn: "span 2" }}
                disabled
              />
              <TextField
                fullWidth
                value={car.carModel}
                variant="outlined"
                label="Модел на колата"
                sx={{ gridColumn: "span 2" }}
                disabled
              />
              <TextField
                fullWidth
                value={car.carMark}
                variant="outlined"
                label="Марка на колата"
                sx={{ gridColumn: "span 4" }}
                disabled
              />
            </Box>

            <Box>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <Typography fontSize={20} sx={{ gridColumn: "span 2" }}>
                  Информация на ремонта
                </Typography>
                <Divider sx={{ gridColumn: "span 4", mb: 4 }}></Divider>
              </Box>
              <Formik
                key="repairKey"
                onSubmit={partsHandleFormSubmit}
                initialValues={partsInitialValues}
                validationSchema={partsCheckoutSchema}
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
                        "& > div": {
                          gridColumn: isNonMobile ? undefined : "span 4",
                        },
                      }}
                    >
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Резервна част"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.part}
                        name="part"
                        error={!!touched.part && !!errors.part}
                        helperText={touched.part && errors.part}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Цена за сервиза"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.priceForService}
                        name="priceForService"
                        error={
                          !!touched.priceForService && !!errors.priceForService
                        }
                        helperText={
                          touched.priceForService && errors.priceForService
                        }
                        sx={{ gridColumn: "span 1" }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Цена за клиента"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.priceForClient}
                        name="priceForClient"
                        error={
                          !!touched.priceForClient && !!errors.priceForClient
                        }
                        helperText={
                          touched.priceForClient && errors.priceForClient
                        }
                        sx={{ gridColumn: "span 1" }}
                      />
                    </Box>
                    <Box display="flex" justifyContent="center" mt="20px">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                      >
                        <AddCircleOutlineOutlinedIcon />
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>

            {parts.length > 0 &&
              parts.map((value) => (
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(10, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    value={value.part}
                    variant="outlined"
                    label="Резервна част"
                    sx={{ gridColumn: "span 3" }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    value={value.priceForService}
                    variant="outlined"
                    label="Цена за сервиза"
                    sx={{ gridColumn: "span 3" }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    value={value.priceForClient}
                    variant="outlined"
                    label="Цена за клиента"
                    sx={{ gridColumn: "span 3" }}
                    disabled
                  />
                  <Box display="flex" justifyContent="top">
                    <Button
                      type="button"
                      color="secondary"
                      variant="contained"
                      sx={{ gridColumn: "span 0" }}
                      onClick={() => deleteRepairHandler(value.id)}
                    >
                      <HighlightOffOutlinedIcon />
                    </Button>
                  </Box>
                </Box>
              ))}

            <Box>
              <Formik
                key="repairServiceKey"
                onSubmit={repairServiceHandleFormSubmit}
                initialValues={repairServiceInitialValues}
                validationSchema={repairServicesCheckoutSchema}
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
                        "& > div": {
                          gridColumn: isNonMobile ? undefined : "span 4",
                        },
                      }}
                    >
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Вид услуга"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.serviceType}
                        name="serviceType"
                        error={!!touched.serviceType && !!errors.serviceType}
                        helperText={touched.serviceType && errors.serviceType}
                        sx={{ gridColumn: "span 3" }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Цена за труд"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.laborCost}
                        name="laborCost"
                        error={!!touched.laborCost && !!errors.laborCost}
                        helperText={touched.laborCost && errors.laborCost}
                        sx={{ gridColumn: "span 1" }}
                      />
                    </Box>
                    <Box display="flex" justifyContent="center" mt="20px">
                      <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                      >
                        <AddCircleOutlineOutlinedIcon />
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>

            {repairsServices.length > 0 && <></> &&
              repairsServices.map((value) => (
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(10, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    value={value.serviceType}
                    variant="outlined"
                    label="Услуга"
                    sx={{ gridColumn: "span 6" }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    value={`${value.laborCost} лв.`}
                    variant="outlined"
                    label="Цена за труд"
                    sx={{ gridColumn: "span 3" }}
                    disabled
                  />
                  <Box display="flex" justifyContent="top">
                    <Button
                      type="button"
                      color="secondary"
                      variant="contained"
                      sx={{ gridColumn: "span 0" }}
                      onClick={() => deleteRepairServicesHandler(value.id)}
                    >
                      <HighlightOffOutlinedIcon />
                    </Button>
                  </Box>
                </Box>
              ))}
          </Box>

          <Box display="flex" justifyContent="center" mt="20px">
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              onClick={() => finalizeRepair()}
            >
              Добави
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

const carCheckoutSchema = yup.object().shape({
  carNumber: yup
    .string()
    .required("Полето е задължително")
    .min(3, "Полето трябва да е между 3 и 20 символа")
    .max(20, "Полето трябва да е между 3 и 20 символа"),
});

const partsCheckoutSchema = yup.object().shape({
  part: yup.string().required("Полето е задължително"),
  priceForService: yup
    .number("Полето трябва да съдържа само цифри")
    .required("Полето е задължително"),
  priceForClient: yup
    .number("Полето трябва да съдържа само цифри")
    .required("Полето е задължително"),
});

const repairServicesCheckoutSchema = yup.object().shape({
  serviceType: yup
    .string("Полето трябва да съдържа само цифри")
    .required("Полето е задължително")
    .min(3, "Полето трябва да е между 3 и 20 символа")
    .max(20, "Полето трябва да е между 3 и 20 символа"),
  laborCost: yup
    .number("Полето трябва да съдържа само цифри")
    .required("Полето е задължително"),
});

const carInitialValues = {
  carNumber: "",
};

const partsInitialValues = {
  part: "",
  priceForService: 0,
  priceForClient: 0,
};

const repairServiceInitialValues = {
  serviceType: "",
  laborCost: 0,
};

export default CreateRepair;

async function getCar(id) {
  try {
    const response = await fetch(`${baseURL}/car/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}
