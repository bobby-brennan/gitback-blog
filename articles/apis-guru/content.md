At LucyBot, we've been fans of [Swagger](http://swagger.io/) from day one.
The push to create machine-readable API definitions is nothing new, but the industry
seems to be converging on Swagger as a standard. If the ecosystem of tools
built around Swagger continues to grow, this trend will only accelerate.

Whatever format you choose, having a machine-readable definition for your API is important for a few
reasons:
* It helps keep documentation in line with reality
* It makes automated testing and mocking easy
* It allows you to link into an ecosystem of tools (including LucyBot!)

But the benefit I want to talk about here is one of the most crucial: **Discovery**.

The two services I want to highlight are:

[APIs Guru](https://github.com/APIs-guru/api-models) - An open source repository of
Swagger specifications for public APIs

[AnyAPI](https://any-api.com) - Interactive documentation for those APIs, provided by 
[LucyBot](https://lucybot.com)


## Why is Discovery Important?
API Discovery is important for both Consumers and Providers of APIs.

### API Consumers
Whether you're a large enterprise, a developer at a start-up, or a lone hacker,
chances are you rely on multiple APIs to power your software. But integrating with
a new API is a large commitment - the cost of switching providers or migrating to
a home-grown solution can be huge. To make matters worse, for common needs like
processing credit cards or sending texts, you're faced with a firehose of options.

API discovery services like AnyAPI and [APIs.io](http://apis.io/) are an attempt
to alleviate this problem. They allow API consumers to browse available APIs,
make test calls, and judge whether a given API's
functionality will cover their needs.

### API Providers
Simply put, discovery is important because if you don't have any users, it
doesn't matter how well designed and tested and loadbalanced your API is.
You built your API because people have a problem you can solve. Now your
job is to get it in front of them.

Publishing a Swagger specification provides an easy way for you to
announce your API to the world - not only
what it does and where it's hosted, but exactly how it works.


## Enter APIs Guru
The goal of APIs Guru is to become the Wikipedia of APIs. They've been
using a combination of automated scraping and human curation to crawl
the web for machine-readable API definitions. They've already added
over 100 APIs, including
[Instagram](https://any-api.com/consoles/instagram.com/1.0.0) and
[YouTube](https://any-api.com/consoles/googleapis.com/youtube/v3),
with hundreds more in line.
As more and more services jump onto the Swagger bandwagon, this number will only grow.

Of course, not every API uses Swagger. That's why we've been working together
on an open source project, aptly named [api-spec-converter](https://github.com/lucybot/api-spec-converter).
Most machine-readable API descriptions are interchangeable - they simply
describe a set of URLs, inputs, and outputs. APIs Guru uses api-spec-converter
to convert description formats such as API Blueprint and I/O Docs to Swagger 2.0.

These documents are repeatedly crawled for changes, and any updates are pushed to
the [api-models](https://github.com/APIs-guru/api-models) repository on GitHub. This
means the descriptions provided by APIs Guru always stay up-to-date.

As we've said, APIs Guru wants to be like Wikipedia - anyone can contribute
improvements. Perhaps a parameter was missing a description, or you found a typo
in the README. All you have to do is send a pull request to the api-models
repository!

But if the API is constantly evolving, how can people contribute
without their changes being overwritten? Fortunately APIs Guru
applies any contributions as a patch. This means they can pull
in changes to the API without discarding edits.

### More than just Discovery
APIs Guru is not just great for finding APIs - it can be used by anyone who
wants to integrate with a number of popular APIs. Possible use cases include:
* Reliability testing
* Usage reports
* SDK Generation

## The Future of API Discovery
More and more API providers are utilizing machine-readable definitions like
Swagger. My prediction (and hope) is that within a few years nearly every
major API will publish an official definition. With the help of services
like APIs Guru and clients like AnyAPI, the decision to integrate a new API
will become much easier to navigate.

---

*Need help documenting your API? LucyBot offers both hosted and on-premise
solutions for creating documentation, test consoles,
and cookbooks for working with both private and public APIs.
Contact [info@lucybot.com](mailto:info@lucybot.com) to learn more.*
