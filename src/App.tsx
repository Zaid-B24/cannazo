import Footer from "./components/Footer";
import Header from "./components/Header";
import PatientForm from "./components/Form/PatientForm";
import "./index.css";
import { Toaster } from "./components/ui/sonner";
import BackgroundElements from "./components/BackgroundElements";

function App() {
  return (
    <div className="min-h-screen w-full bg-bg-mint relative overflow-x-hidden">
      <BackgroundElements />
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-32 h-32 bg-brand rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <Header />
        <main className="mb-10">
          <div className="max-w-4xl mx-auto">
            <PatientForm />
          </div>
        </main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
