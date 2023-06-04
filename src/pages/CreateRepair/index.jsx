import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { v4 } from "uuid";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header/Header";
import { Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { employerAuth } from "../../utils/accesses/employerAuth";
import { SnackbarContext } from "../../providers/snackbarProvider";
import { API_URL } from "../../utils/envProps";
import { useAuth } from "../../hooks/useAuth";
import { useMode } from "../../theme";

const URL = API_URL;

const CreateRepair = () => {
  const [theme] = useMode();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [car, setCar] = useState(null);
  const [parts, setParts] = useState([]);
  const [repairsServices, setRepairsServices] = useState([]);
  const [sendData, setSendData] = useState(false);
  const showSnackbar = useContext(SnackbarContext);
  const {user , companyId} = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSuperSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const carHandleFormSubmit = async (values) => {
    if(values.carNumber.length === 8){
      const currentCar = await getCar(values.carNumber , companyId);
      if (currentCar) {
        showSnackbar(
        `Успешно намерен автомобил с номер :${currentCar.carNumber}`,
        "success"
        );
        setCar(currentCar);
      } else {
        showSnackbar(`Не е намерена кола с този регистрационен номер!`, "error");
      }
    }
  };

  const partsHandleFormSubmit = (values) => {
    showSnackbar(`Успешно добавихте част!`, "success");
    setParts((prevRepairs) => [...prevRepairs, { id: v4(), ...values }]);
  };

  const deleteRepairHandler = (id) => {
    showSnackbar(`Успешно изтрихте част!`, "success");
    setParts((prevRepairs) => prevRepairs.filter((repair) => repair.id !== id));
  };

  const repairServiceHandleFormSubmit = (values) => {
    showSnackbar(`Успешно добавихте вид услуга!`, "success");
    setRepairsServices((prevRepairs) => [
      ...prevRepairs,
      { id: v4(), ...values },
    ]);
  };

  const deleteRepairServicesHandler = (id) => {
    showSnackbar(`Успешно премахнахте вид услуга!`, "success");
    setRepairsServices((prevRepairs) =>
      prevRepairs.filter((repair) => repair.id !== id)
    );
  };

  const finalizeRepair = async () => {
    const carId = car._id;
    if(parts?.length === 0) {
      showSnackbar(`Няма добавени части!`, "error");
      return;
    }
    if(repairsServices.length === 0) {
      showSnackbar(`Няма добавена вид услуга!`, "error");
      return;
    }
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
      comanyHoldRepairs: companyId,
      worker: user._id,
      note: "Empty by default for now",
    };

    fetch(`${URL}repair/${carId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status !== 200) {
        throw new Error("Something gone wrong");
      }
      showSnackbar(
        `Успешно създодохте ремонт по кола с номер: ${car.carNumber}!`,
        "success"
      );
      setSendData(true);
    });
  };

  if (sendData) {
    return <Navigate to="/" />;
  }

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
              handleChange,
              handleSubmit,
            }) => (
              <form onChange={handleSubmit} onSubmit={handleSubmit}>
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
                    variant="outlined"
                    type="text"
                    label="Номер на колата"
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
               value={car.carVIN}
               variant="outlined"
               label="Вин на колата"
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
                sx={{ gridColumn: "span 2" }}
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
                        variant="outlined"
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
                        variant="outlined"
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
                        variant="outlined"
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
                        variant="outlined"
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
                        variant="outlined"
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

            {parts.length > 0 && <Box>
              <Typography fontSize={20} style={{display:"flex" , justifyContent:"center"}}>
                Резервни части
              </Typography>
              <Divider sx={{ gridColumn: "span 4" }}></Divider>
              </Box>}
            {parts.length > 0 &&
              parts.map((value) => (
                <Box
                  key={value._id}
                  display="grid"
                  gap="30px"
                  gridTemplateColumns= { isSuperSmall ? "repeat(10, minmax(0, 1fr))" :"repeat(12, minmax(0, 1fr))"}
                >
                  <TextField
                    fullWidth
                    value={value.part}
                    variant="outlined"
                    label="Резервна част"
                    sx={isMobile ? { gridColumn: "span 4" } :{ gridColumn: "span 5" }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    value={`${value.priceForService} лв.`}
                    variant="outlined"
                    label="Цена за сервиза"
                    sx={isMobile ? { gridColumn: "span 3" }: { gridColumn: "span 3" }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    value={`${value.priceForClient} лв.`}
                    variant="outlined"
                    label="Цена за клиента"
                    sx={isMobile ? { gridColumn: "span 3" }: { gridColumn: "span 3" }}
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

              {repairsServices.length > 0 && <Box>
              <Typography fontSize={20} style={{display:"flex" , justifyContent:"center"}}>
                Цена за труд
              </Typography>
              <Divider sx={{ gridColumn: "span 4" }}></Divider>
              </Box>} 
            {repairsServices.length > 0 && 
              repairsServices.map((value) => (
                <Box
                  key={value._id}
                  display="grid"
                  gap="30px"
                  gridTemplateColumns= {isMobile ? "repeat(8, minmax(0, 1fr))" : "repeat(10, minmax(0, 1fr))"}
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
                    sx={ isMobile ? { gridColumn: "span 5" } :{ gridColumn: "span 6" }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    value={`${value.laborCost} лв.`}
                    variant="outlined"
                    label="Цена за труд"
                    sx={ isMobile ? { gridColumn: "span 2" } :{ gridColumn: "span 3" }}
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
    .min(3, "Полето трябва да е между 3 и 50 символа")
    .max(50, "Полето трябва да е между 3 и 50 символа"),
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

export default employerAuth(CreateRepair);

async function getCar(id , companyId) {
  if(id.length === 8){
    id = id.toUpperCase();
    try {
      const response = await fetch(`${URL}car/${id}`, {
        method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Company-ID": companyId,
      },
    });
    if(response.status === 200){
      const result = await response.json();
      return result;
    }
    return null;
    } catch (error) {
    console.error(error);
    }
  }
}
