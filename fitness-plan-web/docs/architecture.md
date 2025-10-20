# Overview
- **Product goal**: 交付一个面向健身用户的纯前端 Web 应用，支持账号体系与个性化训练计划生成。
- **Core journeys**
  - 访客 → 注册/登录 → 进入仪表盘。
  - 用户 → 选择/输入个人目标 → 生成与编辑训练计划。
- **Experience tone**: 清爽卡片式布局，主色调为抹茶绿色，强调轻盈与可操作性。

# Module Map

## Routing & Layout (Next.js App Router)
- `/layout.tsx`: 顶层布局，注入 `ThemeProvider`、Zustand providers、Supabase session 监听。
- `/page.tsx`: 公共 Landing，宣传要点 + CTA。
- `/auth/(login|signup)/page.tsx`: 使用 shadcn/ui 表单控件，集成 Supabase Auth。
- `/dashboard/layout.tsx`: 保护路由，含侧边导航、顶部概要条。
- `/dashboard/page.tsx`: 卡片式总览（今日训练、下次计划、提示）。
- `/dashboard/plans/page.tsx`: 计划生成与编辑主界面。
- `/dashboard/profile/page.tsx`: 个人目标、偏好设置。

## UI 分层
- `app/(components)/ui/`: shadcn 增强版原子组件（Button、Input、Card、Badge、Progress、Tabs）。
- `app/(components)/layout/`: `AppShell`, `NavSidebar`, `TopSummary`.
- `app/(components)/plans/`: `PlanBuilder`, `SessionCard`, `ExercisePicker`, `PlanSummarySheet`.
- `app/(components)/auth/`: `AuthForm`, `SocialSignIn`.
- `app/(components)/shared/`: `DataEmptyState`, `LoadingSkeleton`.

## 状态切片 (Zustand)
- `useSessionStore`: 保存 Supabase session / user profile。
- `usePlanBuilderStore`: 计划草稿、阶段、每日训练结构、乐观更新状态。
- `useUiStore`: Modal/Sheet 开关、主题切换（浅色/深色）。
- **持久化策略**：仅 `usePlanBuilderStore` 使用 localStorage 临时缓存（防止页面刷新丢失）。

## 数据与集成
- `lib/supabase/client.ts`: Supabase browser client。
- `lib/supabase/auth.ts`: 登录、注册、登出、session 恢复。
- `lib/supabase/plans.ts`: CRUD（profile-based row level security）。
- `lib/supabase/reference.ts`: 读取预设训练模板、动作库。
- `lib/ai/plan-generator.ts`: （前端）对模板 + 用户输入组合生成计划；如需真正 AI/后端处理，标注 “需要后端支持”。

# Data Flow

## Auth
1. 用户提交登录表单 → Supabase Auth (`signInWithPassword`)。
2. 成功后回传 session → `useSessionStore` 保存 → Dashboard 复用。
3. 监听 `onAuthStateChange` 更新 session / 路由守卫。

## Plan Generation
1. 用户在 PlanBuilder 选择目标/频率/动作 → 写入 `usePlanBuilderStore`。
2. 点击生成 → 前端根据模板和用户输入组合计划（若需高级逻辑，调用 Supabase Edge Function **需要后端支持**）。
3. 保存计划 → 调用 `supabase.from('plans').upsert` → 乐观更新 store → 成功后刷新计划列表。

## Dashboard Overview
1. `page.tsx` 使用 Server Component 获取 session 基础数据。
2. 客户端组件通过 Supabase 客户端订阅 plan 表变化 → 更新卡片。

# Tech Decisions

| Topic | Decision | Rationale | Risk & Mitigation |
|-------|----------|-----------|--------------------|
| Next.js 架构 | App Router + Server/Client 组件混合 | Server Component 渲染 Auth 状态、SEO；Client 组件处理交互 | 需要谨慎拆分，遵循官方约束 |
| UI 框架 | shadcn/ui + Tailwind 自定义 matcha 主题 | 快速搭建一致的 UI 组件体系 | 主题覆盖范围有限 → 建立 `theme.css` 统一 token |
| 状态管理 | Zustand | 轻量、模块化、支持中间件 (persist, immer) | 多 store 共享时需谨慎 → 使用 selector 减少重渲染 |
| 数据层 | Supabase JS client | 覆盖 Auth + PostgREST + Realtime | Realtime 若延迟 → 可选用轮询或手动刷新 |
| Auth Guard | Server Component + 中间件 | 在 `/dashboard` 级别阻挡未登录用户 | 需处理 Supabase SSR session 恢复 |
| 计划生成 | 前端组合模板 | 满足无后端限制 | 复杂逻辑需 Edge Function → 在 plan.md Notes 标注需要后端支持 |

# Theme & Accessibility
- `globals.css` 定义 matcha 色板变量，结合 Tailwind `bg-background` 等工具类。
- 确保 shadcn 组件焦点态可见，卡片阴影轻（`shadow-sm`），保持充足留白。
- 默认浅色主题，可切换深色主题（深色版仍维持 matcha 氛围）。

# Risks & Open Questions
- Supabase 行级安全策略需配合数据库配置（后端工作）。
- 训练动作库规模：若数据量大，需要分页或搜索；否则保持静态列表。
- 计划生成逻辑复杂度：是否需要 AI/LLM 支持？当前方案仅组合模板。
