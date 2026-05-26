# 《罗辑老师真人感语言表达增强》

帮助 AI 课程教研老师，将「干」的课程讲解脚本自动优化为更像真人名师讲课的语言风格。

## 技术栈

- 前端：React + Vite + Tailwind CSS
- 后端：Node.js + Express
- 模型：OpenAI 兼容接口（Chat Completions 流式）

## 快速启动

### 1. 拷贝项目并安装依赖

把整个 `luoji-teacher-enhance` 文件夹拷贝到本机后，在项目根目录执行：

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 2. 启动本地服务

```bash
npm run dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:3001

### 3. 在页面配置 API Key

打开前端页面后，点击右上角 `API 设置`，填入公司提供的配置：

- `API KEY`：公司提供的密钥
- `Base URL`：OpenAI 兼容接口地址，默认 `https://newapi.yuaiweiwu.com/v1`
- `Model`：模型名，默认 `gpt-5-5`

配置会保存在当前浏览器的 `localStorage` 中，只用于本机请求，不会写入项目文件。

## 可选：使用 server/.env 配置

如果希望继续使用传统后端环境变量方式，也可以执行：

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

页面中填写的 API 设置会优先于 `server/.env`。

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
| 页面默认 API 设置 | `client/src/config.js` → `DEFAULT_API_SETTINGS` |
| 后端兜底 API 设置 / 端口 | `server/.env` |

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
