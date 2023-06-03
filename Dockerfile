# 使用node镜像作为基础镜像，来构建一个能运行React应用的环境
FROM node:16-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 将package.json和package-lock.json复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 打包React应用
RUN npm run build

# 使用nginx作为基础镜像，来部署React应用
FROM nginx:stable-alpine as production-stage

# 将React应用打包后的文件复制到nginx的默认托管目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 将自定义的nginx配置文件复制到容器中
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000 80
# 配置容器启动后运行nginx
CMD ["nginx", "-g", "daemon off;"]