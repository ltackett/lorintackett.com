## Front-End Developer Portfolio of Lorin Tackett

### May, 2014

I decided to give Bootstrap a proper go. I've had a couple bad experiences with Bootstrap on client projects Even though I vastly prefer other grid/UI libraries, it is always good to get some perspective.

I haven't been given an opportunity to use [Skrollr](https://github.com/Prinzhorn/skrollr) on a project, and I really want to up my game with scroll-based animation. Navigation through my portfolio relies on skrollr. Each slide is positioned off screen until a certain scroll position, at which point it is scrolled into view. After a thousand pixels or so, it scrolls out of view as another slide scrolls into its place.

Most of my past portfolios have lacked texture, and I admit I'm not a huge fan of it myself. In spite of this, I chose to grab some free textures off of [DeviantArt](http://deviantart.com) and [WebTreats](http://backgrounds.mysitemyway.com/) to add a little more flavor to each slide. For each texture I made high-contrast grayscale versions, and keyed out the black or white, depending on which slide I intended to use it on. This way I can change the colors in the future, or re-use the patterns on other elements.

This iteration of my portfolio was inspired in part by a Bootstrap expo piece: [Portfolio of Nick DiMatteo](http://expo.getbootstrap.com/2014/03/07/nick-dimatteo/). I liked the way each portfolio item had an accompanying background color.

If you want to explore the code and get it running, you will need to familiarize yourself with these libraries and languages:

* `skrollr`
* `jquery`
* `bootstrap`
* `underscore`
* `middleman`
* `haml`
* `sass`
* `coffeescript`

### How to run it locally

This is a static site built with [Middleman](http://middlemanapp.com/), so there are no databases to configure. However, you will need [Ruby](https://www.ruby-lang.org/en/) installed. Preferably, you should be using a ruby version manager such as [RVM](http://rvm.io/) or [rbenv](http://rbenv.org/).

From inside the project folder, run these commands in your terminal

    > gem install bundler
    > bundle install
    > middleman server

---

### Open Source Software

I started poking around with the internet in the 90s. It was a lot easier to learn by example back then. You could view the source code of a web page and most of the time it was pretty easy to read through it to see what does what.

These days it's a lot harder. The landscape of developer options a lot more saturated When viewing the code it's often concatenated, minified, and difficult to read through without comments.

There was a time when I considered my source code to be a closely-guarded secret. This was a mistake. I was a beginner. Nothing I was doing was game-changing... and even if it were, it should always be shared.

This is a repository my current portfolio, and as many of my past portfolios as I could find.

There will be one branch per portfolio, with the naming convention `portfolio-[year]-[month]`.

    Copyright 2006-2014 Lorin Tackett

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

        Unless required by applicable law or agreed to in writing, software
        distributed under the License is distributed on an "AS IS" BASIS,
        WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
        See the License for the specific language governing permissions and
        limitations under the License.
