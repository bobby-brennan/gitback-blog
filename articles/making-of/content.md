## Motivation
I'm determined to get back into writing. I figure a blog is an easy way to start.

### Why not just use Blogger or medium.com?
There are plenty of platforms out there I could have used, none of which I looked at.
There are a few reasons I wanted to build my own:
* I wanted to use my own domain
* I'll be writing a lot about web tools, and want to be able to embed demos
* It sounded like fun

<br>
## The Requirements
I wanted each blog post to be a Markdown file. I also wanted a cover page with the latest posts,
So I'd need to be able to include some metadata like title, description, and date created.

As a bonus challenge, I wanted to include a commenting system. This means we'll need a datastore.

How hard could it be?

<br>
## The Stack
I've been using NodeJS with Express for the last year, and for a simple webservice I can't imagine
anything better.  I'm also using AngularJS to control the comments section. It beats
jQuery by a mile, but after a year of daily use I still feel like I'm fighting it...would
love any suggestions on a new MV* framework.

You might think this sounds like a boring, predictable MEAN stack, but shyamalan twist, no Mongo.
Instead, I'm using an experimental backend that I've been putting together - GitBack.
So...GEAN? GBEAN? I like GBEAN.

I'll be writing a detailed post on GitBack later, but the idea is to use git as a datastore.
Crazy right? Totally doesn't scale.
But for small amounts of data, with few writes, it's insanely convenient.  You get, for free:
* A history of every revision to the datastore
* Versioning (via branches)
* The ability to roll back any single change, or revert to any point in time
* The ability to store aribitrary data **without dealing with encoding/decoding**. Images are just images, .zips are just .zips
* A beautiful GUI for viewing and editing the datastore, thanks to GitHub

We'll see the basics of using GitBack below.

<br>
## The Code
Let's start by creating the datastore with GitBack. This is where articles and comments will live.
I created a [public repository](https://github.com/bobby-brennan/gitback-blog) on GitHub
to hold the data...let's add it as a submodule.
We'll initialize a new Git repository in a folder called database/
```bash
git add submodule https://github.com/bobby-brennan/gitback-blog
```

We just need to add two collections: comments and articles.

**./database/comments.js**
```js
{
  access: {
    get: 'all',
    post: 'all'
  }
}
```
The ```access``` field essentially says that anyone can get (view) and post (add) comments.

Articles, on the other hand, will be read only:

**./database/articles.js**
```js
{
  access: {
    get: 'all'
  },
  attachments: {
    content: {
      extension: 'md'
    }
  },
}
```

We've also specified a Markdown attachment -
this way we can keep the Markdown in a separate file rather than inside a JSON document.

We can get fancier by enforcing a particular schema, adding more granular access control,
or creating middleware to modify the input and output data, but for now we'll accept arbitrary JSON.

<br>
Now let's write our first post!
GitBack stores each item as ./{collection}/{id}/_item.json

**./database/articles/hello-world/_item.json**
```js
{
  title: "Hello World",
  description: "My first post",
  date: "9-22-2015"
}
```

We'll write the actual article in content.md:

**./database/articles/hello-world/content.md**
```markdown
This is **my first post**!
```


<br>
Now we need a Node router to turn our articles into webpages.

**./routes/blog.js**
```js
var Router = module.exports = require('express').Router();
var GitBack = require('gitback');
var DB = new GitBack({
  directory: __dirname + '/../database',
  remote: 'git@github.com:bobby-brennan/gitback-blog.git',
});
DB.initialize(function(err) {
  if (err) throw err;
  Router.use('/api', DB.router);
});

Router.get('/', function(req, res) {
  res.render('blog', {articles: DB.collections.articles.get()});
});

Router.get('/:post', function(req, res) {
  var article = DB.collections.articles.get(req.params.post);
  if (!article) return res.status(404).end();
  res.render('blog-post', {article: article});
}) 
```

There's a lot going on there, but we're essentially telling gitback to use
[https://github.com/bobby-brennan/gitback-blog](https://github.com/bobby-brennan/gitback-blog)
as it's source of truth, and to keep it's local copy of the data in the ./database directory.

Note that the local machine will need permission to write to your Git repository. I'm using
a [deploy key](https://developer.github.com/guides/managing-deploy-keys/).

Once the database is initialized, we expose a RESTful API for interacting with it by calling
```js
Router.use('/api', DB.router);
```

You can see it in action by visiting
[http://bbrennan.info/blog/api/articles](/blog/api/articles)
or
[http://bbrennan.info/blog/api/articles/hello_world](/blog/api/articles/hello_world)

Then we set up two routes: one for getting the main page, and one for getting
a particular post. In each we call ```DB.collections.articles.get()``` to
retrieve the necessary articles.

<br>
I like to use Jade for rendering HTML on the server side, and Angular for
rendering on the client side.  Here's a possible anti-pattern
I can't seem to ditch - whenever I have data readily available on the server
that I want to pass to Angular, I render it as a JS variable inside a controller.
There has to be a better way.

**./views/blog-post.jade**
```jade
script.
  App.controller('Article', function($scope) {
    $scope.article = !{JSON.stringify(article)};
  })

.container(ng-controller="Article")
  .row
    .col-xs-12.col-lg-10.col-lg-offset-1
      h1
        span= article.title
      p.small= article.dateString
      hr
      div(marked="article")
```

Here I'm using [angular-marked](https://github.com/Hypercubed/angular-marked) to render
the Markdown.

<br>
### Adding Comments
When we initialized GitBack above, it exposed RESTful API endpoints for creating and
deleting comments. All we need to do is create an Angular controller for calling them.


**./static/js/ng/blog-post.js**
```js
App.controller('Comments', function($scope) {
  $scope.refresh = function() {
    $.getJSON('/blog/api/comments?article=' + $scope.article.id, function(comments) {
      $scope.comments = comments;
      $scope.$apply();
    });
  };
  $scope.refresh();

  $scope.addComment = function() {
    $.ajax('/blog/api/comments', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      data: JSON.stringify({
        id: new String((new Date()).getTime()),
        article: $scope.article.url,
        text: $scope.comment || '',
        by: $scope.by || 'anonymous',
      }),
      success: $scope.refresh,
    })
  }
});
```

Easy right? GitBack will store all comments in [the GitHub repo](https://github.com/bobby-brennan/gitback-blog.git).
Leave a note below and you'll see it appear there!

<br>
Now we just need to implement the comment UI:

**./views/blog-post.jade**
```jade
div(ng-controller="Comments")
  .row
    .col-xs-12
      .form-group
        textarea.form-control(ng-model="comment")
      .form-group
        input.form-control(type="text" ng-model="by")
      a.btn.btn-success(ng-click="addComment()") Submit
      hr
  .row(ng-repeat="comment in comments")
    .col-xs-12
      h6 {{ comment.by || 'anonymous' }}
      div(marked="comment.text || '*No text provided*'")
      hr
```

That's it! Maybe 100 lines of non-boilerplate code. It took longer to write this post.

<br>
It's amazing how far the web has come in the last ten years. The proliferation of free
and open source solutions to common problems has simplified and accelerated the development
process by orders of magnitude. 

<br>
## The Results
See for yourself! Leave a comment below and test it out.

You can also see the code [on GitHub](https://github.com/bobby-brennan/bbrennan-info)
