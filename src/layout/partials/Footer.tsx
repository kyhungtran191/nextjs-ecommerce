import React from "react";
export default function Footer() {
  return (
    <footer className="pb-20 bg-[#383633]">
      <div className=" pt-20 px-10 grid grid-cols-4 gap-10 text-[#f7eed8] items-start justify-items-center">
        <div>
          <div className="font-bold">Shopping Services</div>
          <ul className="text-sm ">
            <li className="py-2">Schedule Consultation</li>
            <li className="py-2">Showrooms</li>
            <li className="py-2">Trade Program</li>
            <li className="py-2">Outlet</li>
          </ul>
        </div>

        <div>
          <div className="font-bold">About</div>
          <ul className="text-sm ">
            <li className="py-2">Our Story</li>
            <li className="py-2">Reviews</li>
            <li className="py-2">Financing</li>
            <li className="py-2">Patents</li>
            <li className="py-2">Our Blog</li>
          </ul>
        </div>

        <div>
          <div className="font-bold">Resources</div>
          <ul className="text-sm ">
            <li className="py-2">Look Up Order Status</li>
            <li className="py-2">Assembly Instructions</li>
            <li className="py-2">Returns</li>
            <li className="py-2">Shipping & Delivery</li>
            <li className="py-2">FAQ</li>
          </ul>
        </div>
        <div>
          <div className="font-bold">Contact Customer Experience</div>
          <ul className="text-sm ">
            <li className="py-2">Email: support@burrow.com</li>
            <li className="py-2">Hours:</li>
            <li className="py-2">Monday to Friday — 10a to 6p EST</li>
            <li className="py-2">Saturday to Sunday — 10a to 2p EST</li>
          </ul>
        </div>
      </div>
      <div className="container text-center mt-10 text-[#f7eed8] text-xs">
        © 2024 Burrow Terms Accessibility Sitemap Privacy
        <br />
        Do not sell my personal informationThis site may collect, use and
        disclose personal information.
        <br /> Please refer to our Privacy Policy for more information.
      </div>
    </footer>
  );
}
