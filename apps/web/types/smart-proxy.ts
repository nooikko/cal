export interface SmartProxyScrapeResult {
  results: {
    content: string;
    headers: {
      date: string;
      vary: string;
      server: string;
      expires: string;
      connection: string;
      'content-type': string;
      'cache-control': string;
      'last-modified': string;
      'content-length': string;
      'x-ips-loggedin': string;
      'referrer-policy': string;
      'x-frame-options': string;
      'content-encoding': string;
      'x-xss-protection': string;
      'content-security-policy': string;
      'x-content-security-policy': string;
    };
    cookies: {
      key: string;
      path: string;
      value: string;
      domain: string;
      secure: boolean;
      comment: string;
      expires: number;
      'max-age': string;
      version: string;
      httponly: string;
      samesite: string;
    }[];
    status_code: number;
    url: string;
    task_id: string;
    created_at: string;
    updated_at: string;
  }[];
}
