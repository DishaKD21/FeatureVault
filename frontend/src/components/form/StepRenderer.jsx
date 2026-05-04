"use client";

import RequirementStep from "./steps/RequirementStep";
import FeatureStep from "./steps/FeatureStep";
import DiagramStep from "./steps/DiagramStep";
import EstimateStep from "./steps/EstimateStep";
import TrackingStep from "./steps/TrackingStep";
import RetrospectiveStep from "./steps/RetrospectiveStep";
import CreatorStep from "./steps/CreatorStep";
import ReviewStep from "./steps/ReviewStep";

export default function StepRenderer({ currentStep, formProps, stepProps }) {
  switch (currentStep) {
    case 0:
      return <RequirementStep {...formProps} disabled={stepProps.isLocked} />;
    case 1:
      return <FeatureStep {...formProps} disabled={stepProps.isLocked} />;
    case 2:
      return <DiagramStep {...stepProps} disabled={stepProps.isLocked} />;
    case 3:
      return <EstimateStep {...stepProps} />;
    case 4:
      return <TrackingStep {...stepProps} disabled={stepProps.isLocked} />;
    case 5:
      return <RetrospectiveStep {...stepProps} />;
    case 6:
      return <CreatorStep register={formProps.register} disabled={stepProps.isLocked} />;
    case 7:
      return <ReviewStep {...stepProps} />;
    default:
      return null;
  }
}
