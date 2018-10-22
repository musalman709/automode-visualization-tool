"use strict";

var Graph = {

	Node: function(id) {
		this.id = id;
	},

	Edge: function(id, src, dest) {
		this.id = id;
		this.srcId = src;
		this.destId = dest;
	},

	Graph: function(id) {
		this.id = id;
		this.nodes = [];
		this.edges = [];
		
		this.getNode = function(nodeId) {
			for(var i = 0; i < this.nodes.length; ++i) {
				if(this.nodes[i].id === nodeId) 
					return this.nodes[i];
			}
			return undefined;
		}
		
		this.addNode = function(node) {
			if(this.getNode(node.id) === undefined) {
				this.nodes.push(node);
			}
		}
		
		this.removeNode = function(node) {
			for(var i = 0; i < this.nodes.length; ++i) {
				if(this.nodes[i] === node) 
					this.nodes.splice(i, 0);
			}
		}
		
		this.getEdge = function(edgeId) {
			for(var i = 0; i < this.edges.length; ++i) {
				if(this.edges[i].id === edgeId) 
					return this.edges[i];
			}
			return undefined;
		}
		
		this.getEdgeBetween = function(srcId, destId) {
			for(var i = 0; i < this.edges.length; ++i) {
				if(this.edges[i].srcId === srcId
				&& this.edges[i].destId === destId) 
					return this.edges[i];
			}
			return undefined;
		}
		
		this.addEdge = function(edge) {
			if(this.getEdge(edge.id) === undefined
			&& this.getNode(edge.srcId) !== undefined
			&& this.getNode(edge.destId) !== undefined)
				this.egdes.push(edge);
		}
		
		this.removeEdge = function(edge) {
			for(var i = 0; i < this.edges.length; ++i) {
				if(this.edges[i] === edge) 
					this.edges.splice(i, 0);
			}
		}
	}
};


