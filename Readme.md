# reac-native-todolist

The react-native-todolist application is a cross-platform mobile application developed using the React-Native framework with Redux implementation. The application has features to create a calendar in both Google & Microsoft cloud platforms, users can also receive a push notification from the server based on topic subscription.

# Features!
  - Social SignIn with Google, Microsoft, Facebook.
  - Google & Microsoft Calendar integration that user can create new events.
  - Upload attachements with Google Drive and One Drive. 
  - Share events to social apps.
  - Receive push-notification from server based on topic subscription.

### Installing dependencies
 There are few environment setups required to install the dependencies for the development of a cross-platform application using React-Native.
  
##### React-Native Cli Setup
- Download and Install Node.js
    - Windows & macOS - https://nodejs.org/en/download/
    - Linux - `sudo apt install nodejs npm`
- React-Native Cli can install using npm command
    `npm install -g react-native-cli`

##### Android Installation dependencies
- The Android development setup requires Android Studio and JDK (Java Development Kit).
- ###### Java Development Kit : https://www.oracle.com/java/technologies/javase-jdk8-downloads.html
- ###### Install Android Studio : 

    Download and Install Android Studio with the following link which can be used to install across all operating systems (Windows, Linux & macOS).
https://developer.android.com/studio/index.html
- Configure `ANDROID_HOME` environmental variable
    ###### Windows -
    - Right Click on `My Computer` .
    - Click on `Properties` then in the left panel Choose `Advanced system settings`.
    - In the dialog box Click on `Environment Variables` .
    - After that in the user variable click on `New` and create a new `ANDROID_HOME` variable and the value will the local installation path of Android SDK
    ###### Linux & Mac OS -
    - ###### Open the terminal and type
        `$nano ~/.bash_profile`
        `$ export ANDROID_HOME=/YOUR_PATH_TO/android-sdk`
        `$ export PATH=$ANDROID_HOME/platform-tools:$PATH`
        `$source ~/.bash_profile` 

##### iOS Installation dependencies
- The iOS installation depends on Xcode that can be installed via the mac AppStore.
- The latest version of `Xcode 9.4` or the latest has to be installed in the system
    ##### Xcode Command Line Tools
    There are a few Xcode command-line tools that need to be installed.
    - Open `Xcode` , then choose `Preference` from the Xcode menu.
    - Go to the `Location` panel and install the tools by selecting from the most recent version of the command-line tool from the dropdown.
    ##### Installing iOS simulator in Xcode
    Open `Xcode` -> Preference and then select a simulator that will be compatible with the installed `iOS` version.
    ##### CocoaPods
    This is a dependency manager that will install the required libraries for iOS development. The CocoaPods application is written in Ruby.
    `sudo gem install cocoapods`
    For more information on CocoaPods Guide -
    https://guides.cocoapods.org/using/getting-started.html

#### Running React-Native application
To start the application on both `Android` & `iOS` , there are two different command needs to be followed.
##### Android - `npx react- native run-android`
##### iOS - `npx react- native run-ios`



You can also:
  - Import and save file
  - s from GitHub, Dropbox, Google Drive and One Drive
  - Drag and drop markdown and HTML files into Dillinger
  - Export documents as Markdown, HTML and PDF

Markdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site][df1]

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.

### Tech

Dillinger uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Ace Editor] - awesome web-based text editor
* [markdown-it] - Markdown parser done right. Fast and easy to extend.
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Gulp] - the streaming build system
* [Breakdance](https://breakdance.github.io/breakdance/) - HTML to Markdown converter
* [jQuery] - duh

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd dillinger
$ npm install -d
$ node app
```

For production environments...

```sh
$ npm install --production
$ NODE_ENV=production node app
```

### Plugins

Dillinger is currently extended with the following plugins. Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md][PlDb] |
| GitHub | [plugins/github/README.md][PlGh] |
| Google Drive | [plugins/googledrive/README.md][PlGd] |
| OneDrive | [plugins/onedrive/README.md][PlOd] |
| Medium | [plugins/medium/README.md][PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |


### Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantaneously see your updates!

Open your favorite Terminal and run these commands.

First Tab:
```sh
$ node app
```

Second Tab:
```sh
$ gulp watch
```

(optional) Third:
```sh
$ karma test
```
#### Building for source
For production release:
```sh
$ gulp build --prod
```
Generating pre-built zip archives for distribution:
```sh
$ gulp build dist --prod
```
### Docker
Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image.

```sh
cd dillinger
docker build -t joemccann/dillinger:${package.json.version} .
```
This will create the dillinger image and pull in the necessary dependencies. Be sure to swap out `${package.json.version}` with the actual version of Dillinger.

Once done, run the Docker image and map the port to whatever you wish on your host. In this example, we simply map port 8000 of the host to port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 8000:8080 --restart="always" <youruser>/dillinger:${package.json.version}
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:8000
```

#### Kubernetes + Google Cloud

See [KUBERNETES.md](https://github.com/joemccann/dillinger/blob/master/KUBERNETES.md)


### Todos

 - Write MORE Tests
 - Add Night Mode

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
