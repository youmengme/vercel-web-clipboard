# Web Clipboard

一个简单、快速的在线剪贴板应用，基于 Next.js 和 Vercel Postgres 构建。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/youmengme/vercel-web-clipboard&env=POSTGRES_URL,POSTGRES_PRISMA_URL,POSTGRES_URL_NON_POOLING,POSTGRES_USER,POSTGRES_HOST,POSTGRES_PASSWORD,POSTGRES_DATABASE&envDescription=Required%20to%20connect%20to%20Vercel%20Postgres&envLink=https://vercel.com/docs/storage/vercel-postgres&project-name=web-clipboard&repository-name=vercel-web-clipboard)

## 功能特性

- **查找内容**: 通过密钥快速获取存储的内容
- **添加内容**: 创建新的剪贴板条目，可选设置访问密码
- **密码保护**: 支持为敏感内容设置访问密码
- **查看统计**: 显示内容被查看的次数
- **一键复制**: 快速复制内容到剪贴板
- **删除功能**: 删除不需要的内容
- **响应式设计**: 完美支持手机和PC端访问
- **深色模式**: 支持亮色和暗色主题切换

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI组件**: shadcn/ui
- **样式**: Tailwind CSS
- **数据库**: Vercel Postgres
- **主题**: next-themes
- **语言**: TypeScript

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

1. 在 Vercel 创建项目并设置 Vercel Postgres 数据库
2. 获取数据库连接信息
3. 复制 `.env.local` 文件并填入你的数据库连接信息：

```bash
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-prisma-url"
POSTGRES_URL_NON_POOLING="your-postgres-url-non-pooling"
POSTGRES_USER="your-postgres-user"
POSTGRES_HOST="your-postgres-host"
POSTGRES_PASSWORD="your-postgres-password"
POSTGRES_DATABASE="your-postgres-database"
```

### 初始化数据库

在 Vercel Dashboard 的 Postgres 数据库页面，点击 "Query" 并执行 `schema.sql` 中的SQL语句：

```sql
CREATE TABLE IF NOT EXISTS clipboard_items (
  id VARCHAR(10) PRIMARY KEY,
  content TEXT NOT NULL,
  password VARCHAR(255),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_created_at ON clipboard_items(created_at);
```

### 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量（Vercel Postgres 会自动配置）
4. 部署完成后，在 Vercel Postgres 的 Query 页面执行 `schema.sql` 初始化数据库表

## 页面说明

### 首页 (/)
- 查找模块：输入密钥查询内容
- 添加模块：跳转到添加页面

### 查看页面 (/view)
- 显示存储的内容
- 一键复制功能
- 删除功能
- 查看次数统计
- 密码保护支持

### 添加页面 (/add)
- 输入内容
- 可选设置访问密码
- 生成访问密钥

## 安全特性

- 输入内容自动清理，防止XSS攻击
- 密码保护敏感内容
- SQL注入防护
- 输入长度限制

## License

MIT
