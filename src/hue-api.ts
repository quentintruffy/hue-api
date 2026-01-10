import https from 'node:https';
import { HueApiError, HueApiListResponse, LightGet } from './hue-types';

/**
 * Philips Hue API client
 * @see https://developers.meethue.com/develop/hue-api/
 */
class HueApi {
  /**
   * The host of the Hue API
   * @example "https://192.168.1.100"
   */
  private host: string;
  /**
   * The username of the Hue API
   * @example "1234567890"
   */
  private username: string;

  /**
   * Create a new Hue API client
   * @param host - Bridge IP address (e.g., "192.168.1.100")
   * @param username - Authentication key generated during pairing
   */
  constructor(host: string, username: string) {
    this.host = host;
    this.username = username;
  }

  /* ============================================================================
   * Generic API
   * ========================================================================== */

  async get<T>({
    path,
    body,
    retries = 3,
    timeoutMs = 8000,
  }: {
    path: string;
    body?: any;
    retries?: number;
    timeoutMs?: number;
  }): Promise<HueApiListResponse<T>> {
    try {
      // Create the URL
      const url = new URL(`https://${this.host}/clip/v2/resource${path}`);

      // Create the abort controller and timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        // Fetch the resource
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'hue-application-key': this.username,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        // Clear the timeout
        clearTimeout(timeout);

        // Check if the response is ok
        if (!response.ok) {
          const errors = await response.text();
          throw errors;
        }

        // Parse the response as JSON
        const json = await response.json();

        // Return the JSON
        return json as HueApiListResponse<T>;
      } catch (error) {
        // Clear the timeout
        clearTimeout(timeout);

        throw {
          errors: [
            {
              description: 'An error occurred while fetching the resource',
            },
          ],
        };
      }
    } catch (error) {
      // If there is an error, retry the request
      if (retries > 0) {
        // Retry the request
        return this.get<T>({ path, retries: retries - 1, timeoutMs });
      }

      let err: HueApiError[] = (error as any).errors as HueApiError[];

      // Return null if the resource is not found
      return {
        errors: err as HueApiError[],
        data: [],
      };
    }
  }

  /* ============================================================================
   * Light API
   * ========================================================================== */

  async getLights(): Promise<HueApiListResponse<LightGet>> {
    console.log('Getting lights...');
    return this.get<LightGet>({
      path: '/lights',
    });
  }
}

export { HueApi };
