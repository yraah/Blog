import { ConfigProvider } from "antd";
import { App as AntdApp } from "antd";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: '0px' }}>
        <AntdApp>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#B15EFF",
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