const url = "http://localhost:3000/api/blog-stats";
const headers = {
  "x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
};

const curlCommand = `curl -X GET "${url}" -H "x-hasura-admin-secret: ${headers['x-hasura-admin-secret']}"`;

console.log(curlCommand);
