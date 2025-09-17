'use client';

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={
          <div className="flex justify-center items-center p-8">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}