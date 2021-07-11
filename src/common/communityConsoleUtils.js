// Escapes username from HTML generated by the Community Console.
export function escapeUsername(username) {
  var quoteRegex = /"/g;
  var commentRegex = /<!---->/g;
  return username.replace(quoteRegex, '\\"').replace(commentRegex, '');
}

// Retrieves authuser from the data-startup attribute.
export function getAuthUser() {
  var startup =
      JSON.parse(document.querySelector('html').getAttribute('data-startup'));
  return startup?.[2]?.[1] || '0';
}
