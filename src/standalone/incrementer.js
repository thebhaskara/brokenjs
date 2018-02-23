var Incrementer = module.exports = function() {
    this.value = 0;
}

Incrementer.prototype.next = function() {
    this.value++;
    return this.value;
};

Incrementer.prototype.reset = function() {
    this.value = 0;
    return this;
};