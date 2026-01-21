const express = require("express");
const app = express();
const axios = require("axios");
const os = require('os');
const fs = require("fs");
const path = require("path");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// 所有 env 变量（原样）
const UPLOAD_URL = process.env.UPLOAD_URL || '';
const PROJECT_URL = process.env.PROJECT_URL || '';
const AUTO_ACCESS = process.env.AUTO_ACCESS || false;
const FILE_PATH = process.env.FILE_PATH || '.tmp';
const SUB_PATH = process.env.SUB_PATH || '888';
const UUID = process.env.UUID || '84705c0d-5036-44b1-a07e-d1582e666666';
const NEZHA_SERVER = process.env.NEZHA_SERVER || '';
const NEZHA_PORT = process.env.NEZHA_PORT || '';
const NEZHA_KEY = process.env.NEZHA_KEY || '';
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || 'galzxy-us.xuboa.ggff.net';
const ARGO_AUTH = process.env.ARGO_AUTH || 'eyJhIjoiMjk4Y2QyNWFhZTgyOTUzMjE1ZDk1NjJmMWFhYzA3YzkiLCJ0IjoiN2UzYjcxN2QtNjU5NS00Yjg3LTg0ZmUtOGI0MzlkNjgyMTBmIiwicyI6Ik1XWmpaV014WVdRdE9UbGlaQzAwTURnNUxXRXlaR1l0TVdabU5UVmpZbUkxTldSbSJ9';
const ARGO_PORT = process.env.ARGO_PORT || 8001;
const CFIP = process.env.CFIP || 'cdns.doon.eu.org';
const CFPORT = process.env.CFPORT || 443;
const NAME = process.env.NAME || 'Galaxy';

// 调试端口
console.log('Environment PORT value:', process.env.PORT);
const PORT = process.env.PORT || 8080;  // 强制 fallback 到 8080（Galaxy 常见端口）

// 创建目录（原样）
if (!fs.existsSync(FILE_PATH)) {
  fs.mkdirSync(FILE_PATH);
  console.log(`${FILE_PATH} is created`);
} else {
  console.log(`${FILE_PATH} already exists`);
}

// 生成随机名函数（原样）
function generateRandomName() {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 全局路径常量（原样）
const npmName = generateRandomName();
const webName = generateRandomName();
const botName = generateRandomName();
const phpName = generateRandomName();
let npmPath = path.join(FILE_PATH, npmName);
let phpPath = path.join(FILE_PATH, phpName);
let webPath = path.join(FILE_PATH, webName);
let botPath = path.join(FILE_PATH, botName);
let subPath = path.join(FILE_PATH, 'sub.txt');
let listPath = path.join(FILE_PATH, 'list.txt');
let bootLogPath = path.join(FILE_PATH, 'boot.log');
let configPath = path.join(FILE_PATH, 'config.json');

// 先 listen，让 health check 能打通
app.listen(PORT, () => {
  console.log(`HTTP server started on port ${PORT} (env PORT was ${process.env.PORT || 'not set'})`);
});

// 根路径 - 立即 200 OK，简单文本
app.get("/", (req, res) => {
  res.type('text/plain').status(200).send("OK - Galaxy Health Check Passed");
  console.log('Health check hit on / from', req.ip);  // 日志记录访问
});

// /health 备用（如果以后能改 path）
app.get("/health", (req, res) => {
  res.json({ status: "healthy", port: PORT, uptime: process.uptime() });
});

// 订阅路径（简化，如果 sub.txt 存在就返回）
app.get(`/${SUB_PATH}`, (req, res) => {
  if (fs.existsSync(subPath)) {
    const content = fs.readFileSync(subPath, 'utf-8');
    res.type('text/plain').send(content);
  } else {
    res.status(200).send("Subscription generating...");  // 避免 404
  }
});

// 所有其他函数保持原样（deleteNodes, cleanupOldFiles, generateConfig 等）
// ... 把你原代码的函数全部贴在这里，不要改 ...

// 主启动（异步后台跑，不阻塞 listen）
async function startserver() {
  try {
    argoType();
    deleteNodes();
    cleanupOldFiles();
    await generateConfig();
    await downloadFilesAndRun();
    await extractDomains();
    await AddVisitTask();
    console.log('Background tasks completed');
  } catch (error) {
    console.error('Background tasks error:', error);
  }
}

startserver().catch(err => console.error('Startserver error:', err));

// 清理文件（原样）
cleanFiles();
