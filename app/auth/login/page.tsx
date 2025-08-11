"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik";
import { usePostData } from "@/hooks/use-api";
import { LoginSchema } from "@/schemas/login";
import { LoginFormValues } from "@/types/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const handleSubmit = async (
  values: LoginFormValues,
  { setSubmitting }: any,
  loginMutation: any,
  router: any,
  updateTokens: any,
  login: any
) => {
  try {
    const res = await loginMutation?.mutateAsync?.(values);

    if (res.data?.token && res.data?.refreshToken) {
      updateTokens(res.data.token, res.data.refreshToken);
      login(values.username, values.password);

      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      toast.error("Invalid response from server");
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Login failed");
  } finally {
    setSubmitting?.(false);
  }
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = usePostData("/auth/login");
  const router = useRouter();
  const { updateTokens, login } = useAuth();

  const initialValues: LoginFormValues = {
    username: "",
    password: "",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your Imagery account to access your albums
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={(values, actions) =>
              handleSubmit(
                values,
                actions,
                loginMutation,
                router,
                updateTokens,
                login
              )
            }
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Field
                    as={Input}
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                  <div className="text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isSubmitting || loginMutation.isPending}
                >
                  {isSubmitting || loginMutation.isPending
                    ? "Signing in..."
                    : "Sign In"}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
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
