import React from "react";
import Svg, { Path, Circle, Ellipse, Rect, Line, G } from "react-native-svg";

type P = { size?: number; selected?: boolean };
type IconFn = (props: P) => React.JSX.Element;

const col = (s?: boolean) => (s ? "#fffff0" : "#0E16FF");
const W = 1.8;

// ── 01. Ear ───────────────────────────────────────────────────────────────────
const Ear: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M22 12C22 6.48 18.52 2 14 2C9.48 2 6 6.48 6 12C6 16 8.5 18.5 8.5 22V25C8.5 26.66 9.84 28 11.5 28H16C17.66 28 19 26.66 19 25V22C19 18.5 22 16 22 12Z"
        stroke={c} strokeWidth={W} strokeLinejoin="round"
      />
      <Path
        d="M14 6C11.5 6 9.5 8.5 9.5 11C9.5 13 11 14 11 16"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Path d="M11 16C11 17.5 12.5 18 13 18" stroke={c} strokeWidth={W} strokeLinecap="round" />
    </Svg>
  );
};

// ── 02. Nose ──────────────────────────────────────────────────────────────────
const Nose: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 4C16 4 16 18 16 20C16 23 13 25 10 25C7.5 25 6 23.5 6 22C6 20.5 7 20 8.5 20"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Path
        d="M16 20C16 23 19 25 22 25C24.5 25 26 23.5 26 22C26 20.5 25 20 23.5 20"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Ellipse cx="10" cy="22.5" rx="3.5" ry="2.5" stroke={c} strokeWidth={W} />
      <Ellipse cx="22" cy="22.5" rx="3.5" ry="2.5" stroke={c} strokeWidth={W} />
    </Svg>
  );
};

// ── 03. Head ──────────────────────────────────────────────────────────────────
const Head: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 3C9.37 3 4 8.37 4 15C4 19.5 6.5 23.5 10.5 25.5V30H21.5V25.5C25.5 23.5 28 19.5 28 15C28 8.37 22.63 3 16 3Z"
        stroke={c} strokeWidth={W} strokeLinejoin="round"
      />
      <Line x1="12" y1="30" x2="20" y2="30" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Line x1="16" y1="3" x2="16" y2="7" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Circle cx="12" cy="16" r="1.5" fill={c} />
      <Circle cx="20" cy="16" r="1.5" fill={c} />
    </Svg>
  );
};

// ── 04. Mouth ─────────────────────────────────────────────────────────────────
const Mouth: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M4 14C7 9 11 7 16 7C21 7 25 9 28 14"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Path
        d="M9 10C11 8 13 8 16 10C19 8 21 8 23 10"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Path
        d="M4 14C7 21 11 25 16 25C21 25 25 21 28 14"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Path
        d="M9 14C11 16 13 17 16 17C19 17 21 16 23 14"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
    </Svg>
  );
};

// ── 05. Neck ──────────────────────────────────────────────────────────────────
const Neck: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M11 4C8 5 6 7 6 10L6 28" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Path d="M21 4C24 5 26 7 26 10L26 28" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Rect x="13" y="8"  width="6" height="4" rx="2" stroke={c} strokeWidth={W} />
      <Rect x="13" y="14" width="6" height="4" rx="2" stroke={c} strokeWidth={W} />
      <Rect x="13" y="20" width="6" height="4" rx="2" stroke={c} strokeWidth={W} />
    </Svg>
  );
};

// ── 06. Lung and Trachea ──────────────────────────────────────────────────────
const LungTrachea: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Line x1="16" y1="3" x2="16" y2="10" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Path d="M16 10L10 13" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Path d="M16 10L22 13" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Path
        d="M10 13C7 14 5 17 5 21C5 25 8 28 12 28C14 28 16 26 16 24V12"
        stroke={c} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M22 13C25 14 27 17 27 21C27 25 24 28 20 28C18 28 16 26 16 24V12"
        stroke={c} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
};

// ── 07. Heart ─────────────────────────────────────────────────────────────────
const Heart: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 27C16 27 4 19 4 11C4 7.13 7.13 4 11 4C13 4 15 5 16 7C17 5 19 4 21 4C24.87 4 28 7.13 28 11C28 19 16 27 16 27Z"
        stroke={c} strokeWidth={W} strokeLinejoin="round"
      />
      <Path
        d="M8 15H11L13 11L16 19L18 15H24"
        stroke={c} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
};

// ── 08. Gastrointestinal Tract ────────────────────────────────────────────────
const GITract: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M9 4C6 4 4 7 4 10C4 13.5 7 15 10 15H22C24.5 15 27 13 27 10C27 7 24.5 4 22 4H16"
        stroke={c} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M22 15C25 16 27 18 27 22C27 25 24 28 20 28C17 28 15 26 15 24V20"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Path
        d="M15 20C15 22 13 24 10 24C7 24 5 22 5 19C5 16 7 15 10 15"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Path d="M20 28L20 30" stroke={c} strokeWidth={W} strokeLinecap="round" />
    </Svg>
  );
};

