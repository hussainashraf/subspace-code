const express = require("express");
const app = express();
const axios = require("axios");
const port = 3000;
const _ = require("lodash");
app.use(express.json());

const cachedTime = 1 * 60 * 1000;
const cachedSearch = _.memoize(searchquery, (query) => query, {
  maxAge: cachedTime,
});
const cachedSearchBlog = _.memoize(searchblog, () => "cachedSearchBlog", {
  maxAge: cachedTime,
});
app.get("/api/blog-stats", async (req, res) => {
  try {
    // res.json(response.json);
    // console.log(response);

    const { totalBlogs, longesttitle, blogwithprivacy, uniqarry } =
      await cachedSearchBlog();
    //total blogs count
    res.json({ totalBlogs, longesttitle, blogwithprivacy, uniqarry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/blog-stats/search", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    //search functionality
    const filterquery = await cachedSearch(query);
    res.json({ filterquery });
    // console.log(filterquery)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function searchblog() {
  console.log("searchblog called");
  const url = "https://intent-kit-16.hasura.app/api/rest/blogs";
  const headers = {
    "x-hasura-admin-secret":
      "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
  };
  const response = await axios.get(url, { headers });
  const totalBlogs = _.get(response, "data.blogs.length");
  let longesttitle = "";
  let longesttitleblog = null;

  _.forEach(response.data.blogs, (blog) => {
    if (blog.title.length > longesttitle.length) {
      longesttitle = blog.title;
      longesttitleblog = blog;
    }
  });

  const blogwithprivacy = _.filter(response.data.blogs, (blogs) =>
    _.includes(blogs.title.toLowerCase(), "privacy")
  ).length;
  //unique array with no duplicates using id
  const uniqarry = _.uniq(response.data.blogs, "id").map((blog) => blog.id);
  //   console.log(totalBlogs, longesttitleblog, blogwithprivacy, uniqarry);
  return {
    totalBlogs,
    longesttitle,
    blogwithprivacy,
    uniqarry,
  };
}

async function searchquery(query) {
  console.log("searchquery called");
  const url = "https://intent-kit-16.hasura.app/api/rest/blogs";
  const headers = {
    "x-hasura-admin-secret":
      "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
  };
  const response = await axios.get(url, { headers });
  return (filterquery = _.filter(response.data.blogs, (blog) =>
    _.includes(blog.title.toLowerCase(), query.toLowerCase())
  ));
}
