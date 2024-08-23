import Image from "next/image";
import ResumeAnalyzerApp from "./components/ResumeAnalyzerApp";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ResumeAnalyzerApp />
    </main>
  );
}
