import React, { type ReactNode } from "react";
import styles from "./StepBlock.module.scss";
import ContentInner from "../../../layouts/MainLayout/ContentInner/ContentInner";
import { Typography } from "antd";

interface StepBlockProps {
  currentStep: number;
  step: number;
  children: ReactNode;
}

const StepBlock: React.FC<StepBlockProps> = ({
  currentStep,
  step,
  children,
}) => {
  return (
    <div className={currentStep !== step ? styles.hidden : styles.visible}>
      <Typography.Title level={5}>
        {step === 1
          ? "Step 1: General Information"
          : "Step 2: Condition & Application"}
      </Typography.Title>
      <ContentInner>{children}</ContentInner>
    </div>
  );
};

export default StepBlock;
