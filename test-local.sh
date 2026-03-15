#!/bin/bash

echo "Testing local build and linting after fix..."

# Test that linting passes (this was the main CI issue)
echo "Running lint check..."
cd /var/home/wind/development/ollamacheck/apps/api
pnpm lint

if [ $? -eq 0 ]; then
    echo "✅ Linting passed successfully"
else
    echo "❌ Linting failed"
    exit 1
fi

# Test that we can at least compile the specific file that had issues
echo "Testing TypeScript compilation of models.ts..."
cd /var/home/wind/development/ollamacheck/apps/api
npx tsc --noEmit src/modules/models/models.ts

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation passed for models.ts"
else
    echo "❌ TypeScript compilation failed for models.ts"
    exit 1
fi

echo "All local tests passed! The CI fix is working correctly."