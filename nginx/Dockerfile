FROM alpine:3.20.6

# Installs nginx and openssl packages
RUN apk update && apk upgrade && apk add nginx openssl

# Creates directory for storing SSL certificates and keys
# Creates directory for runtime data (PIDs and other files needed during nginx execution)
RUN mkdir -p /run/nginx

# Copy nginx conf files for later modification into container
COPY ./conf/nginx.conf /etc/nginx/nginx.conf

# Dist contains static frontend files which are directly served by nginx
COPY ./dist /usr/share/nginx/html

# Used to copy created certificates into container
COPY ./tools /etc/nginx/ssl/

RUN chmod -R 755 /etc/nginx

EXPOSE 8443

CMD [ "nginx", "-g", "daemon off;" ]