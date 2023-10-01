import { renderToStaticMarkup as render } from "react-dom/server";
import { TailwindConfig } from "tw-to-css";
import { Hr } from "@react-email/hr";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";

import { Tailwind } from "../src";

describe("Tailwind component", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe("Inline styles", () => {
    it("should render children with inline Tailwind styles", () => {
      const actualOutput = render(
        <Tailwind>
          <div className="bg-white text-sm" />
        </Tailwind>,
      );

      expect(actualOutput).not.toBeNull();
    });
  });

  it("should be able to use background image", () => {
    const actualOutput = render(
      <Tailwind>
        <div className="bg-[url(https://example.com/image.png)]" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style="background-image:url(https://example.com/image.png)"></div>"`,
    );
  });

  it("should override inline styles with Tailwind styles", () => {
    const actualOutput = render(
      <Tailwind>
        <div
          style={{ backgroundColor: "red", fontSize: "12px" }}
          className="bg-black text-[16px]"
        />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style="background-color:rgb(0,0,0);font-size:16px"></div>"`,
    );
  });

  it("should override component styles with Tailwind styles", () => {
    const actualOutput = render(
      <Tailwind>
        <Hr className="w-12" />
      </Tailwind>,
    );

    expect(actualOutput).toContain("width:3rem");
  });
});

describe("Responsive styles", () => {
  it("should add css to <head/>", () => {
    const actualOutput = render(
      <Tailwind>
        <html>
          <head />
          <body>
            <div className="bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500" />
          </body>
        </html>
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<html><head><style><style>@media(min-width:640px){.sm\\:bg-red-300{background-color:rgb(252,165,165)}}@media(min-width:768px){.md\\:bg-red-400{background-color:rgb(248,113,113)}}@media(min-width:1024px){.lg\\:bg-red-500{background-color:rgb(239,68,68)}}</style></style></head><body><div style="background-color:rgb(254,202,202)"></div></body></html>"`,
    );
  });

  it("should throw an error when used without either <html/> or <head/> tags", () => {
    function noHtmlOrHead() {
      render(
        <Tailwind>
          <div className="bg-red-200 sm:bg-red-500" />
        </Tailwind>,
      );
    }
    expect(noHtmlOrHead).toThrowErrorMatchingInlineSnapshot(
      `"Tailwind: To use responsive styles you must have a <html> and <head> element in your template."`,
    );

    function noHtml() {
      render(
        <Tailwind>
          <head>
            <title>Test</title>
          </head>
          <div className="bg-red-200 sm:bg-red-500" />
        </Tailwind>,
      );
    }
    expect(noHtml).toThrowErrorMatchingInlineSnapshot(
      `"Tailwind: To use responsive styles you must have a <html> and <head> element in your template."`,
    );

    function noHead() {
      render(
        <Tailwind>
          <html>
            {/* <Head></Head> */}
            <div className="bg-red-200 sm:bg-red-500" />
          </html>
        </Tailwind>,
      );
    }
    expect(noHead).toThrowErrorMatchingInlineSnapshot(
      `"Tailwind: To use responsive styles you must have a <html> and <head> element in your template."`,
    );
  });

  it("should persist exsisting <head/> elements", () => {
    const actualOutput = render(
      <Tailwind>
        <html>
          <head>
            <style />
            <link />
          </head>
          <body>
            <div className="bg-red-200 sm:bg-red-500" />
          </body>
        </html>
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<html><head><style></style><link/><style><style>@media(min-width:640px){.sm\\:bg-red-500{background-color:rgb(239,68,68)}}</style></style></head><body><div style="background-color:rgb(254,202,202)"></div></body></html>"`,
    );
  });
});

describe("Custom theme config", () => {
  it("should be able to use custom colors", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          colors: {
            custom: "#1fb6ff",
          },
        },
      },
    };

    const actualOutput = render(
      <Tailwind config={config}>
        <div className="text-custom bg-custom" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style="color:rgb(31,182,255);background-color:rgb(31,182,255)"></div>"`,
    );
  });

  it("should be able to use custom colors", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          fontFamily: {
            sans: ["Graphik", "sans-serif"],
            serif: ["Merriweather", "serif"],
          },
        },
      },
    };

    const actualOutput = render(
      <Tailwind config={config}>
        <div className="font-sans" />
        <div className="font-serif" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style="font-family:Graphik, sans-serif"></div><div style="font-family:Merriweather, serif"></div>"`,
    );
  });

  it("should be able to use custom spacing", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          spacing: {
            "8xl": "96rem",
          },
        },
      },
    };
    const actualOutput = render(
      <Tailwind config={config}>
        <div className="m-8xl"></div>
      </Tailwind>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style="margin:96rem"></div>"`,
    );
  });

  it("should be able to use custom border radius", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          borderRadius: {
            "4xl": "2rem",
          },
        },
      },
    };
    const actualOutput = render(
      <Tailwind config={config}>
        <div className="rounded-4xl" />
      </Tailwind>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style="border-radius:2rem"></div>"`,
    );
  });

  it("should be able to use custom text alignment", () => {
    const config: TailwindConfig = {
      theme: {
        extend: {
          textAlign: {
            justify: "justify",
          },
        },
      },
    };

    const actualOutput = render(
      <Tailwind config={config}>
        <div className="text-justify" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style="text-align:justify"></div>"`,
    );
  });
});

