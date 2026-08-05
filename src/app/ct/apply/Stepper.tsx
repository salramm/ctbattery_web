type StepStatus = "done" | "cur" | "todo";

const STEPS = [
  "Eligibility",
  "Contact",
  "Property",
  "Schedule survey",
  "Agreement",
  "Sign & submit",
];

export function Stepper({ current }: { current: number }) {
  return (
    <div className="stepper" aria-label="Signup progress">
      {STEPS.map((label, i) => {
        const status: StepStatus =
          i < current ? "done" : i === current ? "cur" : "todo";
        return (
          <span key={label} style={{ display: "contents" }}>
            <span className={`step-pill ${status === "todo" ? "" : status}`}>
              <span className="dot" />
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="step-divider" />}
          </span>
        );
      })}
    </div>
  );
}
