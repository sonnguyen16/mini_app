import React from "react";
import { App, ZMPRouter } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getConfig } from "../utils/config";
import { Layout } from "./layout";
import { ConfigProvider } from "./config-provider";

// Tạo QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 phút
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const MyApp = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          cssVariables={{
            "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
            "--zmp-background-color": "#f4f5f6",
          }}
        >
          <App>
            <ZMPRouter>
              <Layout />
            </ZMPRouter>
          </App>
        </ConfigProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
};
export default MyApp;
