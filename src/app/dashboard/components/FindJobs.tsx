"use client";

import { FaAngleDown } from "react-icons/fa";
import { useMemo, useRef, useState, useEffect } from "react";

function useOutsideClick(ref: any, callback: any) {
  useEffect(() => {
    const handleClick = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}

function Dropdown({ label, value, items, onChange }: any) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<any>(null);

  useOutsideClick(boxRef, () => setOpen(false));

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex min-w-35 items-center justify-between gap-2 rounded-lg border border-[#DFE1E7] bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
      >
        <span>{value ? value : label}</span>
        <span className="text-gray-500">
          <FaAngleDown />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#DFE1E7] bg-white shadow-lg">
          {items.map((item: any) => (
            <button
              key={item.value}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-sm text-gray-800 transition hover:bg-gray-100 ${
                value === item.value ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>

              {value === item.value && (
                <span className="font-bold text-[#0E2B8B]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
