# Using Bower

Bower is a package manager for the web. It is most commonly used to download browser dependencies such as jQuery or AngularJS. Bower makes it very easy to upgrade your third party dependencies since it specifies the version of the dependency in the bower.json. It is also very easy to download a new dependency and save it to your application's bower.json configuration.

# How do I find a package on Bower?

You can search for it on their site: http://bower.io/search/ 

Most well known JavaScript modules will also reference their bower package name on their installation web page.

# How do I install all the existing dependencies manually?

    cd <root>\bower
    bower install

If you get an error saying the bower command does not exist, you need to install it globally.

    npm install -g bower

# How do I install a new dependency and save it to the bower/bower.json automatically?

Saying the dependency name is 'angular-resource'

    bower install angular-resource --save