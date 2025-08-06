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
import {
  Camera,
  Eye,
  EyeOff,
  User,
  Calendar,
  Image,
  Upload,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { usePostData, useUploadData } from "@/hooks/use-api";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  dob: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  avatarFile: Yup.mixed()
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return true;
      return (value as File).size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        (value as File).type
      );
    })
    .optional(),
});

interface SignupFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob: string;
  avatarFile?: File | null;
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const registerMutation = useUploadData("/auth/register");

  const initialValues: SignupFormValues = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    avatarFile: null,
  };

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
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

  const removeAvatar = (setFieldValue: (field: string, value: any) => void) => {
    setFieldValue("avatarFile", null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting, resetForm }: any
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

      await registerMutation.mutateAsync(formData);
      resetForm();
      setAvatarPreview(null);
      window.location.href = "/auth/login";
    } catch (error: any) {
      if (error.message?.includes("avatar") && values.avatarFile) {
        const formDataWithoutAvatar = new FormData();
        formDataWithoutAvatar.append("name", values.name);
        formDataWithoutAvatar.append("username", values.username);
        formDataWithoutAvatar.append("email", values.email);
        formDataWithoutAvatar.append("password", values.password);
        formDataWithoutAvatar.append("confirmPassword", values.confirmPassword);
        formDataWithoutAvatar.append("dob", values.dob);

        await registerMutation.mutateAsync(formDataWithoutAvatar);

        resetForm();
        setAvatarPreview(null);
        window.location.href = "/auth/login";
      }
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
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join Imagery and start organizing your photos beautifully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
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
                          onClick={() => removeAvatar(setFieldValue)}
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
                          onChange={(e) => handleAvatarChange(e, setFieldValue)}
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
