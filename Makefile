# Build and deployment control
.PHONY: full clean package deploy help

# Full deployment pipeline
full: clean package deploy
	@echo "✅ Full deployment completed"

# Clean build artifacts
clean:
	@echo "Cleaning up..."
	@rm -rf dist node_modules
	@echo "Clean complete"

# Install dependencies and package
package: install
	@echo "Packaging Lambda code..."
	@mkdir -p dist
	@zip -r dist/function.zip \
		src/ \
		node_modules/ \
		package.json
	@echo "📦 Packaging complete"

# Install dependencies if package.json changes
install: package.json
	@echo "Installing dependencies..."
	@npm install --production
	@touch node_modules  # Mark as up-to-date

# Deploy to AWS Lambda
deploy: package
	@echo "Deploying Lambda code..."
	@aws lambda update-function-code \
		--function-name cors-proxy \
		--zip-file fileb://dist/function.zip
	@echo "✅ Lambda updated"
