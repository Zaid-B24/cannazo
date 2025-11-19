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
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileInView={{
          scale: [1, 1.02, 1],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        className="text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2"
      >
        Medical Cannabis Consultation
      </motion.h1>
      <p className="text-gray-600 text-lg">
        Your journey to natural healing starts here
      </p>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        whileHover={{ scale: 1.05 }}
        className="mt-4 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md cursor-default"
      >
        <Sparkles className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-gray-700">
          Expert consultation in 10-15 minutes
        </span>
      </motion.div>
    </header>
  );
}
