import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import fg from "fast-glob";

// Root directory exposed to MCP (limit scope for safety)
const ROOT = process.env.FILESYSTEM_ROOT || process.cwd();

function resolveSafe(p: string) {
  const abs = path.resolve(ROOT, p);
  if (!abs.startsWith(path.resolve(ROOT))) {
    throw new Error("Path escapes ROOT scope");
  }
  return abs;
}

const server = new Server(
  { name: "filesystem-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "read_file",
        description: "Read a UTF-8 text file relative to ROOT",
        inputSchema: {
          type: "object",
          properties: { file: { type: "string", description: "Relative file path" } },
          required: ["file"],
        },
      },
      {
        name: "write_file",
        description: "Write (create/overwrite) a UTF-8 text file",
        inputSchema: {
          type: "object",
          properties: {
            file: { type: "string" },
            content: { type: "string" },
          },
          required: ["file", "content"],
        },
      },
      {
        name: "list_directory",
        description: "List files and folders (non-recursive) in a directory",
        inputSchema: {
          type: "object",
          properties: { dir: { type: "string", description: "Relative directory path" } },
          required: ["dir"],
        },
      },
      {
        name: "search_glob",
        description: "Search for files using a glob pattern (fast-glob)",
        inputSchema: {
          type: "object",
          properties: { pattern: { type: "string", description: "Glob pattern (e.g. **/*.ts)" } },
          required: ["pattern"],
        },
      },
      {
        name: "search_text",
        description: "Search for text in files matching a glob pattern (small files)",
        inputSchema: {
          type: "object",
          properties: {
            pattern: { type: "string" },
            query: { type: "string" },
            maxMatches: { type: "number" },
          },
          required: ["pattern", "query"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  if (!args) {
    return { content: [{ type: "text", text: "Error: missing arguments" }], isError: true };
  }
  try {
    switch (name) {
      case "read_file": {
        const file = resolveSafe(String(args.file));
        const data = fs.readFileSync(file, "utf8");
        return { content: [{ type: "text", text: data }] };
      }
      case "write_file": {
        const file = resolveSafe(String(args.file));
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, String(args.content), "utf8");
        return { content: [{ type: "text", text: "OK" }] };
      }
      case "list_directory": {
        const dir = resolveSafe(String(args.dir));
        const items = fs.readdirSync(dir).map((n) => {
          const full = path.join(dir, n);
          const stat = fs.statSync(full);
          return { name: n, type: stat.isDirectory() ? "dir" : "file", size: stat.size };
        });
        return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
      }
      case "search_glob": {
        const pattern = String(args.pattern);
        const matches = await fg(pattern, { cwd: ROOT });
        return { content: [{ type: "text", text: JSON.stringify(matches, null, 2) }] };
      }
      case "search_text": {
        const pattern = String(args.pattern);
        const query = String(args.query);
        const maxMatches = args.maxMatches ? Number(args.maxMatches) : 50;
        const files = await fg(pattern, { cwd: ROOT });
        const results: Array<{ file: string; line: number; snippet: string }> = [];
        for (const rel of files) {
          if (results.length >= maxMatches) break;
          const full = resolveSafe(rel);
          try {
            const content = fs.readFileSync(full, "utf8");
            const lines = content.split(/\r?\n/);
            lines.forEach((line, idx) => {
              if (line.includes(query) && results.length < maxMatches) {
                results.push({ file: rel, line: idx + 1, snippet: line.trim().slice(0, 200) });
              }
            });
          } catch {}
        }
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      }
      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (e: any) {
    return { content: [{ type: "text", text: `Error: ${e.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Filesystem MCP Server running. ROOT=${ROOT}`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
