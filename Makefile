# Makefile for Learn Node UI
# Provides convenient commands for development, testing, and deployment

.PHONY: help install dev start lint format validate clean docker-build docker-run docker-stop docker-logs test-accessibility test-lighthouse all

# Default target
.DEFAULT_GOAL := help

# Variables
IMAGE_NAME := learn-node-ui
CONTAINER_NAME := learn-node-ui
PORT := 8080
API_URL := http://localhost:3000

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

##@ General

help: ## Display this help message
	@echo "$(BLUE)Learn Node UI - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(GREEN)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install development dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)Dependencies installed successfully$(NC)"

dev: ## Start development server
	@echo "$(BLUE)Starting development server on port $(PORT)...$(NC)"
	npm run dev

start: ## Start development server and open browser
	@echo "$(BLUE)Starting development server on port $(PORT) and opening browser...$(NC)"
	npm start

serve: start ## Alias for start

##@ Code Quality

lint: ## Run all linters
	@echo "$(BLUE)Running linters...$(NC)"
	npm run lint
	@echo "$(GREEN)Linting completed$(NC)"

lint-html: ## Lint HTML files
	@echo "$(BLUE)Linting HTML files...$(NC)"
	npm run lint:html

lint-css: ## Lint CSS files
	@echo "$(BLUE)Linting CSS files...$(NC)"
	npm run lint:css

lint-js: ## Lint JavaScript files
	@echo "$(BLUE)Linting JavaScript files...$(NC)"
	npm run lint:js

format: ## Format all code files
	@echo "$(BLUE)Formatting code...$(NC)"
	npm run format
	@echo "$(GREEN)Formatting completed$(NC)"

format-html: ## Format HTML files
	npm run format:html

format-css: ## Format CSS files
	npm run format:css

format-js: ## Format JavaScript files
	npm run format:js

validate: ## Validate and format code
	@echo "$(BLUE)Validating code...$(NC)"
	npm run validate
	@echo "$(GREEN)Validation completed$(NC)"

##@ Docker

docker-build: ## Build Docker image
	@echo "$(BLUE)Building Docker image...$(NC)"
	docker build -t $(IMAGE_NAME):latest .
	@echo "$(GREEN)Docker image built successfully$(NC)"

docker-run: ## Run Docker container
	@echo "$(BLUE)Running Docker container...$(NC)"
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):80 \
		-e API_URL=$(API_URL) \
		-e ENVIRONMENT=production \
		$(IMAGE_NAME):latest
	@echo "$(GREEN)Container started successfully$(NC)"
	@echo "Access the application at: http://localhost:$(PORT)"

docker-stop: ## Stop and remove Docker container
	@echo "$(BLUE)Stopping Docker container...$(NC)"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	@echo "$(GREEN)Container stopped and removed$(NC)"

docker-logs: ## Show Docker container logs
	@echo "$(BLUE)Showing container logs...$(NC)"
	docker logs -f $(CONTAINER_NAME)

docker-shell: ## Open shell in running container
	@echo "$(BLUE)Opening shell in container...$(NC)"
	docker exec -it $(CONTAINER_NAME) /bin/bash

docker-restart: docker-stop docker-run ## Restart Docker container

docker-clean: ## Remove Docker image and container
	@echo "$(BLUE)Cleaning Docker resources...$(NC)"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	docker rmi $(IMAGE_NAME):latest || true
	@echo "$(GREEN)Docker cleanup completed$(NC)"

##@ Testing

test-accessibility: ## Run accessibility tests
	@echo "$(BLUE)Running accessibility tests...$(NC)"
	npm run test:accessibility

test-lighthouse: ## Run Lighthouse performance test
	@echo "$(BLUE)Running Lighthouse test...$(NC)"
	npm run test:lighthouse

test: test-accessibility ## Run all tests

##@ Cleanup

clean: ## Clean dependencies and build artifacts
	@echo "$(BLUE)Cleaning project...$(NC)"
	rm -rf node_modules package-lock.json
	@echo "$(GREEN)Cleanup completed$(NC)"

clean-all: clean docker-clean ## Clean everything including Docker resources

##@ CI/CD

ci: validate test ## Run CI pipeline (validate and test)
	@echo "$(GREEN)CI pipeline completed successfully$(NC)"

deploy-prep: validate docker-build ## Prepare for deployment
	@echo "$(GREEN)Deployment preparation completed$(NC)"

##@ Shortcuts

all: install validate test ## Install, validate, and test everything
	@echo "$(GREEN)All tasks completed successfully$(NC)"

quick: lint format ## Quick code quality check and fix
	@echo "$(GREEN)Quick check completed$(NC)"
