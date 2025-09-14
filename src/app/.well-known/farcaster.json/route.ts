import { NextResponse } from 'next/server';

export async function GET() {
  // Account Association を含むJSONレスポンスを返す
  const farcasterManifest = {
    "accountAssociation": {
      "header": "eyJmaWQiOjEwOTU1NDgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0Nzc3REYzMzFCNTczMTc1N2FGOEY4MTcwMTIzNmI2NUZiYmRENkI0In0",
      "payload": "eyJkb21haW4iOiJlc2Nyb3ctYXBwLXNldmVuLnZlcmNlbC5hcHAifQ",
      "signature": "MHg3NzhjNzYyOTMwOGE0ODRiN2VhMWMyODE3OTkxOTI3NmRkNmE1NjU5ODIxNDM4ZDM5NmIyN2ZlYzAxN2IzZDEwMDMxMzEyODVkOTljMjE1MzdiM2NjNTJjM2I4ZGZiMWRmYWIyOGY3ZmZjNDE5ZmUwY2QwNWE1YmM2MTIxNzc1OTFj"
    }
  };

  return NextResponse.json(farcasterManifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600', // 1時間キャッシュ
    },
  });
}
