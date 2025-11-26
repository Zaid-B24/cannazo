import { SYMPTOM_CATEGORIES } from "@/lib/symptoms";
import type { PatientFormData } from "@/lib/types";
import { Plus } from "lucide-react";
import { useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";

export default function QuickAddSymptoms({
  methods,
}: {
  methods: UseFormReturn<PatientFormData>;
}) {
  const handleSymptomAdd = useCallback(
    (symptom: string) => {
      // 1. Get current value from the 'symptoms' field
      const currentSymptoms = methods.getValues("symptoms") || "";

      // 2. Check if symptom is already added to prevent duplicates (Case insensitive check)
      if (currentSymptoms.toLowerCase().includes(symptom.toLowerCase())) {
        return;
      }

      // 3. Append logic: Add comma if text exists, otherwise just the symptom
      let newSymptoms = currentSymptoms.trim();
      if (newSymptoms.length > 0) {
        // Check if it already ends with a comma or space to avoid double punctuation
        if (!newSymptoms.endsWith(",")) {
          newSymptoms += ", ";
        } else {
          newSymptoms += " ";
        }
        newSymptoms += symptom;
      } else {
        newSymptoms = symptom;
      }

      // 4. Update the form field value and trigger validation
      methods.setValue("symptoms", newSymptoms, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [methods]
  );

  return (
    <div className="mt-4">
      {/* Collapsible Details Section */}
      <details className="group" open>
        {" "}
        {/* Added 'open' to keep it open by default like screenshot */}
        <summary className="flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 rounded-md py-2 text-blue-600 font-medium hover:text-blue-700 list-none select-none">
          <Plus className="w-4 h-4 transition-transform group-open:rotate-45" />
          Quick Add Symptoms
        </summary>
        {/* Categories Grid */}
        <div className="grid gap-4 mt-3 animate-in slide-in-from-top-2 duration-200">
          {SYMPTOM_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Category Title */}
                <p className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${category.color}`} />
                  {category.title}
                </p>

                {/* Symptom Buttons */}
                <div className="flex flex-wrap gap-2">
                  {category.symptoms.map((symptom, sIndex) => (
                    <button
                      key={sIndex}
                      type="button" // Crucial: prevent form submission
                      onClick={() => handleSymptomAdd(symptom)}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 
                                                       hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 
                                                       active:scale-95 transition-all duration-150 shadow-sm"
                    >
                      <Plus className="w-3 h-3 mr-1.5 text-gray-400" />
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
