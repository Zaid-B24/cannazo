import { ShieldCheck, Clock, Heart, Award } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const features = [
  {
    id: 1,
    title: "Licensed & Legal",
    desc: "All consultations by licensed professionals",
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    id: 2,
    title: "Fast Response",
    desc: "Doctor review within 10-15 minutes",
    icon: <Clock className="w-8 h-8 text-white" />,
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Personalized Care",
    desc: "Tailored treatment recommendations",
    icon: <Heart className="w-8 h-8 text-white" />,
    gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
  },
  {
    id: 4,
    title: "Quality Products",
    desc: "Premium cannabis-based medicines",
    icon: <Award className="w-8 h-8 text-white" />,
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function Footer() {
  return (
    <section className="max-w-5xl mx-auto mt-16 mb-8 px-4 md:px-8 relative z-10 overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
        Why Choose Cannazo India?
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            variants={cardVariants}
            className="rounded-lg text-card-foreground shadow-sm hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 border-gray-100 h-full"
          >
            <div className="p-8 text-center">
              <div
                className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
              >
                {feature.icon}
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
