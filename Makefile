.PHONY: setup env build up down clean

setup: env
	@echo "✓ Environment setup complete!"

env:
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env && \
		echo "✓ Created backend/.env"; \
	else \
		echo "⚠ backend/.env already exists, skipping..."; \
	fi
	@if [ ! -f frontend/.env ]; then \
		cp frontend/.env.example frontend/.env && \
		echo "✓ Created frontend/.env"; \
	else \
		echo "⚠ frontend/.env already exists, skipping..."; \
	fi

build: env
	docker compose build

up: env
	docker compose up -d

down:
	docker compose down

clean:
	docker compose down -v
	rm -f backend/.env frontend/.env

help:
	@echo "Available commands:"
	@echo "  make setup  - Copy .env.example files to .env"
	@echo "  make build  - Build Docker containers (copies .env first)"
	@echo "  make up     - Start Docker containers (copies .env first)"
	@echo "  make down   - Stop Docker containers"
	@echo "  make clean  - Stop containers and remove .env files"