import { defineConfig } from "vocs";

export default defineConfig({
  title: "Docs",
  sidebar: [
    {
      text: "Getting Started",
      link: "/getting-started",
    },
    {
      text: "Example",
      link: "/example",
    },
    {
      text: "Action Handler",
      link: "/action-handler",
    },
    {
      text: "Transaction Handler",
      link: "/transaction-handler",
    },
    {
      text: "Parser",
      link: "/parser",
    },
    {
      text: "Components",
      collapsed: true,
      items: [
        {
          text: "Config",
          link: "/docs/api/config",
        },
      ],
    },
    {
      text: "Adding Actions",
      collapsed: true,
      items: [
        {
          text: "Config",
          link: "/docs/api/config",
        },
      ],
    },
  ],
});
