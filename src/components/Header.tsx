import { Sparkles } from "lucide-react";
import logoImg from "../assets/logo.jpg";
import { motion } from "framer-motion";
export default function Header() {
  return (
    <header className="text-center mb-8 pt-6">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileInView={{
          rotate: [-5, 5],
          transition: {
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          },
        }}
        className="flex items-center justify-center gap-3 mb-4"
      >
        <img
          src={logoImg}
          alt="Cannazo India Logo"
          className="h-32 w-auto object-contain drop-shadow-lg"
        />
      </motion.div>
      <h1 className="text-4xl font-bold bg-linear-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
        Medical Cannabis Consultation
      </h1>
      <p className="text-gray-600 text-lg">
        Your journey to natural healing starts here
      </p>
      <div className="mt-4 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md cursor-default">
        <Sparkles className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-gray-700">
          Expert consultation in 10-15 minutes
        </span>
      </div>
    </header>
  );
}
