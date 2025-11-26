import { User, Download, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import CustomFormField from "./CustomFormField";
import { FormFieldType, type PatientFormData } from "@/lib/types";
import { useEffect, useMemo, useRef } from "react";
import { type UseFormReturn } from "react-hook-form";
import { SelectItem } from "../ui/select";

interface StepOneProps {
  methods: UseFormReturn<PatientFormData>;
}

export default function StepOne({ methods }: StepOneProps) {
  const { control } = methods;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const file = methods.watch("aadhaar_image_url");
  const previewUrl = useMemo(() => {
    if (!file) return null;

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      methods.setValue("aadhaar_image_url", file, { shouldValidate: true });
    } else {
      methods.setValue("aadhaar_image_url", undefined);
    }
  };

  const handleRemoveImage = () => {
    methods.setValue("aadhaar_image_url", undefined, { shouldValidate: true });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Personal Information
          </h3>
          <p className="text-sm text-gray-500">
            Let's start with your basic details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomFormField
          control={control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
        />

        <CustomFormField
          control={control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email Address"
          placeholder="your.email@example.com"
        />

        <CustomFormField
          control={control}
          fieldType={FormFieldType.INPUT}
          name="phone"
          label="Phone Number"
          placeholder="+91-9876543210"
        />

        <CustomFormField
          control={control}
          fieldType={FormFieldType.DATE_PICKER}
          name="date_of_birth"
          label="Date of Birth"
          dateFormat="dd/MM/yyyy"
        />

        <CustomFormField
          control={control}
          fieldType={FormFieldType.SELECT}
          name="gender"
          label="Gender"
          placeholder="Select Gender"
        >
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </CustomFormField>

        <div className="flex gap-4">
          <div className="flex-1">
            <CustomFormField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="weight"
              label="Weight (kg)"
              placeholder="Ex: 70"
            />
          </div>
          <div className="flex-1">
            <CustomFormField
              control={control}
              fieldType={FormFieldType.INPUT}
              name="height"
              label="Height (cm)"
              placeholder="Ex: 175"
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <CustomFormField
            control={control}
            fieldType={FormFieldType.TEXTAREA}
            name="address"
            label="Address"
            placeholder="Enter your complete address"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <CustomFormField
            control={control}
            fieldType={FormFieldType.INPUT}
            name="aadhaar_number"
            label="Aadhaar Number"
            placeholder="XXXX-XXXX-XXXX"
          />
        </div>
      </div>

      <div className="mt-8 border-t pt-8 border-gray-100 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Upload Aadhaar Card Image
        </label>

        {previewUrl ? (
          // Display image preview if available
          <div className="relative w-full h-64 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 group">
            <img
              src={previewUrl}
              alt="Aadhaar Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                         hover:bg-red-600 transition-colors z-10 opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <div
              onClick={handleUploadClick} // Clicking image also allows changing it
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center 
                         opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-lg font-semibold"
            >
              Click to change image
            </div>
          </div>
        ) : (
          // Display upload box if no image
          <div
            onClick={handleUploadClick}
            className="w-full p-8 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-brand hover:bg-green-50/30 transition-all cursor-pointer bg-gray-50/50 group"
          >
            <p className="flex items-center justify-center gap-2 text-brand font-semibold mb-1 group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
              Click to upload Aadhaar card
            </p>
            <p className="text-xs text-gray-500">
              Upload a clear photo of your Aadhaar card (front side). Max size:
              5MB
            </p>
          </div>
        )}

        <input
          type="file"
          className="hidden"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {methods.formState.errors.aadhaar_image_url && (
          <p className="text-sm text-red-500 mt-2">
            {methods.formState.errors.aadhaar_image_url.message as string}
          </p>
        )}
      </div>
    </motion.div>
  );
}
