"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";
import { useResendOtp, useVerifyOtp } from "@/Hooks/api/auth_api";
import { AuthMailSVG } from "@/Components/Svg/SvgContainer";

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const handleResend = () => {
    if (!email || secondsLeft > 0) return;

    resendOtp({ email });

    setSecondsLeft(37); // reset timer after resend
  };
  const OTP_LENGTH = 5;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(37);

  // Redirect if email missing
  useEffect(() => {
    if (!email) {
      router.replace("/auth/register");
    }
  }, [email, router]);

  // Timer
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (sec: number) => {
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(sec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updatedOtp = [...otp];
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.split("").slice(0, OTP_LENGTH);
    const updatedOtp = Array(OTP_LENGTH).fill("");

    digits.forEach((d, i) => {
      updatedOtp[i] = d;
    });

    setOtp(updatedOtp);
    inputsRef.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const otpValue = otp.join("");
  const isComplete = otpValue.length === OTP_LENGTH && !otp.includes("");

  const handleVerify = () => {
    if (!email || !isComplete) return;

    verifyOtp({
      email,
      otp: Number(otpValue), // 🔥 Convert to number (important!)
    });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white px-5 pb-6 pt-6 rounded-2xl w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className="
      flex p-4 items-start gap-4 rounded-[96px]
      border border-transparent
      bg-[linear-gradient(180deg,rgba(23,34,95,0.48)_0%,rgba(23,34,95,0.23)_52.08%,rgba(23,34,95,0.00)_100%,#FFF_100%)]
      bg-origin-border
      bg-clip-padding
    "
            style={{
              backgroundImage: `
        linear-gradient(180deg, rgba(23,34,95,0.48) 0%, rgba(23,34,95,0.23) 52.08%, rgba(23,34,95,0.00) 100%, #FFF 100%),
        linear-gradient(180deg, rgba(23,34,95,0.48) 0%, rgba(23,34,95,0.23) 52.08%, rgba(23,34,95,0.00) 100%, #FFF 100%)
      `,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <div className="flex p-[14px] justify-center items-center gap-[14px] rounded-[96px] border border-[#C9D6F7]/97 bg-white shadow-[0_2px_4px_0_rgba(179,212,253,0.04)]">
              <AuthMailSVG />
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-semibold">
          OTP Verification
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          We have sent a verification code to
          <br />
          <span className="font-medium text-gray-700">{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="mt-8 flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              maxLength={1}
              inputMode="numeric"
              className="h-14 w-14 rounded-xl border border-[#DFE1E7] text-center text-lg font-semibold outline-none focus:border-[#17225f]"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="button"
          disabled={!isComplete || isPending}
          onClick={handleVerify}
          className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition ${
            isComplete && !isPending
              ? "bg-[#17225F] text-white hover:opacity-90"
              : "bg-[#DCE0F2] text-white cursor-not-allowed"
          }`}
        >
          {isPending ? "Verifying..." : "Verify"}
        </button>

        <div className="mt-6 text-center text-sm">
          {secondsLeft > 0 ? (
            <p className="text-gray-500">
              Resend code in
              <span className="font-medium text-[#17225f]">
                {formatTime(secondsLeft)}
              </span>
            </p>
          ) : (
            <button
              type="button"
              disabled={isResending}
              onClick={handleResend}
              className="font-medium text-[#17225f] hover:underline disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
