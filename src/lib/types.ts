
import type { Control, ControllerRenderProps, FieldValues } from "react-hook-form";
import { z } from "zod";

export const FormFieldType = {
  INPUT: "input",
  TEXTAREA: "textarea",
  PHONE_INPUT: "phoneInput",
  CHECKBOX: "checkbox",
  DATE_PICKER: "datePicker",
  SELECT: "select",
  SKELETON: "skeleton",
  NUMBER: "number"
} as const;

export type FormFieldType = (typeof FormFieldType)[keyof typeof FormFieldType];

export interface CustomProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  required?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: ControllerRenderProps<FieldValues, string>) => React.ReactNode;
  fieldType: FormFieldType;
}


export const PatientFormValidation = z.object({
  name: z.string().min(3, "Full Name is required."),
  email: z.email("Invalid email address."),
  phone: z.string().min(10, "Phone number is required."),
  gender: z.enum(["Male", "Female", "Other"]),
  weight: z.string().optional(),
  height: z.string().optional(),
  aadhaar_number: z.string().optional().refine((val) => !val || val.length === 12, {
    message: "Aadhaar must be exactly 12 digits",
  }),
  date_of_birth: z.date(),
  address: z.string().optional(),
  aadhaar_image_url: z.any().optional(),
  medicalCondition: z.string().min(3, "Medical Condition is required."),
  symptoms: z.string().optional(),
  medicalHistory: z.string().optional(),
  selectedProducts: z.array(z.string()).min(1, "Please select at least one product."),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to continue.",
  }),
  ageConsent: z.boolean().refine((val) => val === true, {
    message: "You must certify that you are over 21 years of age.",
  }),
});

export type PatientFormData = z.infer<typeof PatientFormValidation>;

//Aadhaar number compulsory//length(12, "Aadhaar must be 12 digits.")