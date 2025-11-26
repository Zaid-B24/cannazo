import {
  Link,
  Activity,
  Brain,
  Utensils,
  AlertCircle,
} from "lucide-react";

export const SYMPTOM_CATEGORIES = [
  {
    title: "Pain & Inflammation",
    icon: Link,
    color: "text-indigo-500",
    symptoms: [
      "Chronic Pain",
      "Arthritis",
      "Back Pain",
      "Joint Pain",
      "Muscle Spasms",
      "Migraine",
      "Neuropathic Pain",
    ],
  },
  {
    title: "Mental Health & Sleep",
    icon: Activity,
    color: "text-purple-500",
    symptoms: [
      "Anxiety",
      "Depression",
      "PTSD",
      "Insomnia",
      "Panic Disorder",
      "Stress",
    ],
  },
  {
    title: "Neurological Conditions",
    icon: Brain,
    color: "text-blue-500",
    symptoms: [
      "Epilepsy",
      "Multiple Sclerosis",
      "Parkinson's Disease",
      "Tremors",
      "Neuropathy",
    ],
  },
  {
    title: "Digestive Issues",
    icon: Utensils,
    color: "text-orange-500",
    symptoms: [
      "Nausea",
      "Vomiting",
      "Loss of Appetite",
      "IBS",
      "Crohn's Disease",
    ],
  },
  {
    title: "Other Medical Conditions",
    icon: AlertCircle,
    color: "text-green-500",
    symptoms: [
      "Glaucoma",
      "Chemotherapy Side Effects",
      "Cancer Pain",
      "HIV/AIDS Symptoms",
      "ADHD",
    ],
  },
];