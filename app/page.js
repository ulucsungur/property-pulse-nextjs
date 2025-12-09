import Hero from '@/components/Hero';
import InfoBoxes from '@/components/InfoBoxes';
import HomeProperties from '@/components/HomeProperties';

const HomePage = () => {
  console.log(process.env.MONGODB_URI);//mongodb bağlantısını test etmek için

  return (<>
    <Hero />
    <InfoBoxes />
    <HomeProperties />

  </>);
}

export default HomePage;

