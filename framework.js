const http = require("http");
const routes = [];

function framework() {
  const server = http.createServer((req, res) => {
    let body = "";

    const route = routes.find((route) => {
      return route.method === req.method && route.path === req.url;
    });

    console.log(route);

    if (!route) {
      res.statusCode = 404;
      return res.end("Route not found");
    }

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (body) {
        try {
          req.body = JSON.parse(body);
        } catch (error) {
          res.statusCode = 400;
          return res.end("Invalid JSON");
        }
      }

      route.handler(req, res);
    });
  });

  return {
    get: function (path, handler) {
      routes.push({
        method: "GET",
        path: path,
        handler: handler,
      });
    },

    post: function (path, handler) {
      routes.push({
        method: "POST",
        path: path,
        handler: handler,
      });
    },

    put: function (path, handler) {
      routes.push({
        method: "PUT",
        path: path,
        handler: handler,
      });
    },

    delete: function (path, handler) {
      routes.push({
        method: "DELETE",
        path: path,
        handler: handler,
      });
    },

    listen: function (port) {
      server.listen(port);
    },
  };
}

framework.json = function () {
  console.log("JSON middleware created");
};

module.exports = framework;
