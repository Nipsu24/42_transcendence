Name = transcendence

.DEFAULT_GOAL = all

FRONTEND = ./frontend
BACKEND = ./backend

########################FRONTEND TESTING########################
test_frontend: check_node_module_frontend
	@ cd $(FRONTEND) && npm run fulltest

test_frontend_server: check_node_module_frontend
	@ cd $(FRONTEND) && npm run server

test_frontend_ui: check_node_module_frontend
	@ cd $(FRONTEND) && npm run dev

check_node_module_frontend:
	@if [ ! -d $(FRONTEND)/node_modules ]; then \
		echo "install npm"; \
		cd $(FRONTEND) && npm install; \
	fi

########################BACKEND TESTING########################
test_backend_server: check_node_module_backend
	@ cd $(BACKEND) && npm run dev

check_node_module_backend:
	@if [ ! -d $(BACKEND)/node_modules ]; then \
		echo "install npm"; \
		( \
			cd $(BACKEND) && \
			npm install && \
			npm install @prisma/client && \
			echo "Pushing Prisma schema to the database..." && \
			npx prisma db push && \
			echo "Generating Prisma Client..." && \
			npx prisma generate && \
			echo "Seeding the database..." && \
			npx prisma db seed \
		); \
	fi


