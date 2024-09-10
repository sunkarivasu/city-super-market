import React from "react";
import "../css/ProgressBar.css"; // Import the CSS file for styling

const ProgressBar = ({ steps, currentStep }) => {
  // Limit steps to maximum of 3
  const displayedSteps = steps.slice(0, 3);

  console.log("steps", steps)
  console.log("currentStep", currentStep)

  return (
    <div className="progress-bar">
      <div className="steps-container">
        {displayedSteps.map((step, index) => {
          const isCompleted = index < currentStep - 1; // Steps before the current one
          const isActive = index === currentStep - 1; // Current step
          return (
            <div className="step-wrapper" key={index}>
              <div
                className={`step-circle ${
                  isCompleted
                    ? "completed"
                    : isActive
                    ? "active"
                    : "upcoming"
                }`}
              >
                {isCompleted && <span className="tick">&#10003;</span>}
              </div>
              <div
                className={`step-label ${
                  isActive ? "active-label" : "upcoming-label"
                }`}
              >
                {step.label}
              </div>
              <div className={`step-desc ${isActive?'highlighted':''}`}>{step.description}</div>
              {index !== displayedSteps.length - 1 && (
                <div className={`progress-line ${isCompleted ? "completed-line" : "upcoming-line"}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
