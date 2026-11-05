# CloudBase survey 云函数

在腾讯云 CloudBase 控制台创建 Node.js 云函数 `survey`，上传本目录代码并安装依赖。

必须按编号依次执行 [`../../database/migrations`](../../database/migrations) 中的 SQL。`002` 迁移会新增访客标识与奖励状态，并通过 PostgreSQL 事务保证同一访客、同一服务在滚动 30 天内只获得一次奖励。反馈本身不受限制，仍会正常入库。

当前 H5 没有登录系统，因此使用浏览器本地生成的访客 ID。它适合演示流程，但清除浏览器数据或更换设备后会被视为新访客；正式项目应改用登录账号的稳定用户 ID。

环境变量：

- `ALLOWED_ORIGIN`：GitHub Pages 完整来源，例如 `https://gaotiantiantian.github.io`。
- `DEMO_SERVICE_NAME`：可选，例如 `投顾服务`。
- `DEMO_SERVICE_END_DATE`：可选，格式 `YYYY-MM-DD`。

创建 HTTP 访问服务后，将完整访问 URL 配置到 GitHub Actions 变量 `VITE_CLOUDBASE_FUNCTION_URL`。
