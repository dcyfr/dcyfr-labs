"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Copy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toastSuccess } from "@/lib/toast";
import { SPACING, TYPOGRAPHY } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface DecisionNode {
  id: string;
  question: string;
  options: Array<{
    label: string;
    next: string | null; // null means end node
    result?: {
      title: string;
      description: string;
      code: string;
      usage: string;
    };
  }>;
}

interface DecisionTreeProps {
  title: string;
  description: string;
  nodes: DecisionNode[];
  startNodeId: string;
}

/**
 * Interactive Decision Tree Component
 * 
 * Guides users through architectural decisions with clickable nodes
 * and live code examples. Used in /dev/docs for layout, metadata,
 * and component pattern decisions.
 */
export function InteractiveDecisionTree({
  title,
  description,
  nodes,
  startNodeId,
}: DecisionTreeProps) {
  const [currentNodeId, setCurrentNodeId] = React.useState(startNodeId);
  const [history, setHistory] = React.useState<string[]>([startNodeId]);
  const [result, setResult] = React.useState<DecisionNode["options"][0]["result"] | null>(null);
  const [copiedCode, setCopiedCode] = React.useState(false);

  const currentNode = nodes.find((n) => n.id === currentNodeId);

  const handleOptionClick = (option: DecisionNode["options"][0]) => {
    if (option.next) {
      setHistory([...history, option.next]);
      setCurrentNodeId(option.next);
      setResult(null);
    } else if (option.result) {
      setResult(option.result);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentNodeId(newHistory[newHistory.length - 1]);
      setResult(null);
    }
  };

  const handleReset = () => {
    setHistory([startNodeId]);
    setCurrentNodeId(startNodeId);
    setResult(null);
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      toastSuccess("Code copied to clipboard");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!currentNode && !result) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Decision tree not found</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", SPACING.content)}>
      {/* Header */}
      <div>
        <h2 className={TYPOGRAPHY.h2.standard}>{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      {/* Progress breadcrumbs */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        {history.map((nodeId, idx) => {
          const node = nodes.find((n) => n.id === nodeId);
          return (
            <React.Fragment key={nodeId}>
              <button
                onClick={() => {
                  const newHistory = history.slice(0, idx + 1);
                  setHistory(newHistory);
                  setCurrentNodeId(nodeId);
                  setResult(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {node?.question.split("?")[0]}
              </button>
              {idx < history.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current question */}
      {currentNode && !result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4">
            <h3 className={cn(TYPOGRAPHY.h3.standard, "mb-4")}>
              {currentNode.question}
            </h3>
            <div className="grid gap-3">
              {currentNode.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="lg"
                  className="justify-start text-left h-auto py-4 hover:bg-accent hover:border-primary transition-colors"
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-2 shrink-0" />
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 border-primary">
            <div className={cn("flex items-start gap-3 mb-4")}>
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", "bg-primary/10")}>
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className={TYPOGRAPHY.h3.standard}>{result.title}</h3>
                <p className="text-muted-foreground mt-1">{result.description}</p>
              </div>
            </div>

            {/* Usage example */}
            <div className="mb-4">
              <h4 className={cn(TYPOGRAPHY.label.small, "mb-2")}>Usage:</h4>
              <p className="text-sm text-muted-foreground">{result.usage}</p>
            </div>

            {/* Code example */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h4 className={TYPOGRAPHY.label.small}>Code Example:</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(result.code)}
                  className="h-8"
                >
                  {copiedCode ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copiedCode ? "Copied!" : "Copy"}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{result.code}</code>
              </pre>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {history.length > 1 && (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        )}
        {(history.length > 1 || result) && (
          <Button variant="outline" onClick={handleReset}>
            Start Over
          </Button>
        )}
      </div>
    </div>
  );
}
