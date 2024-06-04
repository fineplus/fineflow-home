import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FineFlow",
  base: '/fineflow-home/',
  outDir: "../docs",
  head: [["link", { rel: "icon", href: "./logo.svg" }]],
  description: "自定义工作流引擎",
  themeConfig: {
    logo: "/logo.svg",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "文档", link: "/introduction" },
      { text: "案例", link: "/docs" },
    ],

    sidebar: [
      {
        text: "开始",
        items: [
          { text: "简介", link: "/introduction" },
          { text: "快速上手", link: "/quick-start" },
          { text: "软件下载", link: "/soft-download" },
        ],
      },
      {
        text: "使用说明",
        items: [{ text: "基本操作", link: "/base" },
        { text: "其他说明", link: "/other-des" }],
      },
      // {
      //   text: "流程设计指南",
      //   items: [
      //     { text: "基本概念", link: "/docs" },
      //     { text: "设计建议", link: "/docs" },
      //   ],
      // },
      {
        text: "节点设计",
        items: [
          { text: "预备知识", link: "/node-design/introduction" },
          // { text: "节点架构", link: "/docs" },
          { text: "节点开发", link: "/node-design/node-design" },
          { text: "节点范例", link: "/node-design/node-demos" },
        ],
      },
      {
        text: "后端集成",
        items: [
          { text: "pyfineflow", link: "/backend/pyfineflow" },
          { text: "系统python", link: "/backend/system-py" },
          // { text: "建议规范", link: "/docs" },
        ],
      },
      {
        text: "其他",
        items: [
          { text: "快捷键", link: "/keyboards" },
          { text: "常见问题", link: "/questions" },
          { text: "项目进度", link: "/todolist" },

        ],
      },
      {
        text: "开发者指南",
        items: [
          { text: "项目开发", link: "/developer" },
        ],
      },
    ],

    // socialLinks: [
    //   { icon: "github", link: "https://github.com/vuejs/vitepress" },
    // ],
  },
});
