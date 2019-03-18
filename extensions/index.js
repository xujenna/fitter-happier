const Intervention = require('./base')
const Breathing = require('./breathing')
const Gifs = require('./seal')

const interventions = {
    'breathe': Breathing,
    'gifs': Gifs
}

const selected = 'gifs'
const param = 'Seal'

const SelectedIntervention = interventions[selected]
const selectedIntervention = new SelectedIntervention(param)
selectedIntervention.execute()
