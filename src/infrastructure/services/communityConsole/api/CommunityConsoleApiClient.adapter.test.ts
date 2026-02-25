import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommunityConsoleApiClientAdapter } from './CommunityConsoleApiClient.adapter';
import { PermissionDeniedError } from '@/services/communityConsole/api/errors/permissionDenied.error';
import { ApiError } from '@/services/communityConsole/api/errors/apiError.error';
import {
  XClientHeader,
  XClientValue,
} from '@/services/communityConsole/api/requestIdentification/consts';
import { fetch } from '@/common/contentScriptFetch/fetch';

vi.mock('@/common/contentScriptFetch/fetch');
const fetchMock = vi.mocked(fetch);

describe('CommunityConsoleApiClientAdapter', () => {
  const authuser = 1;
  const adapter = new CommunityConsoleApiClientAdapter(authuser);
  const method = 'TestMethod';
  const body = { 1: 'test' };

  beforeEach(() => {
    fetchMock.mockReset();
  });

  describe('send', () => {
    it('should send a request to the Community Console API URL with the stringified JSON body and a POST method', async () => {
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({}), { status: 200 }),
      );

      await adapter.send(method, body, { authenticated: true });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(
          `https://support.google.com/s/community/api/${method}`,
        ),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        }),
      );
    });

    it('should return the JSON-parsed response body when the response status code is 200', async () => {
      const responseData = { 2: 'response' };
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify(responseData), { status: 200 }),
      );

      const result = await adapter.send(method, body, { authenticated: true });

      expect(result).toEqual(responseData);
    });

    it('should throw a PermissionDeniedError when the response status code is 400 and contains a PermissionDenied error code', async () => {
      const responseBody = JSON.stringify({ 2: 7 });
      fetchMock.mockResolvedValue(new Response(responseBody, { status: 400 }));

      await expect(
        adapter.send(method, body, { authenticated: true }),
      ).rejects.toThrow(PermissionDeniedError);
    });

    it('should throw an ApiError when the response status code is 404', async () => {
      // On error the Google server can return HTML, so we're simulating this
      // with a simplified HTML response.
      fetchMock.mockResolvedValue(
        new Response('<!DOCTYPE html><html><body><h1>Not Found</h1>', {
          status: 404,
        }),
      );

      await expect(
        adapter.send(method, body, { authenticated: true }),
      ).rejects.toThrow(ApiError);
    });

    it('should throw an ApiError when the response status code is 400 and contains another error code', async () => {
      const responseBody = JSON.stringify({ 2: 3 }); // INVALID_ARGUMENT
      fetchMock.mockResolvedValue(new Response(responseBody, { status: 400 }));

      await expect(
        adapter.send(method, body, { authenticated: true }),
      ).rejects.toThrow(ApiError);
    });

    describe('authentication', () => {
      beforeEach(() => {
        fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));
      });

      describe.for([{ authenticated: true }, {}, undefined])(
        'when options = %o',
        (options) => {
          it('should include credentials', async () => {
            await adapter.send(method, body, options);
            expect(fetchMock).toHaveBeenCalledWith(
              expect.any(String),
              expect.objectContaining({ credentials: 'include' }),
            );
          });

          it('should not set the authuser parameter in the URL when authuser = 0', async () => {
            const adapter0 = new CommunityConsoleApiClientAdapter(0);
            await adapter0.send(method, body, options);
            expect(fetchMock).toHaveBeenCalledWith(
              expect.not.stringMatching(/\?(?:.*&)?authuser=/),
              expect.any(Object),
            );
          });

          it('should set the authuser parameter in the URL when authuser > 0', async () => {
            await adapter.send(method, body, options);
            expect(fetchMock).toHaveBeenCalledWith(
              expect.stringMatching(
                new RegExp(`\\?(?:.*&)?authuser=${authuser}`),
              ),
              expect.any(Object),
            );
          });
        },
      );

      it('should omit credentials when authenticated = false', async () => {
        await adapter.send(method, body, { authenticated: false });
        expect(fetchMock).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ credentials: 'omit' }),
        );
      });
    });

    it('should set the identification headers', async () => {
      fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));
      await adapter.send(method, body, { authenticated: true });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            [XClientHeader]: XClientValue,
          }),
        }),
      );
    });
  });
});
