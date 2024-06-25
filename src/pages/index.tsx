import GeneralLayout from "@/layout/GeneralLayout";
import Slider from "./(home-page)/components/Slider";
import Categories from "./(home-page)/components/Categories";
import Services from "./(home-page)/components/Services";
import ProductsList from "./(home-page)/components/ProductsList";
import Banner from "./(home-page)/components/Banner";
import { ReactNode } from "react";

// const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  return (
    <>
      <Slider></Slider>
      <Categories></Categories>
      <Services></Services>
      <ProductsList></ProductsList>
      <Banner></Banner>
    </>
  );
}

Home.authGuard = false;
Home.getLayout = (page: ReactNode) => <GeneralLayout>{page}</GeneralLayout>;
