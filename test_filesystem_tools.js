// 测试 Filesystem MCP 工具
const fs = require('fs');
const path = require('path');

const ROOT = 'D:\\User7\\Github\\MCP_QTY';

// 安全路径解析
function resolveSafe(filePath) {
  const resolved = path.resolve(ROOT, filePath);
  if (!resolved.startsWith(ROOT)) {
    throw new Error(`访问被拒绝: 路径超出根目录范围`);
  }
  return resolved;
}

console.log('=== Filesystem MCP 工具测试 ===\n');
console.log(`ROOT 目录: ${ROOT}\n`);

// 测试 1: list_directory
console.log('【测试 1】list_directory - 列出根目录');
try {
  const targetPath = resolveSafe('.');
  const entries = fs.readdirSync(targetPath);
  const result = entries.map(name => {
    const fullPath = path.join(targetPath, name);
    const stat = fs.statSync(fullPath);
    return {
      name,
      type: stat.isDirectory() ? 'directory' : 'file',
      size: stat.size
    };
  });
  console.log('结果:', JSON.stringify(result, null, 2));
} catch (error) {
  console.error('错误:', error.message);
}

console.log('\n【测试 2】read_file - 读取 README.md');
try {
  const content = fs.readFileSync(resolveSafe('README.md'), 'utf-8');
  console.log('文件内容长度:', content.length, '字符');
  console.log('前 200 字符:', content.substring(0, 200));
} catch (error) {
  console.error('错误:', error.message);
}

console.log('\n【测试 3】write_file - 创建测试文件');
try {
  const testPath = resolveSafe('test_output.txt');
  fs.writeFileSync(testPath, '这是测试文件内容\n生成时间: ' + new Date().toISOString());
  console.log('成功创建文件:', testPath);
  console.log('验证内容:', fs.readFileSync(testPath, 'utf-8'));
} catch (error) {
  console.error('错误:', error.message);
}

console.log('\n【测试 4】search_glob - 搜索所有 package.json 文件');
try {
  const fg = require('fast-glob');
  const results = fg.sync('**/package.json', {
    cwd: ROOT,
    ignore: ['node_modules/**']
  });
  console.log('找到文件:', results);
} catch (error) {
  console.error('错误:', error.message);
}

console.log('\n【测试 5】search_text - 在 README.md 中搜索 "MCP"');
try {
  const searchPath = resolveSafe('.');
  const files = fs.readdirSync(searchPath)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(searchPath, f));
  
  const matches = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes('mcp')) {
        matches.push({
          file: path.relative(ROOT, file),
          line: idx + 1,
          content: line.trim()
        });
      }
    });
  }
  console.log(`找到 ${matches.length} 处匹配:`);
  matches.slice(0, 5).forEach(m => {
    console.log(`  ${m.file}:${m.line} - ${m.content.substring(0, 80)}`);
  });
} catch (error) {
  console.error('错误:', error.message);
}

console.log('\n=== 所有测试完成 ===');
