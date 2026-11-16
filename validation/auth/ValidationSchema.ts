import * as Yup from "yup";

const email = Yup.string().trim().email("Enter a valid email address").required("Email is required");
const password = Yup.string().min(6, "Use at least 6 characters").required("Password is required");

export const loginSchema = Yup.object({
  email,
  password: Yup.string().required("Password is required"),
});

export const signUpSchema = Yup.object({
  name: Yup.string().trim().min(2, "Enter your full name").required("Enter your full name"),
  email,
  phoneNumber: Yup.string()
    .transform((value) => (value ?? "").replace(/[\s-]/g, ""))
    .matches(/^\+?\d{9,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  password,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),
});

export const emailSchema = Yup.object({ email });

export const newPasswordSchema = Yup.object({
  password,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),
});
