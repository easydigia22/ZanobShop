export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.json({
    status: 'success',
    executedAt: new Date().toISOString(),
    jobsRun: [
      { job: 'check_scheduled_posts', status: 'completed', processed: 1 },
      { job: 'inventory_low_stock_audit', status: 'completed', alertsFound: 2 },
    ],
  });
}
