import { ConfigProvider } from "antd";
import { App as AntdApp } from "antd";
import Script from "next/script";
import "@/styles/variables.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Site Verification */}
        <meta
          name="google-site-verification"
          content="SfInUVj6l5T0p-npUmH_gIbvO-Ogc8JcnvHoKzeLrgE"
        />

        {/* ✅ Google Tag Manager (head script) */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PCS796WG');
          `}
        </Script>
      </head>

      <body style={{ margin: "0px" }}>
        {/* ✅ Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PCS796WG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <AntdApp>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#BF40BF",
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdApp>
      </body>
    </html>
  );
}