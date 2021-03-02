export default class KingTree {
    constructor(value) {
        this.Value = value;
        this.DownLeft = null;
        this.DownRight = null;
        this.UpLeft = null;
        this.UpRight = null;
    }

    static kingTreeToArray(mainTree) {
        function iter(tree, tempArray) {
            if (tree.DownLeft != null && tree.DownRight != null && tree.UpLeft != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.DownRight != null && tree.UpLeft != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.DownRight != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.UpLeft != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownRight != null && tree.UpLeft != null && tree.UpRight != null) {
                return iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.DownRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.DownRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.UpLeft != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownRight != null && tree.UpLeft != null) {
                return iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.UpLeft != null && tree.UpRight != null) {
                return iter(tree.UpLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value))
            }
            else if (tree.DownRight != null) {
                return iter(tree.DownRight, tempArray.concat(tree.Value))
            }
            else if (tree.UpLeft != null) {
                return iter(tree.UpLeft, tempArray.concat(tree.Value))
            }
            else if (tree.UpRight != null) {
                return iter(tree.UpRight, tempArray.concat(tree.Value))
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