import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { transactionRepository } from '../repositories/transaction.repository';
import prisma from '../config/db';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

export const reportQueue = new Queue('ReportQueue', { connection });
export const cronQueue = new Queue('CronQueue', { connection });

// Schedule daily recurring cron job
cronQueue.add('process-recurring', {}, {
  repeat: {
    pattern: '0 0 * * *' // Run daily at midnight
  }
});

// Worker that processes recurring transactions
export const cronWorker = new Worker('CronQueue', async (job) => {
  if (job.name === 'process-recurring') {
    console.log('Running daily recurring transactions check...');
    // In a real system, you would query for transactions where isRecurring=true
    // and recurrenceRule matches the current date, then duplicate them.
    const recurringTrans = await prisma.transaction.findMany({
      where: { isRecurring: true }
    });
    
    console.log(`Found ${recurringTrans.length} recurring rules.`);
    // Process duplication logic here...
  }
}, { connection });

// Worker that processes background analytics jobs
export const reportWorker = new Worker(
  'ReportQueue',
  async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    const { userId } = job.data;
    
    // Aggregate user transactions (simulating complex data pipeline)
    const transactions = await transactionRepository.findByUserId(userId);
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(t => {
      if (t.type === 'INCOME') totalIncome += t.amount;
      else if (t.type === 'EXPENSE') totalExpense += t.amount;
    });
    
    console.log(`Processed report for ${userId}: Income: ${totalIncome}, Expense: ${totalExpense}`);
    return { totalIncome, totalExpense, net: totalIncome - totalExpense };
  },
  { connection }
);

reportWorker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed!`);
});

reportWorker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
});
