"use client"

import type React from "react"

import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Mail } from "lucide-react"
import toast from "react-hot-toast";
import { usePostData } from "@/hooks/use-api";

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const initialValues: ForgotPasswordFormValues = {
    email: "",
  };

  const forgotPasswordMutation = usePostData("/auth/forgot-password");

  const handleSubmit = async (
    values: ForgotPasswordFormValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      await forgotPasswordMutation.mutateAsync({ email: values.email });
      toast.success("Password reset email sent! Check your inbox.");
      resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-purple-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-purple-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 