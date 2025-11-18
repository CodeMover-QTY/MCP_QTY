# MCP_QTY - Model Context Protocol Servers Collection

这是一个 MCP (Model Context Protocol) 服务器集合项目，包含多个独立的 MCP 服务。

## 📁 项目结构

```
MCP_QTY/
├── github-mcp/              # GitHub API MCP Server
│   ├── src/
│   │   └── index.ts         # 源代码
│   ├── dist/
│   │   └── index.js         # 编译输出
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── filesystem-mcp/          # 文件系统操作 MCP Server
│   ├── src/
│   │   └── index.ts         # 源代码
│   ├── dist/
│   │   └── index.js         # 编译输出
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── quick_test.js            # Filesystem MCP 快速测试脚本
├── test_filesystem_tools.js # Filesystem MCP 完整测试脚本
├── .gitignore
└── README.md                # 本文件
```

## 🚀 已部署的 MCP Servers

### 1. GitHub MCP (`github-mcp/`)
- **功能**: GitHub API 集成，提供仓库、Issue、PR 查询能力
- **工具**: 
  - `search_issues` - 搜索 Issues 和 Pull Requests
  - `get_repository` - 获取仓库详细信息
  - `list_pull_requests` - 列出指定仓库的 Pull Requests
- **依赖**: 
  - `@modelcontextprotocol/sdk` - MCP 协议 SDK
  - `@octokit/rest` - GitHub REST API 客户端
- **环境变量**: `GITHUB_TOKEN` (必需)
- **状态**: ✅ 已部署并测试通过

### 2. Filesystem MCP (`filesystem-mcp/`)
- **功能**: 文件系统操作，提供安全的文件读写和搜索能力
- **工具**:
  - `read_file` - 读取 UTF-8 文本文件
  - `write_file` - 写入/创建文本文件
  - `list_directory` - 列出目录内容（非递归）
  - `search_glob` - 使用 glob 模式搜索文件
  - `search_text` - 在文件中搜索文本内容
- **依赖**:
  - `@modelcontextprotocol/sdk` - MCP 协议 SDK
  - `fast-glob` - 高性能文件模式匹配
- **环境变量**: `FILESYSTEM_ROOT` (可选，默认当前工作目录)
- **安全特性**: 路径沙箱机制，防止访问 ROOT 目录之外的文件
- **状态**: ✅ 已部署并测试通过

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
