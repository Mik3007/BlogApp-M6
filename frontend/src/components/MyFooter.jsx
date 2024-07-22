import { Footer, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";

export default function MyFooter() {
  return (
    <Footer className="bg-[#153448] dark:bg-black h-24">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center h-full px-4">
        <FooterCopyright href="#" by="The Blog App" year={2022} />
        <FooterLinkGroup className="flex mb-2 md:space-y-0 md:space-x-4">
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Licensing</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterLinkGroup>
      </div>
    </Footer>
  );
}
