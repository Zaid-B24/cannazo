import { Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import CustomFormField from "./CustomFormField";
import { FormFieldType, type PatientFormData } from "@/lib/types";
import QuickAddSymptoms from "./QuickAddSymptoms";
import type { UseFormReturn } from "react-hook-form";

interface StepTwoProps {
  methods: UseFormReturn<PatientFormData>;
}

export default function StepTwo({ methods }: StepTwoProps) {
  const { control } = methods;

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Medical Information
          </h3>
          <p className="text-sm text-gray-500">
            Help us understand your health needs
          </p>
        </div>
      </div>

      {/* 1. Medical Condition Input */}
      <div>
        <CustomFormField
          control={control}
          fieldType={FormFieldType.INPUT}
          name="medicalCondition"
          label="Medical Condition"
          placeholder="Enter your primary medical condition (e.g., Chronic Pain, Anxiety, Epilepsy)"
        />
        <p className="text-xs text-gray-500 mt-2">
          Please state the primary condition you are seeking treatment for.
        </p>
      </div>

      {/* 2. Symptoms Textarea */}
      <CustomFormField
        control={control}
        fieldType={FormFieldType.TEXTAREA}
        name="symptoms"
        label="Symptoms & Related Conditions"
        placeholder="Describe your symptoms in detail..."
      />

      {/* 3. Quick Add Symptoms Component */}
      <QuickAddSymptoms methods={methods} />

      {/* 4. Reason for Seeking Treatment */}
      <CustomFormField
        control={control}
        fieldType={FormFieldType.TEXTAREA}
        name="seekingReason"
        label="Why are you seeking cannabis-based treatment?"
        placeholder="Please explain why you believe cannabis-based medicine may help your condition, what other treatments you've tried, and what you hope to achieve..."
      />

      {/* 5. Medical History (Optional) */}
      <CustomFormField
        control={control}
        fieldType={FormFieldType.TEXTAREA}
        name="medicalHistory"
        label="Relevant Medical History"
        placeholder="Previous treatments, medications, surgeries, allergies, etc."
      />
    </motion.div>
  );
}
