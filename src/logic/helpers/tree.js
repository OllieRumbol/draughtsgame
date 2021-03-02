export default class Tree {
    constructor(value) {
        this.Value = value;
        this.Left = null;
        this.Right = null;
    }

    static treeToArray(mainTree) {
        function iter(tree, tempArray) {
            if (tree.Left != null && tree.Right != null) {
                return iter(tree.Left, tempArray.concat(tree.Value)) + iter(tree.Right, tempArray.concat(tree.Value));
            }
            else if (tree.Left != null) {
                return iter(tree.Left, tempArray.concat(tree.Value))
            }
            else if (tree.Right != null) {
                return iter(tree.Right, tempArray.concat(tree.Value))
            }
            else {
                result.push(tempArray.concat(tree.Value));
            }
        }

        let result = [];
        iter(mainTree, []);
        return result;
    }
}