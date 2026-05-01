"use client";

import { useEffect, useState } from "react";

function getRemaining(target: string) {
  const end = new Date(target).getTime();
  const diff = Math.max(0, end - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, expired: diff <= 0 };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function FlashCountdown({ endsAt }: { endsAt: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(endsAt));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(endsAt)), 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  if (remaining.expired) return <strong>Ended</strong>;

  return (
    <strong>
      Time Left: {remaining.days > 0 ? `${remaining.days}d : ` : ""}
      {pad(remaining.hours)}h : {pad(remaining.minutes)}m : {pad(remaining.seconds)}s
    </strong>
  );
}
