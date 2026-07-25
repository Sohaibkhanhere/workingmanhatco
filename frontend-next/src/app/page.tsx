import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import StatsBar from "@/components/StatsBar";
import CategoryCarousel from "@/components/CategoryCarousel";
import FeaturedProducts from "@/components/FeaturedProducts";
import BuiltForWork from "@/components/BuiltForWork";
import WhyChooseUs from "@/components/WhyChooseUs";
import BrandStory from "@/components/BrandStory";
import GalleryGrid from "@/components/GalleryGrid";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroBanner />
        <StatsBar />
        <CategoryCarousel />
        <FeaturedProducts />
        <BuiltForWork />
        <WhyChooseUs />
        <BrandStory />
        <GalleryGrid />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
