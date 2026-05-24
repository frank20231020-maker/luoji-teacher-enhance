# 《罗辑老师真人感语言表达增强》

帮助 AI 课程教研老师，将「干」的课程讲解脚本自动优化为更像真人名师讲课的语言风格。

## 技术栈

- 前端：React + Vite + Tailwind CSS
- 后端：Node.js + Express
- 模型：OpenAI 兼容接口（Chat Completions 流式）

## 快速启动

### 1. 安装依赖

```bash
cd /Users/fl/projects/luoji-teacher-enhance
npm install
npm install --prefix server
npm install --prefix client
```

### 2. 配置 API Key

```bash
cp .env.example server/.env
```

编辑 `server/.env`，填入你的 API Key：

```env
OPENAI_API_KEY=你的密钥
OPENAI_BASE_URL=https://newapi.yuaiweiwu.com/v1
OPENAI_MODEL=gpt-5-5
PORT=3001
```

### 3. 启动开发环境

```bash
npm run dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:3001

## 端口说明

| 服务 | 端口 |
|------|------|
| 前端 (Vite) | 5173 |
| 后端 (Express) | 3001 |

前端通过 Vite 代理将 `/api` 请求转发到后端。

## 自定义配置

| 需求 | 文件路径 |
|------|----------|
| 修改系统 Prompt | `server/prompts/system.js` |
| 修改年级风格 Prompt | `server/prompts/grades.js` |
| 替换罗辑老师图片 | `client/src/config.js` → `TEACHER_IMAGE_URL` |
| API Key / 模型 / 端口 | `server/.env` |

## 生产构建

```bash
npm run build
npm run start
```

生产环境需自行配置前端静态资源托管，或使用 `npm run preview --prefix client` 预览构建结果。

## 功能说明

- 支持一句话、段落、整节课长文本优化
- 流式输出，实时显示优化结果
- 三个年级风格：1-2 / 3-4 / 5-6
- 复制、下载 txt、下载 docx
- 不改变知识内容与解题逻辑（由 Prompt 约束）
