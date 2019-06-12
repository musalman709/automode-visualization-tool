# User manual for the visualization tool

To generate the graphs and the strings, proceed to open the src/grapheditor.html file in a browser.

## Switching mode

It is possible to switch mode from fsm to bTree, and vice versa, by clicking the link under the title in the top right of the screen.

## Draw a graph

The method for drawing a graph is as follow:

### adding nodes/states
1 click on "add a node".
2 click on the graph panel to add the node.
3 select the model of the node (fsm have only one: State; bTree have multiple).
4 select the behaviour desired.

### adding edges/transitions
1 click on "add an edge".
2 click on the starting node.
3 click on the destination node.
for fsm, you need to define the type of transistion, therefore the extra steps are required:
4 click on "select".
5 click on the edge.
6 select the model of the edge (there is only Transition).
7 select the transition desired.

### changing the values of already drawn nodes
1 click on "select".
2 click on the node.
3 select the desired modifications.

### erasing drawn elements
1 click on "delete".
2 click on the element to delete (action cannot be undone)

### move already drawn elements
This only works for nodes.
1 click on move.
2 click on the node to move.

## Export the graph into a string
This is done automatically.

### copy string
The user can copy the string to the clipboard using the "copy" button.

### save string to a fine
The user can save to a file using the "save" button. This will open a window to indicate where to save the txt file. 

## Import the string into a graph
This is done automatically if there is a manually changed character in the string. If there is an eror with the string, there will be an alert window.

### open a txt file with a string in it
The user can select the "open" button to open a text file with a string in it.

### errors in the string
Errors in the string will open an alert window explaining what the error is.

## execute a simulation from string, in automode

### setup
1 Fill the config file located in the "automode-visualization-tool" folder.
2 Run the "run.py" file, this will create a server to execute commands in the terminal.

### launching a simulation
After creating a graph, press the "exec" button to execute the simulation with the setting as written in the config file.
