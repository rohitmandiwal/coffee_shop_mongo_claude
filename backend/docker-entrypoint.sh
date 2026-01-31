#!/bin/sh
set -e

echo "🚀 Coffee Shop Backend - Docker Entrypoint"
echo "=========================================="

# Function to wait for MongoDB
wait_for_mongo() {
    echo "⏳ Waiting for MongoDB to be ready..."

    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if node -e "
            const { MongoClient } = require('mongodb');
            const client = new MongoClient('${MONGO_URI}');
            client.connect()
                .then(() => {
                    console.log('MongoDB is ready');
                    client.close();
                    process.exit(0);
                })
                .catch(() => process.exit(1));
        " 2>/dev/null; then
            echo "✅ MongoDB is ready!"
            return 0
        fi

        echo "   Attempt $attempt/$max_attempts - MongoDB not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done

    echo "❌ MongoDB failed to become ready after $max_attempts attempts"
    exit 1
}

# Function to check if database has data
check_database_data() {
    echo "🔍 Checking if database has data..."

    node -e "
        const { MongoClient } = require('mongodb');
        (async () => {
            const client = new MongoClient('${MONGO_URI}');
            try {
                await client.connect();
                const db = client.db();

                // Check if menu collection exists and has documents
                const collections = await db.listCollections({ name: 'menu' }).toArray();
                if (collections.length === 0) {
                    console.log('EMPTY');
                    process.exit(0);
                }

                const menuCount = await db.collection('menu').countDocuments();
                if (menuCount === 0) {
                    console.log('EMPTY');
                } else {
                    console.log('HAS_DATA');
                }
            } catch (error) {
                console.error('Error checking database:', error.message);
                process.exit(1);
            } finally {
                await client.close();
            }
        })();
    "
}

# Main execution
echo ""
echo "Step 1: Wait for MongoDB"
wait_for_mongo

echo ""
echo "Step 2: Check database state"
DB_STATE=$(check_database_data)

if [ "$DB_STATE" = "EMPTY" ]; then
    echo "📦 Database is empty - Running seed script..."
    npm run seed:no-clear
    if [ $? -eq 0 ]; then
        echo "✅ Database seeded successfully!"
    else
        echo "❌ Database seeding failed!"
        exit 1
    fi
else
    echo "✅ Database already has data - Skipping seed"
fi

echo ""
echo "🎯 Starting Coffee Shop Backend..."
echo "=========================================="
echo ""

# Execute the main command (passed as arguments to the script)
exec "$@"
