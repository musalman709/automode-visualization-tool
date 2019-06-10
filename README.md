# AutoMoDe Visualization Tool

This software is a web editor that allows to visualize and edit 
AutoMoDe behaviors trees. It also provides a local server that
allows to launch a simulation through the editor using the ARGoS 
simulator.

### Installation

The web editor requires a web browser that supports HTML5, SVG images 
and JavaScript. The editor has been tested on Firefox ESR 60 and 
Chromium 73.

The server requires Python3 and the Flask library. On Debian-based 
systems, they can be installed using
```
$ sudo apt install python3-flask
```
or using `pip` tool
```
$ sudo pip3 install Flask
```
The server also needs an installation of the ARGoS3 simulator with
the needed plugins.

### Starting the server

The server can be launched using :
```
$ python3 run.py <config>
```
where `<config>` is the path of a `.ini` file that contains the
required parameters to launch the simulation, especially the path to 
the ARGoS executable and the path to the scenario file. 
The file `config.ini` serves as a template.

Once the server is started, the editor should open by itself. If not,
open the address `localhost:5000` in your web browser.

### Opening the editor without server

Just open the file `src/grapheditor.html` in your web browser.
