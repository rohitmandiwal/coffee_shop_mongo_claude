"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const menu_repository_1 = require("../repositories/menu.repository");
const customer_repository_1 = require("../repositories/customer.repository");
const logger_util_1 = require("../utils/logger.util");
const coffees_data_1 = require("./data/coffees.data");
const customers_data_1 = require("./data/customers.data");
const menu_model_1 = require("../models/menu.model");
const customer_model_1 = require("../models/customer.model");
async function clearCollections(clearData = true) {
    if (!clearData) {
        logger_util_1.logger.info('Skipping data clear (clearData flag is false)');
        return;
    }
    try {
        const menuCollection = (0, menu_model_1.getMenuCollection)();
        const customerCollection = (0, customer_model_1.getCustomerCollection)();
        const menuDeleteResult = await menuCollection.deleteMany({});
        const customerDeleteResult = await customerCollection.deleteMany({});
        logger_util_1.logger.info(`Cleared existing data: ${menuDeleteResult.deletedCount} menu items, ${customerDeleteResult.deletedCount} customers`);
    }
    catch (error) {
        logger_util_1.logger.error('Error clearing collections', error);
        throw error;
    }
}
async function seedMenuItems() {
    logger_util_1.logger.info('Starting to seed menu items...');
    let successCount = 0;
    let failureCount = 0;
    for (const coffeeData of coffees_data_1.COFFEES) {
        try {
            const result = await menu_repository_1.menuRepository.create(coffeeData);
            logger_util_1.logger.debug(`Created menu item: ${result.name} (₹${result.price})`);
            successCount++;
        }
        catch (error) {
            logger_util_1.logger.error(`Failed to create menu item: ${coffeeData.name}`, error);
            failureCount++;
        }
    }
    logger_util_1.logger.info(`Menu items seeded: ${successCount} created, ${failureCount} failed`);
}
async function seedCustomers() {
    logger_util_1.logger.info('Starting to seed customers...');
    let successCount = 0;
    let failureCount = 0;
    for (const customerData of customers_data_1.CUSTOMERS) {
        try {
            const result = await customer_repository_1.customerRepository.create(customerData);
            logger_util_1.logger.debug(`Created customer: ${result.fullName} (${result.phone})`);
            successCount++;
        }
        catch (error) {
            logger_util_1.logger.error(`Failed to create customer: ${customerData.fullName}`, error);
            failureCount++;
        }
    }
    logger_util_1.logger.info(`Customers seeded: ${successCount} created, ${failureCount} failed`);
}
async function runSeed() {
    logger_util_1.logger.info('Starting database seed process...');
    try {
        // Connect to database
        await (0, database_1.connectDatabase)();
        logger_util_1.logger.info('Connected to database');
        // Get clear flag from command line arguments or default to true
        const clearData = process.argv[2] !== '--no-clear';
        // Clear existing data if flag is true
        await clearCollections(clearData);
        // Seed menu items
        await seedMenuItems();
        // Seed customers
        await seedCustomers();
        logger_util_1.logger.info('✅ Database seeding completed successfully!');
    }
    catch (error) {
        logger_util_1.logger.error('❌ Database seeding failed', error);
        throw error;
    }
    finally {
        // Always disconnect
        await (0, database_1.disconnectDatabase)();
        logger_util_1.logger.info('Disconnected from database');
    }
}
// Run the seed
runSeed()
    .then(() => {
    logger_util_1.logger.info('Seed process finished');
    process.exit(0);
})
    .catch((error) => {
    logger_util_1.logger.error('Seed process failed with error:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map