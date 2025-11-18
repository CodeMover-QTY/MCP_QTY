# MCP_QTY - Model Context Protocol Servers Collection

这是一个 MCP (Model Context Protocol) 服务器集合项目，包含多个独立的 MCP 服务。

## 📁 项目结构

```
MCP_QTY/
├── github-mcp/          # GitHub API MCP Server
│   ├── src/            
│   ├── dist/           
│   ├── package.json    
│   └── README.md       
├── filesystem-mcp/      # 文件系统 MCP Server (待添加)
├── database-mcp/        # 数据库 MCP Server (待添加)
└── README.md           # 本文件
```

## 🚀 已部署的 MCP Servers

### 1. GitHub MCP (`github-mcp/`)
- **功能**: GitHub API 集成
- **工具**: 
  - `search_issues` - 搜索 Issues 和 PRs
  - `get_repository` - 获取仓库信息
  - `list_pull_requests` - 列出 Pull Requests
- **状态**: ✅ 已部署

## 📝 添加新的 MCP Server

每个 MCP Server 都应该是独立的子文件夹，包含：
- `src/` - 源代码
- `dist/` - 编译输出
- `package.json` - 依赖配置
- `tsconfig.json` - TypeScript 配置
- `README.md` - 服务说明

## ⚙️ VS Code 配置

所有 MCP Server 的配置位于：
- `%APPDATA%\Code\User\settings.json`

当前配置的服务器会自动显示在 VS Code 的 Copilot MCP 和 MCP Servers 面板中。

## 🔧 开发指南

1. 在 `MCP_QTY/` 下创建新的 MCP 文件夹
2. 按照标准结构初始化项目
3. 在 `settings.json` 中添加配置
4. 重新加载 VS Code 窗口

## 📚 相关资源

- [Model Context Protocol 官方文档](https://modelcontextprotocol.io/)
- [MCP Servers 官方仓库](https://github.com/modelcontextprotocol/servers)
