import { type Product } from "@/lib/products";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Check, Plus } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { getRecommendations } from "@/lib/getRecommendations";

const CATEGORIES = ["All", "Tincture", "Extract", "Capsules", "Tablets"];

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, // Start slightly below and invisible
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10, // Move slightly up while fading out
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function StepProducts() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedIds: string[] = watch("selectedProducts") || [];
  const rawSymptoms = watch("symptoms");

  const { recommended, others } = useMemo(() => {
    let symptomsArray: string[] = [];
    if (Array.isArray(rawSymptoms)) {
      symptomsArray = rawSymptoms;
    } else if (typeof rawSymptoms === "string") {
      symptomsArray = rawSymptoms
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return getRecommendations(symptomsArray, selectedCategory);
  }, [rawSymptoms, selectedCategory]);

  const toggleProduct = (productId: string) => {
    const current = selectedIds.includes(productId)
      ? selectedIds.filter((id) => id !== productId)
      : [...selectedIds, productId];

    setValue("selectedProducts", current, { shouldValidate: true });
  };

  const ProductCard = ({
    product,
    isRecommended,
  }: {
    product: Product;
    isRecommended?: boolean;
  }) => {
    const isSelected = selectedIds.includes(product.id);
    return (
      <motion.div
        layout
        onClick={() => toggleProduct(product.id)}
        className={`cursor-pointer border-2 rounded-xl overflow-hidden relative flex flex-col h-full transition-all
          ${
            isSelected
              ? "border-green-600 bg-green-50 shadow-md"
              : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
          }`}
      >
        {isRecommended && (
          <div className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 text-center">
            Recommended for you
          </div>
        )}
        <div className="h-40 bg-gray-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {isSelected && (
            // Simple fade for checkmark icon
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-green-600/20 flex items-center justify-center"
            >
              <div className="bg-white p-2 rounded-full shadow">
                <Check className="text-green-600 w-6 h-6" />
              </div>
            </motion.div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900">{product.name}</h3>
          <div className="flex flex-wrap gap-1 my-2">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>

          <button
            type="button"
            className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors mt-auto
              ${
                isSelected
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 group-hover:bg-green-50 group-hover:text-green-700"
              }`}
          >
            {isSelected ? (
              <>
                Added <Check className="w-4 h-4 stroke-[3px]" />
              </>
            ) : (
              <>
                Add Product <Plus className="w-4 h-4 stroke-[3px]" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };
  return (
    <div className="space-y-6 ">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Select Your Medicines</h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white"
                    : "bg-white border text-gray-600 hover:bg-gray-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {errors.selectedProducts && (
          <p className="text-red-500 text-sm">
            {errors.selectedProducts.message as string}
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory} // Key change triggers the animation
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-8" // Added spacing between sections
        >
          {/* Recommended Section */}
          {recommended.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                Based on your symptoms
              </h3>
              {/* Removed inner AnimatePresence */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommended.map((p) => (
                  <ProductCard key={p.id} product={p} isRecommended />
                ))}
              </div>
            </div>
          )}

          {/* Others Section */}
          <div>
            {(recommended.length > 0 || others.length > 0) && (
              <h3 className="text-lg font-bold mb-4 text-gray-700">
                Other available medicines
              </h3>
            )}
            {/* Removed inner AnimatePresence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {others.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Empty State */}
            {recommended.length === 0 && others.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                No products found in the "{selectedCategory}" category.
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
