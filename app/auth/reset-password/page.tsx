"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import Link from "next/link";
import { usePostData } from "@/hooks/use-api";
import { useSearchParams } from "next/navigation";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .required("Password is required"),
});

interface ResetPasswordFormValues {
  token: string;
  password: string;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!token) {
      setTokenError("Invalid or missing token. Please check your reset link.");
    }
    setLoading(false);
  }, [token]);

  const resetPasswordMutation = usePostData("/auth/reset-password");

  const handleSubmit = async (
    values: { password: string },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      await resetPasswordMutation.mutateAsync({ token, password: values.password });
      toast.success("Password reset successful! You can now log in.");
      setResetSuccess(true);
      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-semibold">{tokenError}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetSuccess ? (
            <div className="text-center space-y-4">
              <p className="text-green-600 font-semibold">Your password has been reset successfully!</p>
              <Link href="/auth/login" className="text-purple-600 hover:underline">
                Go to Login
              </Link>
            </div>
          ) : (
            <Formik
              initialValues={{ password: "" }}
              validationSchema={ResetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your new password"
                      required
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-500 mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </CardContent>
      </Card>
    </div>
  );
}