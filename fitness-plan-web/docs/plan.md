# Execution Plan
- [x] 项目初始化 · 搭建 Next.js App Router + TypeScript + ESLint/Prettier  
    - Notes: `npx create-next-app@latest`; 安装 shadcn/ui、Supabase、Zustand 等依赖。
- [x] 主题与基础 UI · 注入 shadcn 组件与 matcha 色板  
    - Notes: Tailwind 配置 matcha 色板；创建 ThemeProvider；添加基础 UI 组件。
- [ ] Supabase 集成 · Auth & Client 设置  
    - Notes: 配置 `.env`，创建 `lib/supabase/client.ts`、session 监听；需要 Supabase 凭据。
- [ ] 路由骨架 · Landing + Auth + Dashboard 保护路由  
    - Notes: 建立 App Router 结构，中间件阻止未登录访问。
- [ ] 身份认证界面 · Login/Signup 表单  
    - Notes: shadcn Form + Supabase Auth API。
- [ ] Dashboard Shell · 清爽卡片式布局  
    - Notes: 侧边导航、顶部摘要卡片。
- [ ] Plan Builder 模块 · Zustand store + 计划生成 UI  
    - Notes: `PlanBuilder` 组件、选择器、训练卡片列表。
- [ ] Supabase Plans 表 CRUD  
    - Notes: `lib/supabase/plans.ts`；保存、读取、实时订阅。
- [ ] Profile & Preferences 页面  
    - Notes: 用户目标设置、训练频率写回 Supabase profile。
- [ ] QA 与文档更新  
    - Notes: 无障碍、移动端适配、README。

## Status Legend
- [ ] 待执行
- [~] 进行中
- [x] 已完成
