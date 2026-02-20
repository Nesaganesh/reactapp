#!/bin/bash

# Switch between MongoDB and DynamoDB backend implementations

echo "🔧 Flytoez Backend Configuration Switcher"
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    echo "   cd backend && ./switch-database.sh"
    exit 1
fi

# Show current configuration
echo "Current server.js is using:"
if grep -q "mongoose" server.js 2>/dev/null; then
    echo "📊 MongoDB (Mongoose)"
    CURRENT="mongodb"
elif grep -q "dynamodb" server.js 2>/dev/null; then
    echo "📊 DynamoDB (AWS SDK)"
    CURRENT="dynamodb"
else
    echo "⚠️  Unknown configuration"
    CURRENT="unknown"
fi

echo ""
echo "What would you like to switch to?"
echo "1) MongoDB"
echo "2) DynamoDB"
echo "3) Cancel"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔄 Switching to MongoDB..."
        
        # Backup current server.js
        cp server.js server.backup.js
        
        # Check if mongodb version exists
        if [ -f "server.mongodb.js" ]; then
            cp server.mongodb.js server.js
            echo "✅ Switched to MongoDB version"
        else
            echo "⚠️  server.mongodb.js not found"
            echo "   Using original MongoDB implementation"
        fi
        
        echo ""
        echo "📝 Update your .env file with:"
        echo "   MONGODB_URI=your-mongodb-connection-string"
        echo "   PORT=5000"
        echo ""
        echo "📦 Install dependencies:"
        echo "   npm install"
        echo ""
        echo "🚀 Start server:"
        echo "   npm start"
        ;;
        
    2)
        echo ""
        echo "🔄 Switching to DynamoDB..."
        
        # Backup current server.js
        cp server.js server.backup.js
        
        # Use DynamoDB version
        if [ -f "server.dynamodb.js" ]; then
            cp server.dynamodb.js server.js
            echo "✅ Switched to DynamoDB version"
        else
            echo "❌ Error: server.dynamodb.js not found"
            exit 1
        fi
        
        echo ""
        echo "📝 Update your .env file with:"
        echo "   AWS_ACCESS_KEY_ID=your-access-key"
        echo "   AWS_SECRET_ACCESS_KEY=your-secret-key"
        echo "   AWS_REGION=us-east-1"
        echo "   DYNAMODB_TABLE=CostumeMeasurements"
        echo "   PORT=5000"
        echo ""
        echo "📊 Create DynamoDB table:"
        echo "   Table name: CostumeMeasurements"
        echo "   Partition key: id (String)"
        echo "   URL: https://console.aws.amazon.com/dynamodbv2/"
        echo ""
        echo "📦 Install dependencies:"
        echo "   npm install"
        echo ""
        echo "🚀 Start server:"
        echo "   npm start"
        ;;
        
    3)
        echo ""
        echo "❌ Cancelled. No changes made."
        exit 0
        ;;
        
    *)
        echo ""
        echo "❌ Invalid choice. No changes made."
        exit 1
        ;;
esac

echo ""
echo "✅ Switch complete!"
echo ""
echo "📚 Documentation:"
if [ "$choice" = "1" ]; then
    echo "   MongoDB: See README.md or MONGODB_SETUP.md"
else
    echo "   DynamoDB: See DYNAMODB_SETUP.md or DYNAMODB_QUICKSTART.md"
fi
