export const dynamic = 'force-dynamic';
import Hero from '@/components/Hero';
import InfoBoxes from '@/components/InfoBoxes';
import HomeProperties from '@/components/HomeProperties';
import FeaturedProperties from '@/components/FeaturedProperties';
import SemanticSearchBox from '@/components/SemanticSearchBox';

const HomePage = () => {
  console.log(process.env.MONGODB_URI);//mongodb bağlantısını test etmek için

  return (<>
    <Hero />
    <SemanticSearchBox />
    <InfoBoxes />
    <FeaturedProperties />
    <HomeProperties />

  </>);
}

export default HomePage;

