import { Typography } from "@material-tailwind/react";
const links = ["Company", "About Us", "Team", "Products", "Blog", "Pricing"];
const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="px-8 py-8 space-grotesk-uniquifier ">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex flex-wrap items-center justify-center gap-6 pb-1">
          {links.map((link, index) => (
            <ul key={index}>
              <li>
                <Typography
                  as="a"
                  href="#"
                  color="white"
                  className="font-medium !text-pink-600 transition-colors hover:!text-pink-900"
                >
                  {link}
                </Typography>
              </li>
            </ul>
          ))}
        </div>
        <Typography
          color="blue-gray"
          className="mt-6 !text-sm !font-normal text-pink-600"
        >
          Copyright &copy; {currentYear} CodeCoven
        </Typography>
      </div>
    </footer>
  );
}
export default Footer;