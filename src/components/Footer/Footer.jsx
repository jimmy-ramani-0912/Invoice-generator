import React from "react";

function Footer() {
  const footerLinks = [
    {
      title: "USE INVOICE GENERATOR",
      items: [
        { text: "Invoice Template", link: "" },
        { text: "How to Use", link: "" },
        { text: "Release Notes", link: "" },
        { text: "Developer API", link: "" },
      ],
    },
    {
      title: "EDUCATION",
      items: [{ text: "Invoicing Guide", link: "" }],
    },
    {
      title: "© 2012-2023 Invoice-Generator.com",
      items: [{ text: "Terms of Use", link: "" }],
    },
  ];
  return (
    <footer className="custom-footer-bg ">
      <div className="h-full mx-8 sm:mx-24 sm:px-8 pt-6 sm:pt-12 pb-20 grid sm:grid-cols-3 gap-10 ">
        {footerLinks.map((section, index) => (
          <div key={index}>
            <p
              className={`${
                index === footerLinks.length - 1
                  ? "text-gray-400 font-medium text-sm tracking-wider cursor-default"
                  : "text-gray-600 font-semibold text-sm tracking-wider cursor-default"
              }`}
            >
              {section.title}
            </p>
            <ul>
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="pt-6 font-medium">
                  <a
                    className="cursor-pointer  text-gray-500 custom-footer-item-hover custom-footer-item-color"
                    href={item.link}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
