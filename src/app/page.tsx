import HeroSky from "@/components/HeroSky";
import ExperienceEarth from "@/components/ExperienceEarth";
import TechUnderground from "@/components/TechUnderground";
import MoltenCore from "@/components/MoltenCore";

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
