import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

// Article L3242-1 du Code du travail : la rémunération mensuelle se calcule en
// multipliant la rémunération horaire par les 52/12 de la durée hebdomadaire.
const semainesParMois = 52 / 12

describe('Le taux horaire brut du salarié', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const évalue = (dottedName: RègleModèleSocial) =>
		engine.evaluate(dottedName).nodeValue as number

	it('divise le salaire brut par les heures du contrat à temps plein', () => {
		engine.setSituation({
			'salarié . contrat . salaire brut': '1867.02 €/mois',
		})

		expect(
			évalue('salarié . contrat . salaire brut . taux horaire')
		).toBeCloseTo(12.31, 2)
	})

	it('donne le salaire brut mensuel à partir du taux horaire à temps plein', () => {
		engine.setSituation({
			'salarié . contrat . salaire brut . taux horaire': '12.31 €/heure',
		})

		expect(évalue('salarié . contrat . salaire brut')).toBeCloseTo(
			12.31 * 35 * semainesParMois,
			1
		)
	})

	it('tient compte des heures par semaine du temps partiel', () => {
		engine.setSituation({
			'salarié . contrat . salaire brut . taux horaire': '15 €/heure',
			'salarié . contrat . temps de travail . temps partiel': 'oui',
			'salarié . contrat . temps de travail . temps partiel . heures par semaine':
				'24 heure/semaine',
		})

		expect(évalue('salarié . contrat . salaire brut')).toBeCloseTo(
			15 * 24 * semainesParMois,
			1
		)
	})

	it('ne change pas avec les heures supplémentaires', () => {
		engine.setSituation({
			'salarié . contrat . salaire brut . taux horaire': '15 €/heure',
			'salarié . temps de travail . heures supplémentaires': '10 heure/mois',
		})

		expect(évalue('salarié . contrat . salaire brut')).toBeCloseTo(
			15 * 35 * semainesParMois,
			1
		)
	})
})
