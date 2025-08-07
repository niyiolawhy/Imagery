"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
import { Camera, Eye, EyeOff, User, Calendar, Upload, X } from "lucide-react";
import { useUploadData } from "@/hooks/use-api";
import { SignupSchema } from "@/schemas/signup";
import { SignupFormValues } from "@/types/signup";
import { useRouter } from "next/navigation";

const handleAvatarChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setFieldValue: (field: string, value: any) => void,
  setAvatarPreview: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const file = event.target.files?.[0];
  if (file) {
    setFieldValue("avatarFile", file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
};

const removeAvatar = (
  setFieldValue: (field: string, value: any) => void,
  setAvatarPreview: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setFieldValue("avatarFile", null);
  setAvatarPreview(null);
};

const handleSubmit = async (
  values: SignupFormValues,
  { setSubmitting, resetForm }: any,
  registerMutation: any,
  setAvatarPreview: React.Dispatch<React.SetStateAction<string | null>>,
  router: any
) => {
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);
    formData.append("dob", values.dob);
    if (values.avatarFile) {
      formData.append("avatar", values.avatarFile);
    }
    await registerMutation?.mutateAsync?.(formData);
    resetForm?.();
    setAvatarPreview?.(null);
    router.push("/auth/login");
  } catch (error: any) {
    if (error?.message?.includes("avatar") && values.avatarFile) {
      const formDataWithoutAvatar = new FormData();
      formDataWithoutAvatar.append("name", values.name);
      formDataWithoutAvatar.append("username", values.username);
      formDataWithoutAvatar.append("email", values.email);
      formDataWithoutAvatar.append("password", values.password);
      formDataWithoutAvatar.append("confirmPassword", values.confirmPassword);
      formDataWithoutAvatar.append("dob", values.dob);
      await registerMutation?.mutateAsync?.(formDataWithoutAvatar);
      resetForm?.();
      setAvatarPreview?.(null);
      router.push("/auth/login");
    }
  } finally {
    setSubmitting?.(false);
  }
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const registerMutation = useUploadData("/auth/register");
  const router = useRouter();

  const initialValues: SignupFormValues = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    avatarFile: null,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join Imagery and start organizing your photos beautifully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={(values, actions) =>
              handleSubmit(
                values,
                actions,
                registerMutation,
                setAvatarPreview,
                router
              )
            }
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4 ">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="!text-xs text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="!text-xs text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="!text-xs text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="dob"
                      name="dob"
                      type="date"
                      className="pl-10"
                    />
                  </div>
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="!text-xs text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarFile">Upload Profile Picture</Label>
                  <div className="space-y-3">
                    {avatarPreview ? (
                      <div className="relative">
                        <img
                          src={avatarPreview}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() =>
                            removeAvatar(setFieldValue, setAvatarPreview)
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="avatarFile"
                          name="avatarFile"
                          type="file"
                          accept="image/*"
                          className="pl-10 cursor-pointer"
                          onChange={(e) =>
                            handleAvatarChange(
                              e,
                              setFieldValue,
                              setAvatarPreview
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                  <ErrorMessage
                    name="avatarFile"
                    component="div"
                    className="!text-xs text-red-500"
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
                      placeholder="Create a password"
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
                    className="!text-xs text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="!text-xs text-red-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isSubmitting || registerMutation.isPending}
                >
                  {isSubmitting || registerMutation.isPending
                    ? "Creating account..."
                    : "Create Account"}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-purple-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
