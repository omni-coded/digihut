import Hero from '../sections/Hero';
import Services from '../sections/Services';
import Industries from '../sections/Industries';
import WhyUs from '../sections/WhyUs';
import Process from '../sections/Process';
import Portfolio from '../sections/Portfolio';
import Pricing from '../sections/Pricing';
import Audit from '../sections/Audit';
import About from '../sections/About';
import Contact from '../sections/Contact';
import FAQ from '../sections/FAQ';
import Tools from '../sections/Tools';
import ShopBand from '../sections/ShopBand';
import useReveal from '../hooks/useReveal';

export default function Home() {
  useReveal();
  return (
    <>
      <Hero />
      <Services />
      <Industries />
      <ShopBand />
      <WhyUs />
      <Process />
      <Portfolio />
      <Pricing />
      <Audit />
      <Tools />
      <About />
      <Contact />
      <FAQ />
    </>
  );
}