describe("Custom plugins config", () => {
  it("should be able to use custom plugins", () => {
    const config: TailwindConfig = {
      plugins: [
        ({ addUtilities }: any) => {
          const newUtilities = {
            ".border-custom": {
              border: "2px solid",
            },
          };

          addUtilities(newUtilities);
        },
      ],
    };

    const actualOutput = render(
      <Tailwind config={config}>
        <div className="border-custom" />
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style="border:2px solid"></div>"`,
    );
  });

  it("should be able to use custom plugins with responsive styles", () => {
    const config: TailwindConfig = {
      plugins: [
        ({ addUtilities }: any) => {
          const newUtilities = {
            ".border-custom": {
              border: "2px solid",
            },
          };

          addUtilities(newUtilities);
        },
      ],
    };

    const actualOutput = render(
      <Tailwind config={config}>
        <html>
          <head />
          <body>
            <div className="border-custom sm:border-custom" />
          </body>
        </html>
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<html><head><style><style>@media(min-width:640px){.sm\\:border-custom{border:2px solid}}</style></style></head><body><div style="border:2px solid"></div></body></html>"`,
    );
  });
});

describe("<Tailwind> component", () => {
  it("should preserve mso styles", () => {
    const actualOutput = render(
      <Tailwind>
        <Html>
          <Head />
          <span
            dangerouslySetInnerHTML={{
              __html: `<!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;" hidden>&nbsp;</i><![endif]-->`,
            }}
          />
          <div className="bg-white sm:bg-red-50 sm:text-sm md:text-lg custom-class" />
        </Html>
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<html lang="en"><head data-id="__react-email-head"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><style><style>@media(min-width:640px){.sm\\:text-sm{font-size:0.875rem;line-height:1.25rem}.sm\\:bg-red-50{background-color:rgb(254,242,242)}}@media(min-width:768px){.md\\:text-lg{font-size:1.125rem;line-height:1.75rem}}</style></style></head><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;" hidden>&nbsp;</i><![endif]--></span><div class="custom-class" style="background-color:rgb(255,255,255)"></div></html>"`,
    );
  });

  it("should recognize custom resopnsive screen", () => {
    const config: TailwindConfig = {
      theme: {
        screens: {
          sm: { min: "640px" },
          md: { min: "768px" },
          lg: { min: "1024px" },
          xl: { min: "1280px" },
          "2xl": { min: "1536px" },
        },
      },
    };
    const actualOutput = render(
      <Tailwind config={config}>
        <Html>
          <Head />
          <div className="xl:bg-green-500">Test</div>
          <div className="2xl:bg-blue-500">Test</div>
        </Html>
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<html lang="en"><head data-id="__react-email-head"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><style><style>@media(min-width:1280px){.xl\\:bg-green-500{background-color:rgb(34,197,94)}}@media(min-width:1536px){.\\32xl\\:bg-blue-500{background-color:undefined}.\\32xl\\:bg-blue-500{background-color:rgb(59,130,246)}}</style><style>@media(min-width:1280px){.xl\\:bg-green-500{background-color:rgb(34,197,94)}}@media(min-width:1536px){.\\32xl\\:bg-blue-500{background-color:undefined}.\\32xl\\:bg-blue-500{background-color:rgb(59,130,246)}}</style></style></head><div><div>Test</div></div><div><div>Test</div></div></html>"`,
    );
  });

  it("should work with calc() with + sign", () => {
    const actualOutput = render(
      <Tailwind>
        <div className="max-h-[calc(50px+3rem)] bg-red-100">
          <div className="h-[200px]">something tall</div>
        </div>
      </Tailwind>,
    );

    expect(actualOutput).toMatchInlineSnapshot(
      `"<div style="max-height:calc(50px + 3rem);background-color:rgb(254,226,226)"><div style="height:200px"><div style="height:200px">something tall</div></div></div>"`,
    );
  });
});
