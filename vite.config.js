import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import {fileURLToPath,URL} from "node:url";
import fs from "fs"
import path from "path"
import child_process from "child_process"
import env from "process"
import { exists } from "@tauri-apps/api/fs";
import { existsSync } from "node:fs";
import { error } from "node:console";
const envConfig = loadEnv("development",process.cwd())
const baseFolder = env.APPDATA !== undefined && env.APPDATA !== "" ? `${env.APPDATA}/ASP.NET/https` :  `${env.HOME}/.aspnet/https` 
const certificateName = "tarui-crud-cargo"
const certFilePath = path.join(baseFolder,`${certificateName}.pem`)
const keyFilePath = path.join(baseFolder,`${certificateName}.key`)
if(!fs.existsSync(certFilePath) || fs.existsSync(keyFilePath)){
  if(0 !== child_process.spawnSync("dotnet",[
    "dev-certs",
    "https",
    "--export-path",
    certFilePath,
    "--format",
    "Pem",
    "--no-password"
  ],{
    stdio: "inherit",

  }).status){
      throw new Error("could not create certificate")
  }
}
const target = envConfig.VITE_ASPNETCORE_HTTPS_PORT ? `https://localhost:${envConfig.VITE_ASPNETCORE_HTTPS_PORT}`: envConfig.VITE_ASPNETCORE_URLS ? envConfig.VITE_ASPNETCORE_URLS.split(";")[0] : `https://localhost:5046`
// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    proxy: {
      '^/wheaterforecast':{target,secure:false},
    },
    https:{
      key: fs.readFileSync(keyFilePath),
      cert:fs.readFileSync(certFilePath),
    },
    port: 1420,
    strictPort: true,
    watch: {
     
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
