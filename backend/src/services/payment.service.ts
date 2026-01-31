import { ObjectId } from 'mongodb';
import { transactionRepository } from '../repositories/transaction.repository';
import { Transaction, PaymentStatus, PaymentMode } from '../types/entities.types';
import { ProcessPaymentInput } from '../schemas/transaction.schema';

export class PaymentService {
  /**
   * Fake Payment Gateway - Simulates payment processing
   * Returns transaction with success or failure based on simulateStatus
   */
  async processPayment(input: ProcessPaymentInput): Promise<Transaction> {
    const gatewayTransactionId = this.generateGatewayTransactionId();
    const attemptedAt = new Date();

    // Simulate payment processing delay (optional)
    await this.simulateDelay(500);

    // Determine payment outcome based on simulation
    const status = input.simulateStatus as PaymentStatus;
    const gatewayResponse = this.getGatewayResponse(status);

    // Create transaction record
    const transaction = await transactionRepository.create({
      customerId: new ObjectId(input.customerId),
      amount: input.amount,
      paymentMode: input.paymentMode as PaymentMode,
      status,
      gatewayTransactionId,
      gatewayResponse,
      attemptedAt,
      completedAt: new Date(),
    });

    return transaction;
  }

  /**
   * Link transaction to order after order is created
   */
  async linkTransactionToOrder(transactionId: ObjectId, orderId: ObjectId): Promise<void> {
    await transactionRepository.updateOrderId(transactionId, orderId);
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(id: string): Promise<Transaction | null> {
    return transactionRepository.findById(id);
  }

  /**
   * Get transaction by order ID
   */
  async getTransactionByOrderId(orderId: string): Promise<Transaction | null> {
    return transactionRepository.findByOrderId(orderId);
  }

  /**
   * Get customer transactions with pagination
   */
  async getCustomerTransactions(
    customerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: Transaction[]; total: number }> {
    return transactionRepository.findByCustomerId(customerId, page, limit);
  }

  /**
   * Get all transactions with pagination
   */
  async getAllTransactions(
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: Transaction[]; total: number }> {
    return transactionRepository.findAll(page, limit);
  }

  // Helper methods

  private generateGatewayTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `TXN${timestamp}${random}`;
  }

  private getGatewayResponse(status: PaymentStatus): string {
    const responses: Record<PaymentStatus, string> = {
      Success: 'Payment processed successfully',
      CardDeclined: 'Card declined by issuing bank',
      InsufficientFunds: 'Insufficient funds in account',
      CardLimitExceeded: 'Transaction exceeds card limit',
    };
    return responses[status];
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const paymentService = new PaymentService();
