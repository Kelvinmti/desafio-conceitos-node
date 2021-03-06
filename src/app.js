const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(newRepo);

  return response.status(201).json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(rep => rep.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  const editedRepo = {...repositories[repoIndex], title, url, techs };

  repositories[repoIndex] = editedRepo;

  return response.status(200).json(editedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(rep => rep.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  repositories = [...repositories.filter(rep => rep.id !== id)];

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(rep => rep.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  const repo = repositories[repoIndex];
  repo.likes += 1;

  repositories[repoIndex] = {...repo};

  return response.status(201).json({ likes: repo.likes });
});

module.exports = app;
