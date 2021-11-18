class Slash {
    constructor(client, options) {
        this.client = client
        this.name = options.name
        this.description = options.description
        this.options = options.options
        this.requireDatabase = options.requireDatabase
    }
}

module.exports = Slash;