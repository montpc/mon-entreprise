import { render, screen } from '@testing-library/react'
import règles from 'modele-social'
import { describe, expect, it } from 'vitest'

import { TestProvider } from '@/test/TestProvider'
import { EngineProvider } from '@/utils/publicodes/EngineContext'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import SalariéSimulationGoals from './Goals'

const moteurDuModèle = engineFactory(règles)

const afficherLesObjectifs = (avecTreizièmeMois: 'oui' | 'non') => {
	const engine = moteurDuModèle.shallowCopy().setSituation({
		'salarié . contrat . salaire brut': '3000 €/mois',
		"salarié . rémunération . primes . fin d'année": avecTreizièmeMois,
	})
	render(
		<TestProvider>
			<EngineProvider value={engine}>
				<SalariéSimulationGoals />
			</EngineProvider>
		</TestProvider>
	)
}

describe('Objectifs du simulateur salarié', () => {
	it('affiche la rémunération brute, 13e mois compris, sous le salaire brut', () => {
		afficherLesObjectifs('oui')

		expect(screen.getByLabelText('Rémunération brute')).toHaveDisplayValue(
			/^3\s*250\b/
		)
	})

	it('affiche en vue mensuelle le salaire net d’un mois habituel', () => {
		afficherLesObjectifs('oui')

		expect(screen.getByLabelText('Salaire net')).toHaveDisplayValue(
			/^2\s*355\b/
		)
	})

	it("n'affiche pas la rémunération brute quand elle est égale au salaire brut", () => {
		afficherLesObjectifs('non')

		expect(
			screen.queryByLabelText('Rémunération brute')
		).not.toBeInTheDocument()
	})
})