// ── 09. Brain - Spinal ────────────────────────────────────────────────────────
const BrainSpinal: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 4C11 4 7 8 7 13C7 16 8.5 18.5 11 20C12 20.5 12 21.5 11 22H14C14 21 15 20.5 16 20.5C17 20.5 18 21 18 22H21C20 21.5 20 20.5 21 20C23.5 18.5 25 16 25 13C25 8 21 4 16 4Z"
        stroke={c} strokeWidth={W} strokeLinejoin="round"
      />
      <Line x1="16" y1="22" x2="16" y2="30" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Line x1="13" y1="25" x2="19" y2="25" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Line x1="13" y1="28" x2="19" y2="28" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Path d="M10 10C9 11.5 9 14 10.5 15.5" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Path d="M22 10C23 11.5 23 14 21.5 15.5" stroke={c} strokeWidth={W} strokeLinecap="round" />
    </Svg>
  );
};

// ── 10. Kidney ────────────────────────────────────────────────────────────────
const Kidney: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M18 3C12.5 3 8 7.5 8 14C8 20.5 12 28 18 28C21 28 23 26 23 23C23 20 21 18.5 21 16C21 13.5 23 12 23 9C23 5.7 20.8 3 18 3Z"
        stroke={c} strokeWidth={W} strokeLinejoin="round"
      />
      <Path
        d="M18 10C17 11.5 17 13 18 14.5C17 16 17 18 18 19.5"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
    </Svg>
  );
};

// ── 11. Skin ──────────────────────────────────────────────────────────────────
const Skin: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M4 9C4 9 8 7 12 9C16 11 20 9 28 9"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Rect x="4" y="10" width="24" height="6" rx="1" stroke={c} strokeWidth={W} />
      <Rect x="4" y="17" width="24" height="6" rx="1" stroke={c} strokeWidth={W} />
      <Line x1="10" y1="7" x2="10" y2="10" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Line x1="18" y1="6" x2="18" y2="10" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Circle cx="10" cy="20" r="1.5" fill={c} />
    </Svg>
  );
};

// ── 12. Bone ──────────────────────────────────────────────────────────────────
const Bone: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M10 8L22 22"
        stroke={c} strokeWidth={3.5} strokeLinecap="round"
      />
      <Circle cx="8" cy="6"  r="4" stroke={c} strokeWidth={W} />
      <Circle cx="24" cy="6"  r="3" stroke={c} strokeWidth={W} />
      <Circle cx="8" cy="24"  r="3" stroke={c} strokeWidth={W} />
      <Circle cx="24" cy="24" r="4" stroke={c} strokeWidth={W} />
    </Svg>
  );
};

// ── 13. Breast ────────────────────────────────────────────────────────────────
const Breast: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M4 22C4 16 8 9 16 9C24 9 28 16 28 22"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Path
        d="M4 22C4 26 7 29 11 29C14 29 16 27 16 24C16 27 18 29 21 29C25 29 28 26 28 22"
        stroke={c} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round"
      />
      <Circle cx="11" cy="20" r="2" stroke={c} strokeWidth={W} />
      <Circle cx="21" cy="20" r="2" stroke={c} strokeWidth={W} />
    </Svg>
  );
};

// ── 14. Bladder ───────────────────────────────────────────────────────────────
const Bladder: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 5C9.37 5 5 10 5 17C5 23 9.5 28 16 28C22.5 28 27 23 27 17C27 10 22.63 5 16 5Z"
        stroke={c} strokeWidth={W} strokeLinejoin="round"
      />
      <Path
        d="M13 4L13 2M19 4L19 2"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
      <Line x1="13" y1="2" x2="19" y2="2" stroke={c} strokeWidth={W} strokeLinecap="round" />
      <Path
        d="M11 17C11 19.5 13 21.5 16 21.5C19 21.5 21 19.5 21 17"
        stroke={c} strokeWidth={W} strokeLinecap="round"
      />
    </Svg>
  );
};

// ── 15. Eye ───────────────────────────────────────────────────────────────────
const Eye: IconFn = ({ size = 32, selected }) => {
  const c = col(selected);
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M3 16C3 16 8 8 16 8C24 8 29 16 29 16C29 16 24 24 16 24C8 24 3 16 3 16Z"
        stroke={c} strokeWidth={W} strokeLinejoin="round"
      />
      <Circle cx="16" cy="16" r="5" stroke={c} strokeWidth={W} />
      <Circle cx="16" cy="16" r="2.5" fill={c} />
      <Circle cx="14.5" cy="14.5" r="0.8" fill={selected ? "#0E16FF" : "#fffff0"} />
    </Svg>
  );
};

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, IconFn> = {
  "Ear": Ear,
  "Nose": Nose,
  "Head": Head,
  "Mouth": Mouth,
  "Neck": Neck,
  "Lung and Trachea (Respiratory)": LungTrachea,
  "Heart (Cardiovascular)": Heart,
  "Gastrointestinal Tract (Gastrointestinal)": GITract,
  "Brain - Spinal (Neurology)": BrainSpinal,
  "Kidney (Renal)": Kidney,
  "Skin (Dermatology)": Skin,
  "Bone (Osteology)": Bone,
  "Breast (Mamo)": Breast,
  "Bladder (Urology)": Bladder,
  "Eye (Ophthalmology)": Eye,
};

// Text-only specialties — return null so cards render text-only layout
const TEXT_ONLY = new Set([
  "Endocrine",
  "Mental Health",
  "Physiotherapy",
  "Pain",
  "Fever",
  "Others",
]);

interface SpecialtyIconProps {
  name: string;
  size?: number;
  selected?: boolean;
}

const SpecialtyIcon: React.FC<SpecialtyIconProps> = ({ name, size = 32, selected = false }) => {
  if (TEXT_ONLY.has(name)) return null;
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} selected={selected} />;
};

export { TEXT_ONLY };
export default SpecialtyIcon;
