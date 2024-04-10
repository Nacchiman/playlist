import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import RegisterPage from "./components/pages/RegisterPage/RegisterPage";

function App() {
  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "black",
    height: 64,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#ffffff",
  };

  const contentStyle: React.CSSProperties = {
    textAlign: "center",
    minHeight: 120,
    width: "100%",
    lineHeight: "120px",
    color: "black",
    backgroundColor: "#ffffff",
  };

  const siderStyle: React.CSSProperties = {
    textAlign: "center",
    lineHeight: "120px",
    color: "black",
    backgroundColor: "#ffffff",
  };

  const footerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "black",
    backgroundColor: "#ffffff",
  };

  const layoutStyle = {
    borderRadius: 8,
    overflow: "hidden",
    width: "calc(100% - 8px)",
  };
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Layout style={layoutStyle}>
          <Sider width="25%" style={siderStyle}>
            Sider
          </Sider>
          <Layout>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}>
              <RegisterPage />
            </Content>
            <Footer style={footerStyle}>Footer</Footer>
          </Layout>
        </Layout>
      </QueryClientProvider>
    </>
  );
}

export default App;
