"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { GoCheckCircleFill } from "react-icons/go";
import { Icon } from "@iconify/react/dist/iconify.js";

import { FormInput, FormInputPass, MainBtn } from "../Sign/SignUp";
import { useErrorTost } from "@/app/components/Toast";
import { useAuthStore } from "@/app/stores/authStore";
import OtpModal from "@/app/components/OtpModal/OtpModal";

const SignIn = () => {
  const { signIn, resendCode } = useAuthStore();
  const { showErrorTost, ErrorTostPopup } = useErrorTost();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputErrors, setInputErrors] = useState<{
    email?: string;
    pError?: string;
  }>({});

  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleCodeResendonError = async () => {
    try {
      const result = await resendCode(email);
      if (result) {
        setShowVerifyModal(true);
      }
    } catch (error: any) {
      if (typeof globalThis.window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      showErrorTost({
        message: error.message || "Error resending code.",
        errortext: "Error",
        iconElement: (
          <Icon
            icon="solar:danger-triangle-bold"
            width="20"
            height="20"
            color="#EA3729"
          />
        ),
        className: "errofoundbg",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { email?: string; pError?: string } = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.pError = "Password is required";
    setInputErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await signIn(email, password);
    } catch (error: any) {
      if (error?.code === "UserNotConfirmedException") {
        await handleCodeResendonError();
      } else {
        showErrorTost({
          message: error.message || `Sign in failed`,
          errortext: "Error",
          iconElement: (
            <Icon
              icon="solar:danger-triangle-bold"
              width="20"
              height="20"
              color="#EA3729"
            />
          ),
          className: "errofoundbg",
        });
      }
    }
  };

  return (
    <section className="SignInSec">
      {ErrorTostPopup}
      <div className="leftSignIn"></div>
      <div className="RightSignIn">
        <div className="SignIninner">
          <Form onSubmit={handleSignIn}>
            <div className="TopSignInner">
              <h2>
                Sign in <span>to your account</span>{" "}
              </h2>
              <FormInput
                intype="email"
                inname="email"
                value={email}
                inlabel="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                error={inputErrors.email}
              />

              <FormInputPass
                inPlaceHolder="Enter your password"
                intype="password"
                inname="password"
                value={password}
                inlabel="Password"
                onChange={(e) => setPassword(e.target.value)}
                error={inputErrors.pError}
              />

              <div className="forgtbtn">
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
            </div>
            <div className="Signbtn">
              <MainBtn
                btnicon={<GoCheckCircleFill />}
                btnname="Sign in"
                iconPosition="left"
                onClick={handleSignIn}
              />
              <h6>
                {" "}
                Don’t have an account? <Link href="/signup">Sign up.</Link>
              </h6>
            </div>
          </Form>
        </div>
      </div>
      <OtpModal
        email={email}
        password={password}
        showErrorTost={showErrorTost}
        showVerifyModal={showVerifyModal}
        setShowVerifyModal={setShowVerifyModal}
      />
    </section>
  );
};

export default SignIn;