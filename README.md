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

## 接入真实接口

生产环境的 `POST /api/surveys` 必须由服务端完成身份、服务资格、幂等提交和权益发放。前端只提交 `requestId`、`serviceId` 与答案，并展示服务端返回的结果。

登录与服务资格暂未迁移。它们应接入现有账号和订单系统，不应复用旧原型中的演示账号、固定验证码或浏览器本地数据库。

## 视觉验收

至少检查以下视口：

- 375 × 812
- 390 × 844
- 430 × 932

设计文案、颜色和间距有变更时，优先修改 `tokens.css` 或对应组件的局部样式，不通过全局覆盖链修补。
