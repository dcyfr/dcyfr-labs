"use client";

import { InteractiveDecisionTree } from "@/components/dev";
import type { ComponentProps } from "react";

type InteractiveDecisionTreeProps = ComponentProps<typeof InteractiveDecisionTree>;

interface DecisionTreeClientProps {
  layoutDecisionTree: InteractiveDecisionTreeProps;
  metadataDecisionTree: InteractiveDecisionTreeProps;
  containerDecisionTree: InteractiveDecisionTreeProps;
}

export function DecisionTreeClient({
  layoutDecisionTree,
  metadataDecisionTree,
  containerDecisionTree,
}: DecisionTreeClientProps) {
  return (
    <>
      <InteractiveDecisionTree {...layoutDecisionTree} />
      <InteractiveDecisionTree {...metadataDecisionTree} />
      <InteractiveDecisionTree {...containerDecisionTree} />
    </>
  );
}
