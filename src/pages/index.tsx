import GeneralLayout from "@/layout/GeneralLayout";
import Slider from "./(home-page)/components/Slider";
import Categories from "./(home-page)/components/Categories";
import Services from "./(home-page)/components/Services";
import ProductsList from "./(home-page)/components/ProductsList";
import Banner from "./(home-page)/components/Banner";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <GeneralLayout>
      <Slider></Slider>
      <Categories></Categories>
      <Services></Services>
      <ProductsList></ProductsList>
      <Banner></Banner>
    </GeneralLayout>
  );
}

Home.authGuard = false;
