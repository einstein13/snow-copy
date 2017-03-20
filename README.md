# ServiceNow copy plugin for web browser

## How to install it?

1. Download
2. Install plugin in your web browser
3. Reload SNow pages
4. Use it!

## Downloading

Easiest version is to use direct link: https://github.com/einstein13/snow-copy/archive/master.zip and unzip into the hard disk

You can also clone git repository: https://github.com/einstein13/snow-copy.git

## Installing with your web browser

Currently only Chrome web browser is supported. In the future 

### Chrome

* Go to the extension page: chrome://extensions/
* Click on the button "Load Unpacked Extension" ("Wczytaj roszerzenie bez pakietu")
* Search for folder with manifest.json file from downloaded file and read it
* New plugin should appear

## How to use it

* Go to any page where ServiceNow script should exist
* Click on ServiceNow icon on the right (![ServiceNow](/icons/SNOW_icon.png))
* Click "COPY" and read message below

There are several possible messages:

##### Found 0 scripts!
The plugin found none ServiceNow javascript scripts. If there is any, please contact me.

##### Found more than 1 script!
The plugin found more than one field with possible javascript code. List of found possibilities is described as table. Clicking on any record will copy it to the clipboard.

##### Successfully copied
The javascript code is in the clipboard.

## Q&A

##### When the plugin is enabled?

The plugin is working only when URL of the page is ServiceNow instance: *://*.service-now.com/*

##### How the plugin works?

It is searching for textareas within the DOM of the page and all DOMs inside iframes. The textareas should contain name like "*.*" and it can't be empty.