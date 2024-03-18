import * as Yup from "yup";

const CreateTicketSchema = Yup.object().shape({
  topic: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Topic is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default CreateTicketSchema;
