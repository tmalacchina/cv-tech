import HeroSky from "@/components/HeroSky";
import ExperienceEarth from "@/components/ExperienceEarth";
import dynamic from "next/dynamic";

const TechUnderground = dynamic(() => import("@/components/TechUnderground"), {
  loading: () => <div style={{ minHeight: "100vh" }} />,
});
const MoltenCore = dynamic(() => import("@/components/MoltenCore"), {
  loading: () => <div style={{ minHeight: "100vh" }} />,
});

export default function Home() {
  return (
    <main className="relative bg-black text-white antialiased">
      <HeroSky />
      <ExperienceEarth />
      <TechUnderground />
      <MoltenCore />
    </main>
  );
}
