# giffle

**giffle** (_gif_ shuf*fle*) is a simple API for returning a random image from a provided list of URLs.
Useful for embedding random images in contexts that don't support scripting, such as markdown files like this one!
Requests are proxied to the image host and returned with `no-cache` headers to ensure a random selection on a refresh.

## usage

The `options`

```javascript
const params = new URLSearchParams()
params.set("options", [
    "https://i.giphy.com/media/bpYXSdwzUhAkbrtUDd/giphy.webp",
    "https://i.giphy.com/media/c7seQb6ViPLoS0T6oK/giphy.webp",
    "https://i.giphy.com/media/TO8WGuVadRniy794oY/giphy.webp",
])

console.log(params.toString())
// options=https%3A%2F%2Fi.giphy.com%2Fmedia%2FbpYXSdwzUhAkbrtUDd%2Fgiphy.webp%2Chttps%3A%2F%2Fi.giphy.com%2Fmedia%2Fc7seQb6ViPLoS0T6oK%2Fgiphy.webp%2Chttps%3A%2F%2Fi.giphy.com%2Fmedia%2FTO8WGuVadRniy794oY%2Fgiphy.webp
```

## example

```markdown
<img src="https://giffle.ty.pizza?options=https%3A%2F%2Fi.giphy.com%2Fmedia%2Fc7seQb6ViPLoS0T6oK%2Fgiphy.webp%2Chttps%3A%2F%2Fi.giphy.com%2Fmedia%2FbpYXSdwzUhAkbrtUDd%2Fgiphy.webp%2Chttps%3A%2F%2Fi.giphy.com%2Fmedia%2FTO8WGuVadRniy794oY%2Fgiphy.webp">
```

<img src="https://giffle.ty.pizza?options=https%3A%2F%2Fi.giphy.com%2Fmedia%2Fc7seQb6ViPLoS0T6oK%2Fgiphy.webp%2Chttps%3A%2F%2Fi.giphy.com%2Fmedia%2FbpYXSdwzUhAkbrtUDd%2Fgiphy.webp%2Chttps%3A%2F%2Fi.giphy.com%2Fmedia%2FTO8WGuVadRniy794oY%2Fgiphy.webp">
