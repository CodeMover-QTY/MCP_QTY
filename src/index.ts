import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("GITHUB_TOKEN is not set in environment variables.");
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

const server = new Server(
  {
    name: "github-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义工具：搜索 GitHub Issues
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_issues",
        description: "Search for GitHub issues and pull requests across repositories",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query (e.g., 'is:open is:issue label:bug')",
            },
            repository: {
              type: "string",
              description: "Optional: Filter by repository (format: owner/repo)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_repository",
        description: "Get information about a GitHub repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Repository owner (username or organization)",
            },
            repo: {
              type: "string",
              description: "Repository name",
            },
          },
          required: ["owner", "repo"],
        },
      },
      {
        name: "list_pull_requests",
        description: "List pull requests in a repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Repository owner",
            },
            repo: {
              type: "string",
              description: "Repository name",
            },
            state: {
              type: "string",
              enum: ["open", "closed", "all"],
              description: "Filter by state (default: open)",
            },
          },
          required: ["owner", "repo"],
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("Missing arguments");
    }

    switch (name) {
      case "search_issues": {
        let searchQuery = args.query as string;
        if (args.repository) {
          searchQuery += ` repo:${args.repository}`;
        }
        
        const result = await octokit.rest.search.issuesAndPullRequests({
          q: searchQuery,
          per_page: 10,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                result.data.items.map((item) => ({
                  title: item.title,
                  number: item.number,
                  state: item.state,
                  url: item.html_url,
                  author: item.user?.login,
                  created_at: item.created_at,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      case "get_repository": {
        const result = await octokit.rest.repos.get({
          owner: args.owner as string,
          repo: args.repo as string,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  name: result.data.name,
                  full_name: result.data.full_name,
                  description: result.data.description,
                  stars: result.data.stargazers_count,
                  forks: result.data.forks_count,
                  language: result.data.language,
                  url: result.data.html_url,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "list_pull_requests": {
        const result = await octokit.rest.pulls.list({
          owner: args.owner as string,
          repo: args.repo as string,
          state: (args.state as "open" | "closed" | "all") || "open",
          per_page: 10,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                result.data.map((pr) => ({
                  title: pr.title,
                  number: pr.number,
                  state: pr.state,
                  author: pr.user?.login,
                  url: pr.html_url,
                  created_at: pr.created_at,
                })),
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitHub MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
