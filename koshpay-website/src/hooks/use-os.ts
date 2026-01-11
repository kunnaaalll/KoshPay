"use client";

import { useEffect, useState } from "react";

export type OS = "ios" | "android" | "other" | "undetermined";

export function useOS(): OS {
  const [os, setOs] = useState<OS>("undetermined");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs("ios");
    } else if (/android/.test(userAgent)) {
      setOs("android");
    } else {
      setOs("other");
    }
  }, []);

  return os;
}
