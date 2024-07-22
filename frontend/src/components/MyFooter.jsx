import { Footer, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";

export default function MyFooter() {
  return (
    <Footer className="bg-[#153448] dark:bg-black">
        <div className="container mx-auto py-4 px-5 flex flex-col sm:flex-row justify-between items-center">
          <FooterCopyright href="#" by="The Blog App" year={2022} />
          <FooterLinkGroup className="flex space-x-4 mt-4 sm:mt-0">
            <FooterLink href="#">About</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Licensing</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </FooterLinkGroup>
        </div>
      </Footer>
  );
}