import { Footer, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";

export default function MyFooter() {
  return (
    <Footer className="fixed bottom-0 left-0 z-20 w-full bg-[#153448] dark:bg-black h-24">
      <FooterCopyright href="#" by="The Blog App" year={2022} />
      <FooterLinkGroup>
        <FooterLink href="#">About</FooterLink>
        <FooterLink href="#">Privacy Policy</FooterLink>
        <FooterLink href="#">Licensing</FooterLink>
        <FooterLink href="#">Contact</FooterLink>
      </FooterLinkGroup>
    </Footer>
  );
}