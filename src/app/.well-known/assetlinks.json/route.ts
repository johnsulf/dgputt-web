// Android App Links. Must be served at /.well-known/assetlinks.json
// with Content-Type: application/json, HTTP 200 and no redirect.
// https://developer.android.com/training/app-links/verify-android-applinks

const PACKAGE_PROD = "com.erlendjohnsen.dgputt";
const PACKAGE_DEV = "com.erlendjohnsen.dgputt.dev";

// SHA-256 certificate fingerprints, upper-case hex with colons.
// Prod: the Play App Signing certificate (Play Console → Setup → App signing),
// NOT the upload key.
const FINGERPRINTS_PROD: string[] = [];

// Dev: the debug certificate of every machine that builds debug builds, plus
// the release certificate used for release dev builds.
const FINGERPRINTS_DEV: string[] = [
  // Atle's Mac, ~/.android/debug.keystore, alias androiddebugkey
  "F0:FD:CF:C8:2B:DB:29:71:1C:2F:1F:DC:FA:A4:31:02:4A:FC:5A:DE:3F:F4:A2:97:FA:A0:45:AC:AE:E8:18:D5",
];

const statements = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: PACKAGE_PROD,
      sha256_cert_fingerprints: FINGERPRINTS_PROD,
    },
  },
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: PACKAGE_DEV,
      sha256_cert_fingerprints: FINGERPRINTS_DEV,
    },
  },
];

export function GET() {
  return new Response(JSON.stringify(statements), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
