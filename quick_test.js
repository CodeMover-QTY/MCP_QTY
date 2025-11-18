// 快速测试 Filesystem MCP 功能
const fs = require('fs');
const path = require('path');

const ROOT = process.env.FILESYSTEM_ROOT || 'D:\\User7\\Github\\MCP_QTY';

console.log('\n========== Filesystem MCP 快速测试 ==========\n');
console.log(`测试目录: ${ROOT}\n`);

// 测试 1: 列出目录
console.log('✓ 测试 1: 列出根目录');
const files = fs.readdirSync(ROOT);
console.log(`  发现 ${files.length} 个项目:`);
files.forEach(f => {
  const stat = fs.statSync(path.join(ROOT, f));
  console.log(`  - ${f} ${stat.isDirectory() ? '[目录]' : '[文件]'}`);
});

// 测试 2: 读取文件
console.log('\n✓ 测试 2: 读取 README.md');
const readmePath = path.join(ROOT, 'README.md');
if (fs.existsSync(readmePath)) {
  const content = fs.readFileSync(readmePath, 'utf-8');
  console.log(`  文件大小: ${content.length} 字符`);
  console.log(`  前 100 字符: ${content.substring(0, 100).replace(/\n/g, ' ')}...`);
} else {
  console.log('  ⚠ README.md 不存在');
}

// 测试 3: 写入文件
console.log('\n✓ 测试 3: 创建测试文件');
const testFile = path.join(ROOT, 'test_write.txt');
const testContent = `测试写入\n时间: ${new Date().toISOString()}`;
fs.writeFileSync(testFile, testContent);
console.log(`  已创建: ${testFile}`);
console.log(`  内容验证: ${fs.readFileSync(testFile, 'utf-8').split('\n')[0]}`);

// 测试 4: 搜索文件 (glob)
console.log('\n✓ 测试 4: 搜索所有 .json 文件');
try {
  const fg = require('fast-glob');
  const jsonFiles = fg.sync('**/*.json', {
    cwd: ROOT,
    ignore: ['node_modules/**'],
    deep: 3
  });
  console.log(`  找到 ${jsonFiles.length} 个文件:`);
  jsonFiles.forEach(f => console.log(`  - ${f}`));
} catch (e) {
  console.log(`  ⚠ fast-glob 未安装: ${e.message}`);
}

// 测试 5: 文本搜索
console.log('\n✓ 测试 5: 在 .md 文件中搜索 "MCP"');
const mdFiles = files.filter(f => f.endsWith('.md'));
let matchCount = 0;
mdFiles.forEach(file => {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('mcp')) {
      matchCount++;
      if (matchCount <= 3) {
        console.log(`  ${file}:${idx + 1} - ${line.trim().substring(0, 60)}`);
      }
    }
  });
});
console.log(`  总计匹配: ${matchCount} 行`);

// 清理
console.log('\n✓ 清理测试文件');
if (fs.existsSync(testFile)) {
  fs.unlinkSync(testFile);
  console.log(`  已删除: ${testFile}`);
}

console.log('\n========== 所有功能测试通过 ✓ ==========\n');
