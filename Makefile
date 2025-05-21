Name = transcendence

.DEFAULT_GOAL = all

FRONTEND = ./frontend
BACKEND = ./backend
CERT_DIR = ./nginx/tools/
CERT_KEY = $(CERT_DIR)/transcendence.key
CERT_CRT = $(CERT_DIR)/transcendence.crt

########################FRONTEND TESTING########################
test_frontend: check_node_module_frontend
	@ cd $(FRONTEND) && cp .env.frontend .env && npm run fulltest

test_frontend_server: check_node_module_frontend
	@ cd $(FRONTEND) && cp .env.frontend .env && npm run server

test_frontend_ui: check_node_module_frontend
	@ cd $(FRONTEND) && cp .env.frontend .env && npm run dev

check_node_module_frontend:
	@if [ ! -d $(FRONTEND)/node_modules ]; then \
		echo "install npm"; \
		cd $(FRONTEND) && npm install; \
	fi

########################BACKEND TESTING########################
test_backend_server: check_node_module_backend
	@ cd $(BACKEND) && npm run dev

test_backend_w_ui: check_node_module_backend check_node_module_frontend
	@ cd $(BACKEND) && cp ../frontend/.env.backend ../frontend/.env && npm run build:ui && npm run dev

check_node_module_backend:
	@if [ ! -d $(BACKEND)/node_modules ]; then \
		echo "install npm"; \
		( \
			cd $(BACKEND) && \
			npm install && \
			echo install fastify v ^3 && \
			npm install fastify@^3 && \
			echo install fastify/static && \
			npm i @fastify/static && \
			npm install @prisma/client && \
			echo "Pushing Prisma schema to the database..." && \
			npx prisma db push && \
			echo "Generating Prisma Client..." && \
			npx prisma generate && \
			echo "Seeding the database..." && \
			npx prisma db seed \
		); \
	fi

########################PROD ENVIRONMENT########################

#nginx container, also containing the frontend dist folder (for serving static frontend files)
nginx_frontend: $(CERT_KEY)  $(CERT_CRT)
	@ cd $(FRONTEND) && cp .env.backend .env && npm run build && cp -r dist ../nginx
#	@ COMPOSE_BAKE=true docker-compose -f docker-compose.yml up -d --build
	@ COMPOSE_BAKE=true docker-compose -f docker-compose.yml up -d --no-deps --build nginx

backend_container: check_node_module_backend
	@ COMPOSE_BAKE=true docker-compose -f docker-compose.yml up -d --no-deps --build fastify

full_prod: $(CERT_KEY)  $(CERT_CRT)
	@ COMPOSE_BAKE=true docker-compose -f docker-compose.yml up -d --build	

down:
	@docker-compose -f docker-compose.yml down

$(CERT_KEY) $(CERT_CRT):
	@mkdir -p $(CERT_DIR)
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout $(CERT_KEY) \
		-out $(CERT_CRT) \
		-subj "/C=FI/ST=/L=Helsinki/O=Hive/OU=42/CN=transcendence/UID=transcendence"