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
const FINGERPRINTS_DEV: string[] = [];

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
