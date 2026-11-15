import Hero from "@/components/home/Hero";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/toast";

export default function Page() {
  return (
    <>
    <Toaster/>
      <Navbar />
      <Hero />
    </>
  );
}
