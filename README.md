# Survey H5

面向正式开发的 Vue 3 问卷 H5。根目录的 `../问卷原型.html` 继续作为视觉和交互对照，不参与该项目构建。

## 环境

- Node.js 22.12 或更高版本
- npm 10 或更高版本

## 命令

```bash
npm install
npm run dev
npm run test
npm run build
```

## 目录职责

- `src/components/`：只负责展示和交互，通过 props/emits 通信。
- `src/composables/`：表单状态、校验和可复用行为。
- `src/api/`：唯一的网络请求入口。
- `src/mocks/`：仅开发环境使用的模拟响应，不实现真实权益逻辑。
- `src/constants/`：题目及静态业务文案。
- `src/assets/images/`：项目图片资源，组件统一通过 `@` 别名引用。
- `src/types/`：与后端对齐的数据契约。

## 演示数据闭环

当前项目已提供 Vercel Serverless API 与 Supabase 持久化，可先跑通以下演示流程：

```text
Vue H5 -> POST /api/surveys -> Vercel Function -> Supabase -> 成功页
```

- 服务端按题目白名单重新校验答案。
- `requestId` 在数据库中唯一，重复提交返回同一条记录。
- `GET /api/surveys?id=<submissionId>` 可以读回单条反馈。
- `GET /api/health` 用于检查 Vercel 与 Supabase 是否连通。
- `reward.mode=demo` 仅用于演示成功页，不表示真实服务权益已发放。

### 1. 创建 Supabase 数据表

1. 在 Supabase 创建项目。
2. 打开 **SQL Editor**。
3. 执行 [`supabase/schema.sql`](./supabase/schema.sql)。
4. 在 **Table Editor** 中确认出现 `survey_submissions`。

表已开启 RLS，并撤销浏览器匿名角色的直接读写权限。只有服务端使用的 `service_role` 密钥可以写入。

### 2. 配置 Vercel

在 Vercel 导入 GitHub 仓库。如果仓库根目录就是本项目，不需要调整 Root Directory；如果本项目位于大仓库的 `survey-h5/`，Root Directory 选择 `survey-h5`。

在 **Project Settings -> Environment Variables** 添加：

| 名称 | 值 |
| --- | --- |
| `SUPABASE_URL` | Supabase Project Settings -> API 中的 Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Project Settings -> API Keys 中的 `service_role` secret |
| `DEMO_SERVICE_NAME` | 可选，例如 `投顾服务` |
| `DEMO_SERVICE_END_DATE` | 可选，格式 `YYYY-MM-DD` |

`SUPABASE_SERVICE_ROLE_KEY` 只能放在 Vercel 环境变量中，不能以 `VITE_` 开头，也不能提交到 GitHub。

配置完成后重新部署。访问：

```text
https://你的域名/api/health
```

返回以下内容表示数据库已连通：

```json
{"status":"ok","database":"connected"}
```

### 3. 验证反馈保存

1. 打开 Vercel 部署后的问卷页面。
2. 完成三道题并提交。
3. 成功页显示数据库返回的提交结果。
4. 回到 Supabase **Table Editor -> survey_submissions** 查看新记录。

本地 `npm run dev` 默认继续使用 mock，避免误写云数据库。需要从本地页面调用已部署 API 时，新建 `.env.local`：

```dotenv
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://你的-vercel-域名
```

同时在 Vercel 将 `ALLOWED_ORIGIN` 设置为本地页面来源，例如 `http://127.0.0.1:5173`，然后重新部署。

## 正式上线边界

登录与服务资格暂未迁移。它们应接入现有账号和订单系统，不应复用旧原型中的演示账号、固定验证码或浏览器本地数据库。

正式版本必须由后端完成身份校验、服务资格检查和真实权益发放，并将 `submission_mode` 改为 `production`。当前公开演示接口没有账号鉴权，不适合直接收集真实客户敏感信息。

## 视觉验收

至少检查以下视口：

- 375 × 812
- 390 × 844
- 430 × 932

设计文案、颜色和间距有变更时，优先修改 `tokens.css` 或对应组件的局部样式，不通过全局覆盖链修补。
