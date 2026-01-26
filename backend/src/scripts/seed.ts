import { connectDatabase, disconnectDatabase } from '../config/database';
import { menuRepository } from '../repositories/menu.repository';
import { customerRepository } from '../repositories/customer.repository';
import { logger } from '../utils/logger.util';
import { COFFEES } from './data/coffees.data';
import { CUSTOMERS } from './data/customers.data';
import { getMenuCollection } from '../models/menu.model';
import { getCustomerCollection } from '../models/customer.model';

async function clearCollections(clearData: boolean = true): Promise<void> {
  if (!clearData) {
    logger.info('Skipping data clear (clearData flag is false)');
    return;
  }

  try {
    const menuCollection = getMenuCollection();
    const customerCollection = getCustomerCollection();

    const menuDeleteResult = await menuCollection.deleteMany({});
    const customerDeleteResult = await customerCollection.deleteMany({});

    logger.info(
      `Cleared existing data: ${menuDeleteResult.deletedCount} menu items, ${customerDeleteResult.deletedCount} customers`
    );
  } catch (error) {
    logger.error('Error clearing collections', error);
    throw error;
  }
}

async function seedMenuItems(): Promise<void> {
  logger.info('Starting to seed menu items...');

  let successCount = 0;
  let failureCount = 0;

  for (const coffeeData of COFFEES) {
    try {
      const result = await menuRepository.create(coffeeData);
      logger.debug(`Created menu item: ${result.name} (₹${result.price})`);
      successCount++;
    } catch (error) {
      logger.error(`Failed to create menu item: ${coffeeData.name}`, error);
      failureCount++;
    }
  }

  logger.info(`Menu items seeded: ${successCount} created, ${failureCount} failed`);
}

async function seedCustomers(): Promise<void> {
  logger.info('Starting to seed customers...');

  let successCount = 0;
  let failureCount = 0;

  for (const customerData of CUSTOMERS) {
    try {
      const result = await customerRepository.create(customerData);
      logger.debug(`Created customer: ${result.fullName} (${result.phone})`);
      successCount++;
    } catch (error) {
      logger.error(`Failed to create customer: ${customerData.fullName}`, error);
      failureCount++;
    }
  }

  logger.info(`Customers seeded: ${successCount} created, ${failureCount} failed`);
}

async function runSeed(): Promise<void> {
  logger.info('Starting database seed process...');

  try {
    // Connect to database
    await connectDatabase();
    logger.info('Connected to database');

    // Get clear flag from command line arguments or default to true
    const clearData = process.argv[2] !== '--no-clear';

    // Clear existing data if flag is true
    await clearCollections(clearData);

    // Seed menu items
    await seedMenuItems();

    // Seed customers
    await seedCustomers();

    logger.info('✅ Database seeding completed successfully!');
  } catch (error) {
    logger.error('❌ Database seeding failed', error);
    throw error;
  } finally {
    // Always disconnect
    await disconnectDatabase();
    logger.info('Disconnected from database');
  }
}

// Run the seed
runSeed()
  .then(() => {
    logger.info('Seed process finished');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Seed process failed with error:', error);
    process.exit(1);
  });
