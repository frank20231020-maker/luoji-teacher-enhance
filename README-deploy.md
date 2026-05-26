# 罗辑老师增强工具部署说明

目标：前端部署到 Vercel，后端部署到 Render，先快速形成可公网访问的 Demo。

## 部署前检查

- 前端目录：`client`
- 后端目录：`server`
- 前端构建命令：`npm run build`
- 前端输出目录：`dist`
- 后端启动命令：`npm start`
- 后端健康检查：`/api/health`
- 后端 API 前缀：`/api`

## 环境变量

Render 后端环境变量：

```env
OPENAI_API_KEY=公司提供的 API KEY
OPENAI_BASE_URL=https://newapi.yuaiweiwu.com/v1
OPENAI_MODEL=gpt-5-5
PORT=3001
FRONTEND_URL=https://你的-vercel-域名.vercel.app
```

Vercel 前端环境变量：

```env
VITE_API_BASE_URL=https://你的-render-service.onrender.com
```

注意：`VITE_API_BASE_URL` 不要以 `/` 结尾。

## 第一步：GitHub 上传

如果本地还没有初始化 Git：

```bash
git init
```

检查状态：

```bash
git status
```

添加并提交代码：

```bash
git add .
git commit -m "Prepare Vercel and Render deployment"
```

在 GitHub 创建一个新仓库，例如 `luoji-teacher-enhance`，不要勾选自动生成 README。

绑定远程仓库并推送：

```bash
git branch -M main
git remote add origin https://github.com/你的用户名/luoji-teacher-enhance.git
git push -u origin main
```

如果已经存在 `origin`，用下面命令查看：

```bash
git remote -v
```

## 第二步：Render 部署

推荐方式：使用仓库里的 `render.yaml` 创建服务。

1. 打开 Render，选择 `New` -> `Blueprint`。
2. 选择刚刚上传的 GitHub 仓库。
3. Render 会读取根目录的 `render.yaml`。
4. 服务目录为 `server`。
5. Build Command 为 `npm install`。
6. Start Command 为 `npm start`。
7. Health Check Path 为 `/api/health`。
8. 环境变量按上面的 Render 列表填写。

如果手动创建 Web Service：

1. 选择 `New` -> `Web Service`。
2. 连接 GitHub 仓库。
3. Root Directory 填 `server`。
4. Runtime 选择 `Node`。
5. Build Command 填 `npm install`。
6. Start Command 填 `npm start`。
7. 添加环境变量。

后端启动后，访问：

```text
https://你的-render-service.onrender.com/api/health
```

看到类似下面内容说明后端在线：

```json
{"ok":true,"model":"gpt-5-5"}
```

## 第三步：Vercel 部署

1. 打开 Vercel，选择 `Add New` -> `Project`。
2. 导入同一个 GitHub 仓库。
3. Root Directory 选择 `client`。
4. Framework Preset 选择 `Vite`。
5. Build Command 使用 `npm run build`。
6. Output Directory 使用 `dist`。
7. 添加环境变量：

```env
VITE_API_BASE_URL=https://你的-render-service.onrender.com
```

部署完成后，把 Vercel 生成的前端域名复制出来，回到 Render 后端，把 `FRONTEND_URL` 设置为这个 Vercel 域名，然后重新部署后端。

## 第四步：最终联调

确认前后端联通：

1. 打开 Vercel 前端页面。
2. 输入一段原始脚本。
3. 点击 `简略版优化` 或 `详细版优化`。
4. 如果能流式输出内容，说明 Vercel 到 Render 的链路正常。

确认 Skill 是否正常加载：

1. 打开 Render 服务详情。
2. 进入 `Logs`。
3. 发起一次优化请求。
4. 日志中出现 `Skill Loaded:`，说明 Skill 内容已被后端读取。

查看 Render 日志：

1. 进入 Render 对应 Web Service。
2. 打开 `Logs`。
3. 查看启动日志、请求错误、模型接口错误。

后续更新版本：

```bash
git add .
git commit -m "Update demo"
git push
```

Render 和 Vercel 连接 GitHub 后，会自动检测新提交并重新部署。

## 安全说明

- 真实 `OPENAI_API_KEY` 只配置在 Render 后端环境变量中。
- 前端只配置 `VITE_API_BASE_URL`，不配置模型 API KEY。
- `.env`、`server/.env`、`client/.env`、`node_modules`、`dist`、`logs` 已在 `.gitignore` 中忽略。
- 不要把 Render 后端暴露给不可信前端域名；生产环境请设置 `FRONTEND_URL` 为 Vercel 域名。

## 流式输出说明

后端仍使用 OpenAI 兼容接口的 `stream: true`，并通过 Express 持续写回文本流。Render 部署后无需额外配置，只要模型接口支持流式输出即可。
