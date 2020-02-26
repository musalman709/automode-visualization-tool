export default class FSMBeautifier {
    constructor(graph) {
        this.graph = graph;
        this.nit = 100;
        const edges = graph.getEdges();
        this.edgesCount = edges.length;
        this.speedx = new Array(this.edgesCount).fill(0);
        this.speedy = new Array(this.edgesCount).fill(0);
        this.positionx = edges.map(e => e.getPosition().x);
        this.positiony = edges.map(e => e.getPosition().y);
        this.node1x = new Array(this.edgesCount);
        this.node1y = new Array(this.edgesCount);
        this.node2x = new Array(this.edgesCount);
        this.node2y = new Array(this.edgesCount);
        for (let i = 0; i < this.edgesCount; i++) {
            const srcNode = edges[i].getSrcNode();
            const destNode = edges[i].getDestNode();
            this.node1x[i] = srcNode.getPosition().x;
            this.node1y[i] = srcNode.getPosition().y;
            this.node2x[i] = destNode.getPosition().x;
            this.node2y[i] = destNode.getPosition().y;
        }
    }
    beautify() {
        for (let i = 0; i < this.nit; i++) {
            this.updateSpeeds();
            this.updatePositions();
        }
        const edges = this.graph.getEdges();
        for (let i = 0; i < this.edgesCount; i++) {
            edges[i].move({x: this.positionx[i], y: this.positiony[i]});
        }
    }
    updateSpeeds() {
        this.speedx.fill(0);
        this.speedy.fill(0);
        for (let i = 0; i < this.edgesCount; i++) {
            this.speedx[i] += 0.01*(this.node1x[i] + this.node2x[i] - 2*this.positionx[i]);
            this.speedy[i] += 0.01*(this.node1y[i] + this.node2y[i] - 2*this.positiony[i]);
            for (let j = 0; j < this.edgesCount; j++) {
                if (i === j) continue;
                const vx = this.positionx[i] - this.positionx[j];
                const vy = this.positiony[i] - this.positiony[j];
                const radius = Math.sqrt(vx**2 + vy**2);
                const expr2 = radius < 100 ? 0.25*(100-radius) / radius : 0; /*150 / (vx**2 + vy**2)*///30*Math.exp(-(vx**2 + vy**2) / 10000) / Math.sqrt(vx**2 + vy**2);
                this.speedx[i] += vx * expr2;
                this.speedy[i] += vy * expr2;
                this.updateLineSpeeds(i, j, this.node1x[j], this.node1y[j]);
                this.updateLineSpeeds(i, j, this.node2x[j], this.node2y[j]);
            }
            const nodes = this.graph.getNodes();
            for (let j = 0; j < nodes.length; j++) {
                const vx = this.positionx[i] - nodes[j].getPosition().x;
                const vy = this.positiony[i] - nodes[j].getPosition().y;
                const radius = Math.sqrt(vx**2 + vy**2);
                const expr2 = radius < 100 ? 0.25*(100-radius) / radius : 0;
                this.speedx[i] += vx * expr2;
                this.speedy[i] += vy * expr2;
            }
        }
    }
    updateLineSpeeds(i, j, px, py) {
        const v1x = this.positionx[i] - px;
        const v1y = this.positiony[i] - py;
        const v2x = this.positionx[j] - px;
        const v2y = this.positiony[j] - py;
        const k = (v1x*v2x + v1y*v2y) / (v2x**2 + v2y**2);
        if (k > 0 && k < 1) {
            const rx = v1x - k*v2x;
            const ry = v1y - k*v2y;
            const r = Math.sqrt(rx**2 + ry**2);
            const expr2 = r < 75 ? 0.1*(75-r) / r : 0;
            this.speedx[i] += rx * expr2;
            this.speedy[i] += ry * expr2;
            this.speedx[j] -= k * rx * expr2;
            this.speedy[j] -= k * ry * expr2;
        }
    }
    updatePositions() {
        for (let i = 0; i < this.edgesCount; i++) {
            this.positionx[i] += this.speedx[i];
            this.positiony[i] += this.speedy[i];
        }
    }
}