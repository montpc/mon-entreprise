import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Le salaire net d’un mois habituel, avec un 13e mois', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	it.each([
		'salarié . rémunération . net . à payer avant impôt',
		'salarié . rémunération . net . payé après impôt',
	] as const)('vaut le montant annuel divisé par 13 (%s)', (salaireNet) => {
		const e = engine.setSituation({
			'salarié . contrat . salaire brut': '3000 €/mois',
			"salarié . rémunération . primes . fin d'année": 'oui',
		})
		const annuel = e.evaluate({ valeur: salaireNet, unité: '€/an' })
			.nodeValue as number

		expect(
			e.evaluate({ valeur: `${salaireNet} . mois habituel`, unité: '€/mois' })
				.nodeValue
		).toBeCloseTo(annuel / 13)
	})

	it('donne le salaire net annuel sur 13 mois à partir d’un mois habituel', () => {
		const e = engine.setSituation({
			'salarié . rémunération . net . à payer avant impôt . mois habituel':
				'2000 €/mois',
			"salarié . rémunération . primes . fin d'année": 'oui',
		})

		expect(e).toEvaluate(
			{
				valeur: 'salarié . rémunération . net . à payer avant impôt',
				unité: '€/an',
				arrondi: 'oui',
			},
			26000
		)
	})

	it('n’est pas applicable sans 13e mois', () => {
		const e = engine.setSituation({
			'salarié . contrat . salaire brut': '3000 €/mois',
		})

		expect(e).not.toBeApplicable(
			'salarié . rémunération . net . à payer avant impôt . mois habituel'
		)
	})
})
