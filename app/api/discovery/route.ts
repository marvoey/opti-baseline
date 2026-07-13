import { NextResponse } from 'next/server';
import { getDiscoveryManifest } from '../_tools/registry';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(getDiscoveryManifest());
}
