const framework = require("./framework");

const app = framework();

const items = [];

function validateItem(item) {
  if (!item.name || !item.price || !item.size) {
    return false;
  }

  if (typeof item.name !== "string") {
    return false;
  }

  if (typeof item.price !== "number" || item.price <= 0) {
    return false;
  }

  if (!["s", "m", "l"].includes(item.size)) {
    return false;
  }

  return true;
}

app.use(framework.json());

app.get("/items", (req, res) => {
  res.end(JSON.stringify(items));
});

app.get("/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const item = items.find((item) => item.id === id);

  if (!item) {
    res.statusCode = 404;
    return res.end("Item not found");
  }

  res.end(JSON.stringify(item));
});

app.post("/items", (req, res) => {
  const item = req.body;

  if (!validateItem(item)) {
    res.statusCode = 400;
    return res.end("Invalid item");
  }

  item.id = items.length + 1;

  items.push(item);

  res.end("Item created");
});
app.put("/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const item = items.find((item) => item.id === id);

  if (!item) {
    res.statusCode = 404;
    return res.end("Item not found");
  }

  item.name = req.body.name;
  item.price = req.body.price;
  item.size = req.body.size;

  res.end("Item updated");
});

app.delete("/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    res.statusCode = 404;
    return res.end("Item not found");
  }

  items.splice(itemIndex, 1);
  res.end("Item deleted");
});

app.error((error, req, res) => {
  res.statusCode = 500;
  res.end("Internal Server Error");
});

app.listen(3000);
