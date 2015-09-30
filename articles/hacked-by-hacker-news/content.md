About a week ago, I created this blog. As my first post, I decided
to write about [how I put the blog together](/blog/making-of).  Proud of
my work, I put it up on Hacker News and went to bed. The next morning,
I woke up to this:

---

<style>
  .gif-container {
    height: 400px;
    overflow: hidden;
  }
</style>

<div class="text-center gif-container">
  <img src="http://i.imgur.com/kzza281.gif">
</div>

---

Apparently it was possible to insert <script> tags in the comments. Whoops.

## The Attack
When I was putting together the commenting system, I decided to let commenters
add markdown. I plan on talking a lot about code, so I wanted people to be able
to embed code snippets, links, etc.

Now, my impression was that markdown processors would remove HTML *by default*.
This assumption, it turns out, was wrong. Once word got out, people started having
all sorts of fun. Here's my favorite:

```js
<script>
$('body').append(
  '<iframe width="420" height="315"' +
  ' src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"' +
  ' frameborder="0" allowfullscreen style="display:none"></iframe>'
)
</script>
```

I bet you can guess what video the attacker managed to inject on the page. That's
right - everyone who visited this post got rickrolled.

And here's the script that's captured in the GIF above:

```js
<script>
  $('h1 span').fadeOut(800, function(){
    $(this).text('Unsanitized user inputs?').fadeIn(800);
  });
  $('.heading p').first().fadeOut(1500,function(){
    $(this).text("You're gonna have a bad time").fadeIn(1500);
  });
</script>
```

Well played, sir.

## The Bug
It turns out that most markdown parsers will happily allow HTML through, including
<script> and <style> tags. In fact, there's a big warning at the top of the
[angular-marked README](https://github.com/Hypercubed/angular-marked):

> Please note: neither this directive nor marked (by default) implement sanitization.
> As always, sanitizing is necessary for user-generated content.

That's what I get for not reading the instructions carefully.

Though to be fair, the [marked README](https://github.com/chjj/marked) incorrectly
lists the default for the 'sanitize' option as true.
[Obligatory pull request](https://github.com/chjj/marked/pull/666)

### So how bad was it?
Bad, but not horrible. Since my blog doesn't use any kind of login or personal info,
there wasn't any chance of data getting stolen. 

Attackers would have been able to
* Create alert() dialogues
* Inject iframes
* Alter the page's HTML
* Alter the apparent content of the post
* Redirect users to other sites

Attackers were NOT able to
* Access sensitive data on the server
* Alter the *actual* content of the post (as it's stored in the backend)

## The Fix
Fortunately, cleaning up the mess was pretty easy.

First thing was first: get rid of the malicious comments. As I described in the
original post, I'm using GitBack to
[store the comments in GitHub](https://github.com/bobby-brennan/gitback-blog/tree/master/comments),
so all I had to do was log in to github.com, type "script" in the search bar,
and delete the offending comments from the repository. GitBack pulled in those
changes and people could go back to reading my post without Rick Astley blaring in the background.

It's worth noting that had I used a more traditional backend (such as MongoDB),
this would have probably been much more difficult. I have no desire to try querying a database
before having my morning coffee.

Now to fix the actual bug. All I had to do 
was tell my markdown parser to actually sanitize its input:

```js
  markedProvider.setOptions({
    sanitize: true,
  });
```

and voilà, no more script injection.

With the help of git, I even managed to undelete all the now-harmless comments.
You can see them all [on the original post](/blog/making-of)

## The Lesson
