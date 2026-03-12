import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full text-gray-400 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center space-y-3">
        {/* Legal Links (First Line) */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-[11px]">
          <Link
            href="https://aeroselect.io/dataprotection/"
            className="hover:text-black transition"
          >
            Privacy Policy
          </Link>

          <Link
            href="https://aeroselect.io/gtc-b2c//"
            className="hover:text-black transition"
          >
            GTC B2C
          </Link>

          <Link
            href="https://aeroselect.io/gdpa/"
            className="hover:text-black transition"
          >
            GDPA
          </Link>
        </div>

        {/* Copyright (Second Line) */}
        <p className="text-[11px] leading-relaxed">
          © 2026 AeroSelect. TalentHub & AeroHire are trademarks of AeroSelect.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}