/**
 * Default models
 */

export function defaultNodeModel() {

  return {
    "name": "-- default --",
		"id": "-1",
		"max_incoming_edges": "-1",
		"max_outgoing_edges": "-1",
		"display_tag": "rect",
		"display_opts": {
			"class": "nodeFrame",
			"width": "50",
			"height": "50",
			"rx": "10",
			"ry": "10",
			"x": "-25",
			"y": "-25"
		},
		"display_text": "[node]",
		"display_text_opts": {
			"text-anchor": "middle",
			"dominant-baseline": "middle",
			"x": "0",
			"y": "0"
		},
		"incoming_point": {
			"x": "0",
			"y": "-25"
		},
		"outgoing_point": {
			"x": "0",
			"y": "25"
		}
  };
}

export function defaultNodeParam() {

  return {
    "nodeid": "-1",
    "categoryid": "d",
    "categories": []
  };
}

export function defaultEdgeModel() {

  return {
    "name": "-- default --",
    "id": "-1"
    };
}

export function defaultEdgeParam() {
  return {
    "edgeid": "-1",
    "categoryid": "d",
    "categories": []
  }
}

