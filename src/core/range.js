export default class Range {
    constructor(doc) {
        this.document = doc;
        this.collapsed = true;
        this.startContainer = null;
        this.startOffset = null;
        this.endContainer = null;
        this.endOffset = null;
    }
}