# GitHub MCP Server

这是一个基于 Model Context Protocol (MCP) 的 GitHub 服务器，可以让 AI 助手（如 Claude Desktop）直接访问 GitHub API。

## 功能

提供以下工具：

1. **search_issues** - 搜索 GitHub Issues 和 Pull Requests
2. **get_repository** - 获取仓库信息
3. **list_pull_requests** - 列出仓库的 Pull Requests

## 安装

```powershell
npm install
```

## 配置

设置 GitHub Personal Access Token：

```powershell
setx GITHUB_TOKEN "你的GitHub令牌"
```

然后重新打开 PowerShell。

## 本地测试

```powershell
npm run dev
```

## 在 Claude Desktop 中使用

1. 打开 Claude Desktop 配置文件：
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. 添加此 MCP 服务器：

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["D:\\User7\\Github\\MCP_QTY\\dist\\index.js"],
      "env": {
        "GITHUB_TOKEN": "你的GitHub令牌"
      }
    }
  }
}
```

3. 先构建项目：

```powershell
npm run build
```

4. 重启 Claude Desktop

## 使用示例

在 Claude Desktop 中，你可以这样问：

- "搜索 Microsoft/vscode 仓库中标签为 bug 的 open issues"
- "获取 facebook/react 仓库的信息"
- "列出 vercel/next.js 的最新 Pull Requests"

Claude 会自动调用相应的工具来获取信息。
