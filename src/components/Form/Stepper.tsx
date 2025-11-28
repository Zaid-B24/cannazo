import { CircleCheckBig, Stethoscope, User, ShoppingBag } from "lucide-react";

export const Stepper = ({ step }: { step: number }) => {
  const totalSteps = 4;
  const progressWidth = `${((step - 1) / (totalSteps - 1)) * 100}%`;

  const steps = [
    {
      id: 1,
      label: "Personal",
      ActiveIcon: User,
      CompleteIcon: CircleCheckBig,
    },
    {
      id: 2,
      label: "Medical",
      ActiveIcon: Stethoscope,
      CompleteIcon: CircleCheckBig,
    },
    {
      id: 3,
      label: "Products",
      ActiveIcon: ShoppingBag,
      CompleteIcon: CircleCheckBig,
    },
    {
      id: 4,
      label: "Review",
      ActiveIcon: CircleCheckBig,
      CompleteIcon: CircleCheckBig,
    },
  ];

  return (
    <div className="flex justify-between items-center mb-8 relative w-full max-w-2xl mx-auto">
      <div className="absolute top-[15px] md:top-5 left-0 right-0 h-1 bg-gray-200 rounded-full z-0">
        <div
          className="h-full bg-linear-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: progressWidth }}
        ></div>
      </div>

      {steps.map((s) => {
        const isActive = step === s.id;
        const isComplete = step > s.id;

        const iconBgClass = isComplete
          ? "bg-green-500 border-green-500 text-white"
          : isActive
          ? "bg-white border-green-500 text-green-600 scale-110"
          : "bg-white border-gray-300 text-gray-400";

        const labelClass = isActive
          ? "text-green-100 font-bold"
          : "text-green-100/70";
        const IconComponent = isComplete ? s.CompleteIcon : s.ActiveIcon;

        return (
          <div
            key={s.id}
            className="flex flex-col items-center relative z-10 group cursor-default"
          >
            <div
              className={`
                w-8 h-8 md:w-12 md:h-12 
                rounded-full flex items-center justify-center border-2 md:border-4 
                transition-all duration-300 shadow-sm
                ${iconBgClass}
              `}
            >
              <IconComponent className="w-4 h-4 md:w-6 md:h-6 transition-all" />
            </div>
            <span
              className={`
                text-[10px] md:text-xs mt-2 font-medium transition-colors duration-300 text-center
                ${labelClass}
              `}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
