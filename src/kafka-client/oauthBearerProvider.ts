import { AccessToken, ClientCredentials } from 'simple-oauth2';

export interface OauthBearerProviderOptions {
  clientId: string;
  clientSecret: string;
  host: string;
  path: string;
  refreshThresholdMs: number;
  scope?: string;
  saslExtension?: { [key: string]: string };
}

export const oauthBearerProvider = (options: OauthBearerProviderOptions) => {
  const client = new ClientCredentials({
    client: {
      id: options.clientId,
      secret: options.clientSecret,
    },
    auth: {
      tokenHost: options.host,
      tokenPath: options.path,
    },
    options: {
      authorizationMethod: 'body',
    },
  });

  let tokenPromise: Promise<string>;
  let accessToken: AccessToken | null;

  async function refreshToken() {
    try {
      if (accessToken == null) {
        accessToken = await client.getToken({
          scope: options.scope,
        });
      }

      // Note: skip auto refresh. Jest runner getting stuck from terminating. No need for auto refresh in test env
      // if (accessToken.expired(options.refreshThresholdMs / 1000)) {
      //   accessToken = await accessToken.refresh();
      // }

      // const nextRefresh = (accessToken.token.expires_in as number) * 1000 - options.refreshThresholdMs;
      // setTimeout(() => {
      //   tokenPromise = refreshToken();
      // }, nextRefresh);

      return accessToken.token.access_token as string;
    } catch (error) {
      const e = error as any;
      accessToken = null;
      console.error(e.data.payload.toString());
      throw error;
    }
  }

  tokenPromise = refreshToken();

  return async function () {
    return {
      value: await tokenPromise,
      extensions: options.saslExtension, // <--- pass sasl extension as key value
    };
  };
};
