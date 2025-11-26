import { CircleCheckBig, FileText } from "lucide-react";
import { motion } from "framer-motion";
import CustomFormField from "./CustomFormField";
import { FormFieldType, type PatientFormData } from "@/lib/types";
import type { UseFormReturn } from "react-hook-form";
import { useMemo } from "react";
import { PRODUCTS } from "@/lib/products";

interface StepThreeProps {
  methods: UseFormReturn<PatientFormData>;
}

export default function StepThree({ methods }: StepThreeProps) {
  const { control } = methods;
  const selectedProducts = methods.watch("selectedProducts") || [];
  const values = methods.watch();

  const age = useMemo(() => {
    const dob = values.date_of_birth;
    if (!dob || !(dob instanceof Date)) return "N/A";

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }, [values.date_of_birth]);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* 1. Header (Purple/Pink Theme) */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
          <CircleCheckBig className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Review & Consent
          </h3>
          <p className="text-sm text-gray-500">
            Almost there! Please review and confirm
          </p>
        </div>
      </div>

      {/* 2. Consent Checkbox */}
      <CustomFormField
        control={control}
        fieldType={FormFieldType.CHECKBOX}
        name="consent"
        label="I consent to share my medical information with licensed doctors and medical staff at Cannazo India for the purpose of medical consultation and treatment. I understand that my information will be kept confidential and used only for medical purposes. *"
      />

      <div className="mt-4">
        <CustomFormField
          control={control}
          fieldType={FormFieldType.CHECKBOX}
          name="ageConsent"
          label="I certify that I am at least 21 years of age and voluntarily seek this medical consultation, understanding the nature of the treatment."
        />
      </div>

      {/* 3. Summary Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <h4 className="font-semibold text-gray-700">
            Summary of Your Request
          </h4>
        </div>

        <div className="p-6 grid gap-x-6 gap-y-6 text-sm">
          {/* --- PERSONAL INFO SECTION --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-1">
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Name
              </span>
              <p className="text-gray-600">{values.name}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Gender
              </span>
              <p className="text-gray-600">{values.gender}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Age
              </span>
              <p className="text-gray-600">{age} Years</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                DOB
              </span>
              <p className="text-gray-600">
                {values.date_of_birth instanceof Date
                  ? values.date_of_birth.toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            {/* Row 2 */}
            <div className="col-span-2">
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Email
              </span>
              <p className="text-gray-600">{values.email}</p>
            </div>
            <div className="col-span-2">
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Phone
              </span>
              <p className="text-gray-600">{values.phone}</p>
            </div>

            {/* Row 3: Vitals */}
            <div className="col-span-2 md:col-span-1">
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Weight
              </span>
              <p className="text-gray-600">{values.weight} kg</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Height
              </span>
              <p className="text-gray-600">{values.height} cm</p>
            </div>
          </div>

          <hr className="border-dashed border-gray-200" />

          {/* --- ADDRESS & ID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Address
              </span>
              <p className="text-gray-600">{values.address}</p>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Aadhaar Number
              </span>
              <p className="text-gray-600">{values.aadhaar_number}</p>
            </div>
          </div>

          <hr className="border-dashed border-gray-200" />

          {/* --- MEDICAL INFO --- */}
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Medical Condition
              </span>
              <p className="text-gray-800 font-medium">
                {values.medicalCondition}
              </p>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                Symptoms
              </span>
              <p className="text-gray-600">{values.symptoms}</p>
            </div>
          </div>

          {selectedProducts.length > 0 && (
            <>
              <hr className="border-dashed border-gray-200" />

              <div>
                <span className="block text-xs font-bold text-gray-900 uppercase mb-1">
                  Selected Products
                </span>
                <ul className="list-disc ml-5 text-gray-700 space-y-1 text-sm">
                  {selectedProducts.map((id) => {
                    const product = PRODUCTS.find((p) => p.id === id);
                    return (
                      <li key={id}>
                        {product ? product.name : `Product #${id}`}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
