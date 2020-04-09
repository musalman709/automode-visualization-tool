export function findBTreeRoot(elements) {
    var root = undefined;
    for (var i = 0; i < elements.length; ++i) {
        var current = elements[i];
        // root candidate
        if (current.isNode() && current.getIncomingEdges().length === 0) {
            // two or more roots, error
            if (root !== undefined) {
                throw "Invalid configuration : multiple root nodes detected";
            }
            // else
            root = current;
        }
    }
    // if no root found
    if (root === undefined) {
        throw "Invalid configuration : no root node found";
    }
    return root;
}
