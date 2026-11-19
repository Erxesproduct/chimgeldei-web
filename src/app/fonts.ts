import { Climate_Crisis, Science_Gothic, Ubuntu_Sans } from "next/font/google";

// All three have Ө ө Ү ү (checked in the Google Fonts cmap).
/** Comic headlines: condensed, heavy, slanted (variable width / slant axes). */
export const display = Science_Gothic({ subsets: ["latin", "cyrillic", "cyrillic-ext"], axes: ["wdth", "slnt"], variable: "--font-display", display: "swap" });
/** Body text. */
export const body = Ubuntu_Sans({ subsets: ["latin", "cyrillic", "cyrillic-ext"], variable: "--font-body", display: "swap" });
/** One-word «POW» moments only. */
export const mega = Climate_Crisis({ subsets: ["latin", "cyrillic", "cyrillic-ext"], variable: "--font-mega", display: "swap" });
