#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 执行打包
gulp pub

#登录npm
npm adduser

#发布
npm publish
cd -