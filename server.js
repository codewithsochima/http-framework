const framework = require("./framework");

const app = framework();

const items = [];

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

app.delete("/items", (req, res) => {
  res.end("Item deleted");
});

app.listen(3000);
