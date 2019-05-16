#!/usr/bin/python3

import sys, configparser, webbrowser, subprocess
from flask import Flask, request, send_from_directory

CONFIG_INI_FILE = ""
app = Flask(__name__)

@app.route("/")
def editor_file():
    return root_file("grapheditor.html")

@app.route("/<path>")
def root_file(path):
    return send_from_directory('src/', path)

@app.route("/btree/<path>")
def btree_file(path):
    return send_from_directory('src/btree', path)

@app.route("/fsm/<path>")
def fsm_file(path):
    return send_from_directory('src/fsm', path);

@app.route("/exec", methods=['POST'])
def exec_request():
    cmdline = request.form['cmdline']

    if cmdline.startswith("--bt-config") or cmdline.startswith("--fsm-config"):
        config = configparser.ConfigParser()
        config.read(CONFIG_INI_FILE)

        cmdline = cmdline.split(" ")
        arguments = [config['ARGOS']['automode_path'], "-n", "-c", \
                     config['ARGOS']['scenario_path']]

        if config.has_option('ARGOS', 'seed'):
            arguments += ["--seed", config['ARGOS']['seed']]

        arguments += cmdline

        print("[EXECUTION REQUEST]", " ".join(arguments))
        subprocess.run(arguments)
    else:
        print("[EXECUTION REQUEST] Refused")

    return ""

if __name__ == "__main__":

    if len(sys.argv) > 1 :
        CONFIG_INI_FILE = sys.argv[1]
    else:
        print("Usage : ./run.py <configfile>", file=sys.stderr)
        exit()

    webbrowser.open('localhost:5000', autoraise=True)
    app.run()
    print()
    
