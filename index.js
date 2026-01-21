const express = require("express");
const app = express();
const axios = require("axios");
const os = require('os');
const fs = require("fs");
const path = require("path");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const UPLOAD_URL = process.env.UPLOAD_URL || '';      
const PROJECT_URL = process.env.PROJECT_URL || '';    
const AUTO_ACCESS = process.env.AUTO_ACCESS || false; 
const FILE_PATH = process.env.FILE_PATH || '.tmp';    
const SUB_PATH = process.env.SUB_PATH || '888';       
const PORT = process.env.PORT || 3000;                // 必须用 process.env.PORT，Galaxy 会注入
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

// 创建运行文件夹
if (!fs.existsSync(FILE_PATH)) {
  fs.mkdirSync(FILE_PATH);
  console.log(`${FILE_PATH} is created`);
} else {
  console.log(`${FILE_PATH} already exists`);
}

// 生成随机6位字符文件名
function generateRandomName() {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 全局常量
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

// 先启动 HTTP 服务，让 health check 能立即通过
app.listen(PORT, () => {
  console.log(`HTTP server is running on port: ${PORT}`);
});

// 根路径健康检查 - 立即返回 200 OK
app.get("/", (req, res) => {
  res.status(200).send("OK - Service is running");
});

// 可选：专用健康检查路径（如果平台允许改 health check path 为 /health）
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", uptime: process.uptime() });
});

// 以下是原来的所有函数和逻辑（保持不变，只移到 listen 之后执行）
app.get(`/${SUB_PATH}`, (req, res) => {
  // 你的订阅路径逻辑（如果 sub.txt 已生成）
  if (fs.existsSync(subPath)) {
    const content = fs.readFileSync(subPath, 'utf-8');
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(content);
  } else {
    res.status(404).send("Subscription not ready yet");
  }
});

// 其他函数保持原样（deleteNodes, cleanupOldFiles, generateConfig, getSystemArchitecture, downloadFile 等）
function deleteNodes() { /* 原代码不变 */ }
function cleanupOldFiles() { /* 原代码不变 */ }
async function generateConfig() { /* 原代码不变 */ }
function getSystemArchitecture() { /* 原代码不变 */ }
function downloadFile(fileName, fileUrl, callback) { /* 原代码不变 */ }
async function downloadFilesAndRun() { /* 原代码不变 */ }
function getFilesForArchitecture(architecture) { /* 原代码不变 */ }
function argoType() { /* 原代码不变 */ }
async function extractDomains() { /* 原代码不变 */ }
async function getMetaInfo() { /* 原代码不变 */ }
async function generateLinks(argoDomain) { /* 原代码不变 */ }
async function uploadNodes() { /* 原代码不变 */ }
function cleanFiles() { /* 原代码不变 */ }
async function AddVisitTask() { /* 原代码不变 */ }
async function startserver() {
  try {
    argoType();
    deleteNodes();
    cleanupOldFiles();
    await generateConfig();
    await downloadFilesAndRun();
    await extractDomains();
    await AddVisitTask();
  } catch (error) {
    console.error('Error in startserver:', error);
  }
}

// 启动后台任务
startserver().catch(error => {
  console.error('Unhandled error in startserver:', error);
});

// 90s后清理文件（原逻辑）
cleanFiles();
