const http = require("http");
const routes = [];
const middlewares = [];

function framework() {
  const server = http.createServer((req, res) => {
    const route = routes.find((route) => {
      if (route.method !== req.method) {
        return false;
      }
      const routeParts = route.path.split("/");
      const urlParts = req.url.split("/");

      if (routeParts.length !== urlParts.length) {
        return false;
      }

      return routeParts.every((part, index) => {
        return part.startsWith(":") || part === urlParts[index];
      });
    });

    console.log(route);

    if (!route) {
      res.statusCode = 404;
      return res.end("Route not found");
    }

    req.params = {};

    const routeParts = route.path.split("/");
    const urlParts = req.url.split("/");

    routeParts.forEach((part, index) => {
      if (part.startsWith(":")) {
        const paramName = part.slice(1);
        req.params[paramName] = urlParts[index];
      }
    });

    const middleware = middlewares[0];

    middleware(req, res, () => {
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

    use: function (middleware) {
      middlewares.push(middleware);
    },

    listen: function (port) {
      server.listen(port);
    },
  };
}

framework.json = function () {
  return function (req, res, next) {
    let body = "";

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
      next();
    });
  };
};

module.exports = framework;
