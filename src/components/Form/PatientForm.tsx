import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CircleCheckBig, Stethoscope, User, Loader2 } from "lucide-react";
import { PatientFormValidation, type PatientFormData } from "@/lib/types";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// --- PDF GENERATOR FUNCTION ---
const generatePDF = async (data: PatientFormData) => {
  const doc = new jsPDF();

  // 1. Title
  doc.setFontSize(20);
  doc.setTextColor(40, 167, 69); // Brand Green
  doc.text("Medical Cannabis Consultation Request", 20, 20);

  // 2. Personal Details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${data.name}`, 20, 40);
  doc.text(`Email: ${data.email}`, 20, 50);
  doc.text(`Phone: ${data.phone}`, 20, 60);
  doc.text(`Gender: ${data.gender}`, 20, 70);

  const dob =
    data.date_of_birth instanceof Date
      ? data.date_of_birth.toLocaleDateString()
      : "N/A";
  doc.text(`DOB: ${dob}`, 20, 80);
  doc.text(`Vitals: ${data.weight}kg | ${data.height}cm`, 20, 90);

  // 3. Medical Info
  doc.setFontSize(16);
  doc.setTextColor(40, 167, 69);
  doc.text("Medical Information", 20, 110);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Condition: ${data.medicalCondition}`, 20, 120);

  // Handle long text for Symptoms
  const splitSymptoms = doc.splitTextToSize(`Symptoms: ${data.symptoms}`, 170);
  doc.text(splitSymptoms, 20, 130);

  // 4. Legal
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`[x] Patient Consent Verified`, 20, 280);
  doc.text(`[x] Age (21+) Verified`, 20, 285);

  // 5. EMBED IMAGE (Aadhaar)
  if (data.aadhaar_image_url instanceof File) {
    try {
      // Add a new page for the ID card to avoid layout mess
      doc.addPage();

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Attached Identity Proof (Aadhaar)", 20, 20);

      // Convert File -> Base64
      const base64Img = await fileToBase64(data.aadhaar_image_url);

      // Add Image (ImgData, Format, X, Y, Width, Height)
      // We scale it to fit nicely (e.g., 150mm width)
      doc.addImage(base64Img, "JPEG", 20, 30, 150, 100);
    } catch (error) {
      console.error("Error embedding image", error);
      doc.text("Error loading attached image.", 20, 40);
    }
  } else {
    doc.addPage();
    doc.text("No ID Proof Attached", 20, 20);
  }

  // 6. Save
  doc.save(`${data.name.replace(/\s+/g, "_")}_Consultation.pdf`);
};

const Stepper = ({ step }: { step: number }) => {
  const totalSteps = 3;
  const progressWidth = `${((step - 1) / (totalSteps - 1)) * 100}%`;

  const steps = [
    {
      id: 1,
      label: "Personal Info",
      ActiveIcon: User,
      CompleteIcon: CircleCheckBig,
    },
    {
      id: 2,
      label: "Medical Info",
      ActiveIcon: Stethoscope,
      CompleteIcon: CircleCheckBig,
    },
    {
      id: 3,
      label: "Review",
      ActiveIcon: CircleCheckBig,
      CompleteIcon: CircleCheckBig,
    },
  ];

  return (
    <div className="flex justify-between items-center mb-8 relative">
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: progressWidth }}
        ></div>
      </div>
      {steps.map((s) => {
        const isActive = step === s.id;
        const isComplete = step > s.id;
        const iconBgClass = isComplete
          ? "bg-green-500 border-green-500 text-white"
          : isActive
          ? "bg-white border-green-500 text-green-600"
          : "bg-white border-gray-300 text-gray-400";
        const labelClass = isActive ? "text-green-600" : "text-gray-500";
        const IconComponent = isComplete ? s.CompleteIcon : s.ActiveIcon;

        return (
          <div key={s.id} className="flex flex-col items-center relative z-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${iconBgClass}`}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <span className={`text-xs mt-2 font-medium ${labelClass}`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function PatientForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm<PatientFormData>({
    resolver: zodResolver(PatientFormValidation),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "" as "Male" | "Female" | "Other",
      weight: "",
      height: "",
      aadhaar_number: "",
      address: "",
      medicalCondition: "",
      symptoms: "",
      medicalHistory: "",
      consent: false,
      ageConsent: false,
      date_of_birth: undefined as unknown as Date,
    },
  });

  const { trigger, getValues } = methods;

  const handleNextStep = useCallback(async () => {
    let fieldsToValidate: (keyof PatientFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "name",
        "email",
        "phone",
        "gender",
        "weight",
        "height",
        "date_of_birth",
        "address",
        "aadhaar_number",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = ["medicalCondition", "symptoms"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["consent", "ageConsent"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < 3) {
        setIsSubmitting(true);
        setTimeout(() => {
          setIsSubmitting(false);
          setCurrentStep((prev) => prev + 1);
          window.scrollTo(0, 0);
        }, 400);
      } else {
        setIsSubmitting(true);
        try {
          await generatePDF(getValues());
          toast.success(
            "Your request has been submitted successfully. Our team will contact you shortly."
          );
        } catch (error) {
          console.error("❌ Submission Error:", error);
          toast.error("Something went wrong.");
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      console.error("❌ Validation Failed!");
      console.error("Current Form Errors:", methods.formState.errors);
    }
  }, [currentStep, trigger, getValues, methods.formState.errors]);

  return (
    <FormProvider {...methods}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full rounded-lg shadow-2xl border-0 bg-white/95 backdrop-blur-xl overflow-hidden mb-16"
      >
        <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-t-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="tracking-tight text-2xl font-bold text-center mb-2">
              Medical Cannabis Consultation Request
            </h3>
            <p className="text-center text-green-100 text-sm mb-4">
              Please provide accurate information for proper medical assessment
            </p>
            <Stepper step={currentStep} />
          </div>
        </div>

        <div className="p-8">
          <form>
            {currentStep === 1 && (
              <>
                <StepOne methods={methods} />
                <motion.button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  // FIXED: h-auto, padding, responsive text size
                  className="mt-8 w-full h-auto min-h-[3rem] py-3 px-4 text-base md:text-lg font-semibold rounded-xl shadow-lg text-white 
                             bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
                             transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 whitespace-normal leading-tight"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Continue to Medical Information</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 ml-2 shrink-0"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </>
                  )}
                </motion.button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <StepTwo methods={methods} />
                <div className="mt-8 flex gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full h-auto min-h-[3rem] py-3 px-4 text-base md:text-lg font-semibold rounded-xl shadow-sm border-2 border-gray-200 
                               bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300
                               transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 mr-1 shrink-0"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Previous
                  </motion.button>

                  <motion.button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full h-auto min-h-[3rem] py-3 px-4 text-base md:text-lg font-semibold rounded-xl shadow-lg text-white 
                               bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                               transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 whitespace-normal leading-tight"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Review & Consent"
                    )}
                    {!isSubmitting && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 ml-2 shrink-0"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    )}
                  </motion.button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <StepThree
                methods={methods}
                onSubmit={handleNextStep}
                isSubmitting={isSubmitting}
                setCurrentStep={setCurrentStep}
              />
            )}
          </form>
        </div>
      </motion.div>
    </FormProvider>
  );
}
