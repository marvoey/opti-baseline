import { NextResponse } from 'next/server';
import { getDiscoveryManifest } from '../_tools/registry';

export const dynamic = 'force-dynamic';

/** The tool manifest Mark reads. Public and read-only. */
export function GET() {
  return NextResponse.json(getDiscoveryManifest());
}
