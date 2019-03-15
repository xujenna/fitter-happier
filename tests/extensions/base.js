class Intervention {
    constructor(params) {
        this.params = params
    }

    async execute() {
        const result = await this.trigger(this.params)
        console.log(`SAY: ${this.getScript(result)}`)
        return true
    }

    async trigger(params) {
        return true
        // trigger intervention
    }

    getScript(result) {
        if(result)
            return this.script
        else
            return 'something broke, typical...'
        // return formatted script
    }
}

module.exports = Intervention
// new Intervention('breathing-exercise', "Breath!", {breath: true, duration: 100000})
