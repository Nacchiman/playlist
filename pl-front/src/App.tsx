import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TbDatabaseEdit } from "react-icons/tb";
import RegisterPage from "./components/pages/RegisterPage/RegisterPage";
import SearchPageComponent from "./components/pages/SearchPage/SearchPageComponent";

function App() {
  const [content, setContent] = useState("search");

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

  type MenuItem = Required<MenuProps>["items"][number];

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  };

  const items: MenuProps["items"] = [
    getItem("検索", "search", <FaSearch />),
    getItem("データ管理", "data", <TbDatabaseEdit />),
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    setContent(e.key);
  };

  const MainContent = () => {
    switch (content) {
      case "search":
        return <SearchPageComponent />;
      // return <SearchPage />;
      case "data":
        return <RegisterPage />;
    }
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Layout style={layoutStyle}>
          <Sider width="25%" style={siderStyle}>
            <Menu
              onClick={onClick}
              style={{ width: 256 }}
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["search"]}
              mode="inline"
              items={items}
            />
          </Sider>
          <Layout>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}>
              <MainContent />
            </Content>
            <Footer style={footerStyle}>Footer</Footer>
          </Layout>
        </Layout>
      </QueryClientProvider>
    </>
  );
}

export default App;
