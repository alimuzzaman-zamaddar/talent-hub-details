"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getGeneral, useNotification } from "@/Hooks/api/dashboard_api";

const notificationsData = {
  title: "Notifications",
  subtitle:
    "Manage your notifications to stay informed\nthroughout your job search. You stay in\ncontrol of how and when we keep you\nupdated.",
  items: [
    {
      id: "applicationProgress",
      apiKey: "is_progress_enabled",
      title: "Application Progress",
      desc: "Get notified when your application move forward or require your attention.",
    },
    {
      id: "aeroai",
      apiKey: "is_ai_enabled",
      title: "AeroAI",
      desc: "Get personalised job suggestions selected by AeroAI.",
    },
    {
      id: "newJobPosting",
      apiKey: "is_jobposting_enabled",
      title: "New Job Posting",
      desc: "Get alerts when new relevant jobs become available.",
    },
    {
      id: "savedJobsAlert",
      apiKey: "is_save_job_enabled",
      title: "Saved Jobs Alert",
      desc: "Receive alerts about changes or upcoming deadlines for your saved jobs.",
    },
    // {
    //   id: "profileCvUpdates",
    //   apiKey: "is_profile_update_enabled",
    //   title: "Profile & CV Updates",
    //   desc: "Get reminders when we need more information to improve your job matches.",
    // },
    {
      id: "accountSecurity",
      apiKey: "is_account",
      title: "Account & Security",
      desc: "Receive important updates about your account and security settings.",
    },
  ],
};

function ToggleSwitch({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!value)}
      className={`relative flex h-7 w-12 shrink-0 items-center rounded-full transition cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${value ? "bg-[#0E2B8B]" : "bg-gray-200"}`}
    >
      <span
        className={`absolute h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function NotificationsTab() {
  const { data } = getGeneral();
  const { mutate: saveNotifications, isPending } = useNotification();

  const notificationSetting = data?.data?.candidate?.notification_setting;

  const { watch, setValue, reset } = useForm({
    defaultValues: {
      applicationProgress: true,
      aeroai: true,
      newJobPosting: true,
      savedJobsAlert: true,
      profileCvUpdates: true,
      accountSecurity: true,
    },
  });

  useEffect(() => {
    if (!notificationSetting) return;

    reset({
      applicationProgress: notificationSetting.is_progress_enabled ?? true,
      aeroai: notificationSetting.is_ai_enabled ?? true,
      newJobPosting: notificationSetting.is_jobposting_enabled ?? true,
      savedJobsAlert: notificationSetting.is_save_job_enabled ?? true,
      profileCvUpdates: notificationSetting.is_profile_update_enabled ?? true,
      accountSecurity: notificationSetting.is_account ?? true,
    });
  }, [notificationSetting, reset]);

  const values = watch();

  const handleToggle = (id: string, val: boolean) => {
    setValue(id as any, val);

    const current = { ...values, [id]: val };

    saveNotifications({
      is_progress_enabled: Boolean(current.applicationProgress),
      is_ai_enabled: Boolean(current.aeroai),
      is_jobposting_enabled: Boolean(current.newJobPosting),
      is_save_job_enabled: Boolean(current.savedJobsAlert),
      is_profile_update_enabled: Boolean(current.profileCvUpdates),
      is_account: Boolean(current.accountSecurity),
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h3 className="text-lg font-semibold text-[#0E2B8B]">
            {notificationsData.title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 whitespace-pre-line max-w-sm">
            {notificationsData.subtitle}
          </p>
        </div>

        <div className="space-y-7">
          {notificationsData.items.map(item => {
            const enabled = Boolean(values?.[item.id as keyof typeof values]);

            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-6"
              >
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 max-w-[360px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <ToggleSwitch
                  value={enabled}
                  disabled={isPending}
                  onChange={(val: boolean) => handleToggle(item.id, val)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
