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

开发时可运行 `npm run test:watch`，相关文件变化后会自动重跑测试。准备发布前运行 `npm run check`，一次完成全部测试与生产构建。

## 目录职责

- `src/components/`：只负责展示和交互，通过 props/emits 通信。
- `src/composables/`：表单状态、校验和可复用行为。
- `src/api/`：唯一的网络请求入口。
- `src/mocks/`：仅开发环境使用的模拟响应，不实现真实权益逻辑。
- `src/constants/`：题目及静态业务文案。
- `src/assets/images/`：项目图片资源，组件统一通过 `@` 别名引用。
- `src/types/`：与后端对齐的数据契约。

## 演示数据闭环

当前项目已提供腾讯云 CloudBase 云函数与云数据库持久化，可先跑通以下演示流程：

```text
GitHub Pages 上的 Vue H5 -> CloudBase HTTP 云函数 -> CloudBase 云数据库 -> 成功页
```

- 服务端按题目白名单重新校验答案。
- `requestId` 作为数据库文档 ID，重复提交返回同一条记录。
- 云函数 URL 直接使用 GET 请求可以检查数据库连接。
- 云函数 URL 加 `?id=<submissionId>` 可以读回单条反馈。
- `reward.mode=demo` 仅用于演示成功页，不表示真实服务权益已发放。

完整的教学型专业流程见：

- [`docs/开发部署流程.md`](./docs/开发部署流程.md)：从需求到监控的完整生命周期。
- [`docs/验收清单.md`](./docs/验收清单.md)：发布前后逐项检查。
- [`docs/回滚手册.md`](./docs/回滚手册.md)：前端、云函数和数据的恢复方法。
- [`docs/数据字典.md`](./docs/数据字典.md)：前后端字段和数据边界。
- [`docs/安全风险记录.md`](./docs/安全风险记录.md)：已知依赖风险和缓解措施。

### 1. 创建 CloudBase 环境

1. 登录[腾讯云 CloudBase 控制台](https://console.cloud.tencent.com/tcb)。
2. 点击**新建环境**，选择按量计费，环境名称可填写 `survey-demo`。
3. 选择离主要用户较近的地域，等待环境初始化完成。
4. 进入环境后，打开 **PostgreSQL -> SQL 编辑器**。
5. 按文件编号依次执行 [`database/migrations`](./database/migrations) 中尚未执行的 SQL。
6. 确认生成 `public.survey_submissions` 表；`002` 会增加滚动 30 天奖励限制，网页不直接访问数据库。

### 2. 创建云函数

1. 打开**云函数**，点击**新建云函数**。
2. 函数名称填写 `survey`，运行环境选择 Node.js 18 或更高版本。
3. 创建方式选择本地上传或上传 ZIP，将 [`cloudfunctions/survey`](./cloudfunctions/survey) 目录中的文件上传。
4. 入口函数填写 `index.main`。
5. 安装依赖并部署函数。
6. 在函数配置中添加环境变量：

| 名称 | 建议值 |
| --- | --- |
| `ALLOWED_ORIGIN` | `https://gaotiantiantian.github.io` |
| `DEMO_SERVICE_NAME` | `投顾服务` |
| `DEMO_SERVICE_END_DATE` | `2026-11-29` |

`ALLOWED_ORIGIN` 只填写域名来源，不带 `/test-demo/` 路径。

### 3. 创建 HTTP 访问地址

1. 在 CloudBase 环境中打开**HTTP 访问服务**或**云函数 HTTP 触发器**。
2. 新建路径，例如 `/survey`，关联刚创建的 `survey` 云函数。
3. 开启公网访问并保存。
4. 复制控制台提供的完整 HTTPS 地址。
5. 浏览器直接访问该地址，返回以下内容表示数据库已连接：

```json
{"status":"ok","database":"connected"}
```

### 4. 配置生产云函数地址

CloudBase HTTP 地址是网页必须访问的公开 URL，不是数据库密钥。生产地址保存在 [`.env.production`](./.env.production)，GitHub Pages 构建时由 Vite 自动读取。API Key 等服务端凭证仍只能放在 GitHub Secrets，不能写入任何 `.env` 文件。

### 5. 验证反馈保存

1. 打开 `https://gaotiantiantian.github.io/test-demo/`。
2. 完成三道题并提交。
3. 成功页显示数据库返回的提交结果。
4. 回到 CloudBase **PostgreSQL -> survey_submissions** 查看新记录。

本地 `npm run dev` 默认继续使用 mock，避免误写云数据库。需要从本地页面调用已部署 API 时，新建 `.env.local`：

```dotenv
VITE_USE_MOCK_API=false
VITE_CLOUDBASE_FUNCTION_URL=https://你的-cloudbase-云函数地址
```

同时将云函数的 `ALLOWED_ORIGIN` 临时改为本地页面来源，例如 `http://127.0.0.1:5173`。线上验收前要改回 GitHub Pages 来源。

## 正式上线边界

登录与服务资格暂未迁移。它们应接入现有账号和订单系统，不应复用旧原型中的演示账号、固定验证码或浏览器本地数据库。

正式版本必须由后端完成身份校验、服务资格检查和真实权益发放，并将 `submissionMode` 改为 `production`。当前公开演示接口没有账号鉴权，不适合直接收集真实客户敏感信息。

## 视觉验收

至少检查以下视口：

- 375 × 812
- 390 × 844
- 430 × 932

设计文案、颜色和间距有变更时，优先修改 `tokens.css` 或对应组件的局部样式，不通过全局覆盖链修补。
