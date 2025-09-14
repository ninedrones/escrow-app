import { NextResponse } from 'next/server';

export async function GET() {
  // Farcaster Hosted Manifest URLに307リダイレクト
  return NextResponse.redirect(
    'https://api.farcaster.xyz/miniapps/hosted-manifest/01994aa1-65fa-c2af-dd85-7356cc88d601',
    307 // Temporary Redirect
  );
}
