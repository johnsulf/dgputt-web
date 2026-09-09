// iOS Universal Links. Must be served at /.well-known/apple-app-site-association
// with Content-Type: application/json, HTTP 200 and no redirect.
// https://developer.apple.com/documentation/xcode/supporting-associated-domains

const APPLE_TEAM_ID = "2RJHK34V78";
const BUNDLE_ID_PROD = "com.erlendjohnsen.dgputt";
const BUNDLE_ID_DEV = "com.erlendjohnsen.dgputt.dev";

const association = {
  applinks: {
    details: [
      {
        appIDs: [
          `${APPLE_TEAM_ID}.${BUNDLE_ID_PROD}`,
          `${APPLE_TEAM_ID}.${BUNDLE_ID_DEV}`,
        ],
        components: [{ "/": "/open/*" }],
      },
    ],
  },
};

export function GET() {
  return new Response(JSON.stringify(association), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
