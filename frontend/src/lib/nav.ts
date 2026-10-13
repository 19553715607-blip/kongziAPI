// 全站导航单一数据源：桌面下拉 / 移动抽屉 / 页脚站点地图 / 面包屑共用。
// 路由路径不变，仅调整归属与层级。
export type NavItem = { href: string; labelKey: string };
export type NavGroup = { labelKey: string; zhKey?: string; items: NavItem[] };
export type FlatLink = { href: string; labelKey: string };

// 桌面顶部 3 个一级下拉
export const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: "nav.explore",
    zhKey: "nav.zh.explore",
    items: [
      { href: "/graph", labelKey: "nav.graph" },
      { href: "/journey", labelKey: "nav.journey" },
      { href: "/feed", labelKey: "nav.feed" },
    ],
  },
  {
    labelKey: "nav.learn",
    zhKey: "nav.zh.learn",
    items: [
      { href: "/paths", labelKey: "nav.paths" },
      { href: "/read", labelKey: "nav.read" },
      { href: "/chat", labelKey: "nav.chat" },
    ],
  },
  {
    labelKey: "nav.about",
    zhKey: "nav.zh.about",
    items: [
      { href: "/developers", labelKey: "nav.developers" },
      { href: "/teach", labelKey: "nav.teach" },
    ],
  },
];

// 未进入 3 个一级下拉的页面（移动抽屉 + 页脚 + 面包屑兜底用）
export const EXTRA_LINKS: FlatLink[] = [
  { href: "/cases", labelKey: "nav.cases" },
  { href: "/terms", labelKey: "nav.terms" },
  { href: "/quiz", labelKey: "nav.quiz" },
  { href: "/co-create", labelKey: "nav.cocreate" },
  { href: "/plugins", labelKey: "nav.plugins" },
  { href: "/reach", labelKey: "nav.reach" },
  { href: "/kiosk", labelKey: "nav.kiosk" },
  { href: "/login", labelKey: "user.login" },
];

// 页脚站点地图分组
export const FOOTER_GROUPS: { labelKey: string; links: FlatLink[] }[] = [
  { labelKey: "footer.explore", links: [
    { href: "/graph", labelKey: "nav.graph" },
    { href: "/journey", labelKey: "nav.journey" },
    { href: "/feed", labelKey: "nav.feed" },
  ]},
  { labelKey: "footer.learn", links: [
    { href: "/paths", labelKey: "nav.paths" },
    { href: "/read", labelKey: "nav.read" },
    { href: "/quiz", labelKey: "nav.quiz" },
    { href: "/terms", labelKey: "nav.terms" },
  ]},
  { labelKey: "footer.about", links: [
    { href: "/developers", labelKey: "nav.developers" },
    { href: "/teach", labelKey: "nav.teach" },
  ]},
  { labelKey: "footer.community", links: [
    { href: "/chat", labelKey: "nav.chat" },
    { href: "/cases", labelKey: "nav.cases" },
    { href: "/co-create", labelKey: "nav.cocreate" },
  ]},
  { labelKey: "footer.tools", links: [
    { href: "/plugins", labelKey: "nav.plugins" },
    { href: "/reach", labelKey: "nav.reach" },
    { href: "/kiosk", labelKey: "nav.kiosk" },
  ]},
];

export function isActive(path: string, href: string): boolean {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(href + "/");
}

export function activeGroup(path: string): NavGroup | undefined {
  return NAV_GROUPS.find((g) => g.items.some((it) => isActive(path, it.href)));
}
