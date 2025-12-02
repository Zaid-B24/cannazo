import { useState, useCallback, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CircleCheckBig, Loader2 } from "lucide-react";
import { PatientFormValidation, type PatientFormData } from "@/lib/types";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { toast } from "sonner";
import StepProducts from "./StepProducts";
import { generatePDF } from "@/lib/pdf-generator";
import { Stepper } from "./Stepper";
import { Button } from "../ui/button";

export default function PatientForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const TOTAL_STEPS = 4;
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
      selectedProducts: [],
      consent: false,
      ageConsent: false,
      date_of_birth: undefined as unknown as Date,
    },
  });

  const {
    trigger,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const consent = watch("consent");
  const ageConsent = watch("ageConsent");

  const handleReset = useCallback(() => {
    setShowSuccess(false);
    setTimeLeft(5);
    reset();
    setCurrentStep(1);
    window.scrollTo(0, 0);
  }, [reset]);

  useEffect(() => {
    if (showSuccess && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && timeLeft === 0) {
      handleReset();
    }
  }, [handleReset, showSuccess, timeLeft]);

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
      fieldsToValidate = ["selectedProducts"];
    } else if (currentStep === 4) {
      fieldsToValidate = ["consent", "ageConsent"];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < 4) {
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
          setIsSubmitting(false);
          setShowSuccess(true);
        } catch (error) {
          console.error("❌ Submission Error:", error);
          toast.error("Something went wrong.");
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      console.error("❌ Validation Failed!");
      console.error("Current Form Errors:", errors);
    }
  }, [currentStep, trigger, getValues, errors]);

  const SuccessScreen = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 ">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CircleCheckBig className="w-10 h-10 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        Submission Successful!
      </h2>
      <p className="text-gray-500 max-w-md">
        Your medical consultation request has been generated securely.
      </p>

      <div className="flex flex-col items-center mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <Loader2 className="w-6 h-6 text-green-600 animate-spin mb-2" />
        <p className="text-sm text-gray-600 font-medium">
          Redirecting to home in{" "}
          <span className="text-green-600 font-bold text-lg">{timeLeft}</span>{" "}
          seconds...
        </p>
      </div>

      {/* Optional: Allow user to skip wait */}
      <Button
        variant="ghost"
        onClick={handleReset}
        className="mt-4 text-gray-400 hover:text-gray-600"
      >
        Skip Wait
      </Button>
    </div>
  );

  const RenderNavigation = () => {
    const isSubmitDisabled =
      isSubmitting ||
      (currentStep === TOTAL_STEPS && (!consent || !ageConsent));
    return (
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col-reverse gap-3 md:flex-row">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        ) : (
          <div className="hidden md:block w-auto" />
        )}

        <Button
          type="button"
          onClick={handleNextStep}
          disabled={isSubmitDisabled}
          className={`w-full md:flex-1 h-auto py-3 whitespace-normal text-white shadow-md transition-all duration-200
          ${
            currentStep === TOTAL_STEPS
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-900 hover:bg-gray-800"
          }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:blur-[0.5px]
        `}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>
                {currentStep === TOTAL_STEPS ? "Submit Request" : "Continue"}
              </span>
              {currentStep === TOTAL_STEPS ? (
                <CircleCheckBig className="w-4 h-4 shrink-0" />
              ) : (
                <ArrowRight className="w-4 h-4 shrink-0" />
              )}
            </div>
          )}
        </Button>
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full rounded-lg shadow-2xl border-0 bg-white/95 backdrop-blur-xl overflow-hidden mb-16"
      >
        <div className="flex flex-col space-y-1.5 p-6 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-t-lg relative overflow-hidden">
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
          {showSuccess ? (
            <SuccessScreen />
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              {currentStep === 1 && <StepOne methods={methods} />}
              {currentStep === 2 && <StepTwo methods={methods} />}
              {currentStep === 3 && <StepProducts />}
              {currentStep === 4 && <StepThree methods={methods} />}
              <RenderNavigation />
            </form>
          )}
        </div>
      </motion.div>
    </FormProvider>
  );
}
