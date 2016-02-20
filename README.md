# Big-Gulp

A command line tool that builds your gulpfile to your exact needs by asking you a series of questions. You can build a full static site generator with dev server, or a simple build tool for pre-processing assets and preparing them for deployment. 

``
$ npm install big-gulp -g
``

now change directories to your project and run the setup

``
$ big-gulp
``

big-gulp will now ask you a series of questions about your project and build your ``gulpfile.js`` accordingly


- Where will you keep your source files? *source*
- Where would you like your build (generated) files? *build*
- What data would you like to use? *JSON*
- Where would you like to keep your data? *source/data*
- Which CSS preprocessor would you like to use? *Less*
- Which Js preprocessor would you like to use? *Coffeescript*
- Would you like to browserify your javascript files?
- Which template would you like to use? *Jade*

Your ``gulpfile.js`` will be generated with you preferences, all setup to run a static site builder / build tool.

The packages needed to run your gulpfile have been added to your npm ``package.json`` file as dev dependencies. You now need to 

``
npm install
``

You can then invoke the tasks with ``$ gulp`` or run individual gulp task such as ``$ gulp clean``

And, of course you can edit your ``gulpfile.js`` further for more customization, it is your gulpfile after all, big-gulp just helps you build it.





