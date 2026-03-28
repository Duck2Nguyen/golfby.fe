import { CircleCheck, type LucideIcon } from 'lucide-react';

type StepType = {
  label: string;
  icon: LucideIcon;
  done: boolean;
};

interface StepProgressProps {
  steps: StepType[];
}

export default function StepProgress({ steps }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, idx) => (
        <div key={step.label} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                step.done
                  ? 'bg-primary text-white'
                  : idx === steps.length - 1
                    ? 'bg-primary/15 text-primary border-2 border-primary'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.done ? <CircleCheck className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
            </div>
            <span
              className={`text-[13px] hidden sm:block ${
                step.done || idx === steps.length - 1
                  ? 'text-foreground font-600'
                  : 'text-muted-foreground font-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mx-3 rounded-full ${step.done ? 'bg-primary' : 'bg-border'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
