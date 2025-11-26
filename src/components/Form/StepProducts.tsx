import { useFormContext } from "react-hook-form";
import { Check, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";

export default function StepProducts() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Watch the current array of selected IDs
  const selectedIds: string[] = watch("selectedProducts") || [];

  const toggleProduct = (productId: string) => {
    if (selectedIds.includes(productId)) {
      // Remove if already selected
      setValue(
        "selectedProducts",
        selectedIds.filter((id) => id !== productId),
        { shouldValidate: true }
      );
    } else {
      // Add if not selected
      setValue("selectedProducts", [...selectedIds, productId], {
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Select Your Medicines
        </h2>
        <p className="text-gray-500">
          Choose the products you are interested in consulting for.
        </p>
        {errors.selectedProducts && (
          <p className="text-red-500 text-sm mt-2 font-medium">
            {errors.selectedProducts.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => {
          const isSelected = selectedIds.includes(product.id);

          return (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              onClick={() => toggleProduct(product.id)}
              className={`
                cursor-pointer relative rounded-2xl overflow-hidden border-2 transition-all duration-200 shadow-sm
                ${
                  isSelected
                    ? "border-green-600 bg-green-50/50 shadow-green-100"
                    : "border-gray-100 bg-white hover:border-green-200 hover:shadow-md"
                }
              `}
            >
              {/* Image Area */}
              <div className="aspect-4/3 bg-gray-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Selection Checkmark Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <Check className="w-6 h-6 text-green-600 stroke-[3px]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                  {product.description}
                </p>

                <button
                  type="button"
                  className={`
                    w-full py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors
                    ${
                      isSelected
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {isSelected ? (
                    <>
                      Added <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Select Product <Plus className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
