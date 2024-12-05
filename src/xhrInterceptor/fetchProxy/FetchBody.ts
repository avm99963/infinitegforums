export default class FetchBody {
  constructor(private body: RequestInit['body'] | undefined) {}

  async getJSONRequestBody() {
    if (!this.body) return undefined;

    // Using Response is a hack, but it works and converts a possibly long code
    // into a one-liner :D
    // Source of inspiration: https://stackoverflow.com/a/72718732
    return await new Response(this.body).json();
  }
}
