"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react"; // Added import for React
import { toast } from "sonner";

interface EditCredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentialType: "display_name" | "email" | "password" | null;
  onSubmit: (value: string) => Promise<void>;
}

export function EditCredentialDialog({
  open,
  onOpenChange,
  credentialType,
  onSubmit,
}: EditCredentialDialogProps) {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(value);
      if (credentialType === "email") {
        toast.success(`Please confirm the change email process first`);
      }
      toast.success(`${credentialType} updated successfully.`);
      setValue("");
      onOpenChange(false);
    } catch (error) {
      toast.success(`Failed to update ${credentialType}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {credentialType}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type={credentialType === "password" ? "text" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter new ${
              credentialType === "display_name"
                ? "Display Name"
                : credentialType
            }`}
            className="mb-4"
          />
          <Button
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-xl h-12 font-medium shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
