# web-base:v3.6.1 是 能够兼容 arm64 的版本
#FROM registry.cn-beijing.aliyuncs.com/yunionio/web-base:v3.6.1
FROM artifactory.ep.chehejia.com/it-docker-test-local/cloudpods/web-base:prod-v3.8.5.1

COPY ./dist /usr/share/nginx/html/web
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
