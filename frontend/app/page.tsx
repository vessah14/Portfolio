import Hero from "./components/Hero";
import Container from "@/about/page";
import ContactLinks from "./components/ContactLinks";

export default function Home() {
  return (
    <div>
      <Hero />
      <Container/>
      <ContactLinks />
    </div>
  );
}
