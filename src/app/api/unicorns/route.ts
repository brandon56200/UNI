import { NextResponse } from 'next/server';
import { Chakra } from '@chakra-dev/js-sdk';

export interface Unicorn {
  id: string;
  name: string;
  city: string;
  industry: string;
  investors: string[];
  valuation: number;
  foundedYear: number;
  description: string;
}

// Remove edge runtime since we want to use Node.js features
// export const runtime = 'edge';

export async function GET() {
  // Log at the very start
  console.log('Starting unicorns API request');

  // Check environment variables first
  if (!process.env.CHAKRA_ACCESS_KEY || !process.env.CHAKRA_SECRET_KEY || !process.env.CHAKRA_USERNAME) {
    console.error('Missing required environment variables');
    return NextResponse.json(
      { error: 'Missing required environment variables' },
      { status: 500 }
    );
  }

  try {
    // Initialize the Chakra client with the correct format
    const chakra = new Chakra(`${process.env.CHAKRA_ACCESS_KEY}:${process.env.CHAKRA_SECRET_KEY}:${process.env.CHAKRA_USERNAME}`);
    
    // Login to get the bearer token
    await chakra.login();

    console.log('Querying unicorns using Chakra SDK...');
    
    // Execute the query
    const response = await chakra.execute(
      'SELECT * FROM unicorns LIMIT 500'
    );

    console.log(`Successfully fetched ${response?.length || 0} unicorns`);
    console.log('First unicorn record:', response?.[0]);
    console.log('Response structure:', JSON.stringify(response?.[0], null, 2));
    
    return NextResponse.json({ unicorns: response });
  } catch (error) {
    console.error('Error in unicorns API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch unicorns',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 