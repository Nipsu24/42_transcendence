Name = transcendence

.DEFAULT_GOAL = prod

FRONTEND = ./frontend
BACKEND = ./backend
GAME = ./frontend/game
CERT_DIR = ./nginx/tools/
CERT_KEY = $(CERT_DIR)/transcendence.key
CERT_CRT = $(CERT_DIR)/transcendence.crt

########################FRONTEND TESTING########################

# builds frontend test environemnt with 'mock' json-server
test_frontend: check_node_module_frontend
	@ cd $(FRONTEND) && cp .env.frontend .env && npm run fulltest

# builds mock json-server (probably not really needed individually)
test_frontend_server: check_node_module_frontend
	@ cd $(FRONTEND) && cp .env.frontend .env && npm run server

# builds only frontend server without mock json-server
test_frontend_ui: check_node_module_frontend
	@ cd $(FRONTEND) && cp .env.frontend .env && npm run dev

# builds only the game
test_game: check_node_module_game
	@ cd $(GAME) && npm run build

run_game: # just for quick testing purposes
	@ cd $(GAME) && npm start 
	
# chekcs if requirements for compiling frontend fullfilled (Added tailwindcss)
check_node_module_frontend:
	@if [ ! -d $(FRONTEND)/node_modules ]; then \
		echo "install npm"; \
		( \
			cd $(FRONTEND) && \
			npm install && \
			npm install react-router-dom && \
			npm install --save-dev \
				typescript \
				@types/react \
				@types/react-dom \
				vite \
				@vitejs/plugin-react \
				tailwindcss@latest \
				postcss \
 				autoprefixer \
 				@tailwindcss/vite@latest \
				jest ; \
		); \
	fi

# chekcs if requirements for compiling game fulfilled
check_node_module_game:
	@if [ ! -d $(GAME)/node_modules ]; then \
		echo "install npm"; \
		cd $(GAME) && npm install; \
	fi

########################BACKEND TESTING########################

# starts backend server, can be tested with e.g. requests dir or postman
test_backend_server: check_node_module_backend
	@ cd $(BACKEND) && npm run dev

# full test with both backend and frontend
test_backend_w_ui: check_node_module_backend check_node_module_frontend
	@ cd $(BACKEND) && cp ../frontend/.env.backend ../frontend/.env && npm run build:ui && npm run dev

# checks requirements for compiling backend
check_node_module_backend:
	@if [ ! -d $(BACKEND)/node_modules ]; then \
		echo "install npm"; \
		( \
			cd $(BACKEND) && \
			npm install fastify@^5.0.0 && \
			echo install fastify/static && \
			npm install @fastify/static@8 && \
			echo install fastify/jwt && \
			npm install @fastify/jwt && \
			npm i @fastify/multipart && \
			npm install --save-dev jest && \
			npm install supertest --save-dev && \
			npm install sequelize sqlite3 && \
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
nginx_frontend: $(CERT_KEY)  $(CERT_CRT) check_node_module_frontend
	@ cd $(FRONTEND) && cp .env.backend .env && npm run build && cp -r dist ../nginx
	@ COMPOSE_BAKE=true docker-compose -f docker-compose.yml up -d --no-deps --build nginx

# builds backend container
backend_container: check_node_module_backend
	@ COMPOSE_BAKE=true docker-compose -f docker-compose.yml up -d --no-deps --build fastify

# full production environment, building both nginx (frontend) and backend container
prod: $(CERT_KEY)  $(CERT_CRT) check_node_module_frontend
	@ cd $(FRONTEND) && cp .env.backend .env && npm run build && cp -r dist ../nginx
	@ COMPOSE_BAKE=true docker-compose -f docker-compose.yml up -d --build	
# NEW!! 
# add for the prod testing with seed.js
	@ docker exec -i fastify_backend npx prisma db seed

# removes all built containers
down:
	@docker-compose -f docker-compose.yml down

# creates keys for secure https connection, used by nginx
$(CERT_KEY) $(CERT_CRT):
	@mkdir -p $(CERT_DIR)
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout $(CERT_KEY) \
		-out $(CERT_CRT) \
		-subj "/C=FI/ST=/L=Helsinki/O=Hive/OU=42/CN=transcendence/UID=transcendence"

fclean: down
	@echo "remove frontend node_modules"
	@rm -rf $(FRONTEND)/node_modules
	@echo "remove game node_modules"
	@rm -rf $(GAME)/node_modules
	@echo "remove backend node_modules"
	@rm -rf $(BACKEND)/node_modules
	@echo "remove frontend dist directory"
	@rm -rf $(BACKEND)/dist
	@echo "remove backend dist directory"
	@rm -rf $(BACKEND)/dist
	@echo "remove nginx dist directory"
	@rm -rf ./nginx/dist
	@echo "remove nginx certificates"
	@rm -rf ./nginx/tools

.PHONY: test_frontend test_frontend_server test_frontend_ui \
		check_node_module_frontend test_backend_server test_backend_w_ui \
		check_node_module_backend nginx_frontend backend_container prod down \
		test_game