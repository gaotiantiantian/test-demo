# CloudBase survey 云函数

在腾讯云 CloudBase 控制台创建 Node.js 云函数 `survey`，上传本目录代码并安装依赖。

必须先执行 [`../../database/migrations/001_create_survey_submissions.sql`](../../database/migrations/001_create_survey_submissions.sql)，创建 PostgreSQL 表 `public.survey_submissions`。函数通过 `app.rdb()` 使用服务端身份访问该表，网页不直连数据库。

环境变量：

- `ALLOWED_ORIGIN`：GitHub Pages 完整来源，例如 `https://gaotiantiantian.github.io`。
- `DEMO_SERVICE_NAME`：可选，例如 `投顾服务`。
- `DEMO_SERVICE_END_DATE`：可选，格式 `YYYY-MM-DD`。

创建 HTTP 访问服务后，将完整访问 URL 配置到 GitHub Actions 变量 `VITE_CLOUDBASE_FUNCTION_URL`。
