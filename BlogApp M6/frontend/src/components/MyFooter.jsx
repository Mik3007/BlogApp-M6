import { Footer, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";

export default function MyFooter() {
  return (
    <Footer className="bg-[#153448] h-28 dark:bg-black" container>
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