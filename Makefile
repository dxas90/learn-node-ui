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
RED := \033[31m
GREEN := \033[32m
YELLOW := \033[33m
BLUE := \033[34m
NC := \033[0m # No Color

##@ General

help: ## Display this help message
	@echo -e "$(BLUE)Learn Node UI - Available Commands$(NC)"
	@echo -e ""
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make $(GREEN)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install development dependencies
	@echo -e "$(BLUE)Installing dependencies...$(NC)"
	npm install
	@echo -e "$(GREEN)Dependencies installed successfully$(NC)"

dev: ## Start development server
	@echo -e "$(BLUE)Starting development server on port $(PORT)...$(NC)"
	npm run dev

start: ## Start development server and open browser
	@echo -e "$(BLUE)Starting development server on port $(PORT) and opening browser...$(NC)"
	npm start

serve: start ## Alias for start

##@ Code Quality

lint: ## Run all linters
	@echo -e "$(BLUE)Running linters...$(NC)"
	npm run lint
	@echo -e "$(GREEN)Linting completed$(NC)"

lint-html: ## Lint HTML files
	@echo -e "$(BLUE)Linting HTML files...$(NC)"
	npm run lint:html

lint-css: ## Lint CSS files
	@echo -e "$(BLUE)Linting CSS files...$(NC)"
	npm run lint:css

lint-js: ## Lint JavaScript files
	@echo -e "$(BLUE)Linting JavaScript files...$(NC)"
	npm run lint:js

format: ## Format all code files
	@echo -e "$(BLUE)Formatting code...$(NC)"
	npm run format
	@echo -e "$(GREEN)Formatting completed$(NC)"

format-html: ## Format HTML files
	npm run format:html

format-css: ## Format CSS files
	npm run format:css

format-js: ## Format JavaScript files
	npm run format:js

validate: ## Validate and format code
	@echo -e "$(BLUE)Validating code...$(NC)"
	npm run validate
	@echo -e "$(GREEN)Validation completed$(NC)"

##@ Docker

docker-build: ## Build Docker image
	@echo -e "$(BLUE)Building Docker image...$(NC)"
	docker build -t $(IMAGE_NAME):latest .
	@echo -e "$(GREEN)Docker image built successfully$(NC)"

docker-run: ## Run Docker container
	@echo -e "$(BLUE)Running Docker container...$(NC)"
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):80 \
		-e API_URL=$(API_URL) \
		-e ENVIRONMENT=production \
		$(IMAGE_NAME):latest
	@echo -e "$(GREEN)Container started successfully$(NC)"
	@echo -e "Access the application at: http://localhost:$(PORT)"

docker-stop: ## Stop and remove Docker container
	@echo -e "$(BLUE)Stopping Docker container...$(NC)"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	@echo -e "$(GREEN)Container stopped and removed$(NC)"

docker-logs: ## Show Docker container logs
	@echo -e "$(BLUE)Showing container logs...$(NC)"
	docker logs -f $(CONTAINER_NAME)

docker-shell: ## Open shell in running container
	@echo -e "$(BLUE)Opening shell in container...$(NC)"
	docker exec -it $(CONTAINER_NAME) /bin/bash

docker-restart: docker-stop docker-run ## Restart Docker container

docker-clean: ## Remove Docker image and container
	@echo -e "$(BLUE)Cleaning Docker resources...$(NC)"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	docker rmi $(IMAGE_NAME):latest || true
	@echo -e "$(GREEN)Docker cleanup completed$(NC)"

##@ Testing

test-accessibility: ## Run accessibility tests
	@echo -e "$(BLUE)Running accessibility tests...$(NC)"
	npm run test:accessibility

test-lighthouse: ## Run Lighthouse performance test
	@echo -e "$(BLUE)Running Lighthouse test...$(NC)"
	npm run test:lighthouse

test: test-accessibility ## Run all tests

##@ Cleanup

clean: ## Clean dependencies and build artifacts
	@echo -e "$(BLUE)Cleaning project...$(NC)"
	rm -rf node_modules package-lock.json
	@echo -e "$(GREEN)Cleanup completed$(NC)"

clean-all: clean docker-clean ## Clean everything including Docker resources

##@ CI/CD

ci: validate test ## Run CI pipeline (validate and test)
	@echo -e "$(GREEN)CI pipeline completed successfully$(NC)"

deploy-prep: validate docker-build ## Prepare for deployment
	@echo -e "$(GREEN)Deployment preparation completed$(NC)"

##@ Shortcuts

all: install validate test ## Install, validate, and test everything
	@echo -e "$(GREEN)All tasks completed successfully$(NC)"

quick: lint format ## Quick code quality check and fix
	@echo -e "$(GREEN)Quick check completed$(NC)"
