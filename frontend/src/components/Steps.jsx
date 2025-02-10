import { motion } from "framer-motion";

const steps = [
  { text: "📂 Upload your reference list" },
  { text: "📊 Get your gender bias analysis" },
  { text: "🌎 Diversify your sources" },
  { text: "📜 Generate citation diversity statements" },
];

export default function StepFlow() {
  return (
    <div className="text-white flex flex-col md:flex-row items-center justify-center gap-12 text-lg font-medium">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.3, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-tea text-white rounded-full text-xl font-bold shadow-lg">
            {index + 1}
          </div>
          <div className="mt-3 text-center">{step.text}</div>
          {index < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "50px" }}
              transition={{ delay: index * 0.4, duration: 0.5 }}
            //   className="hidden md:block h-1 bg-white mt-3"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}