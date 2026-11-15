import { useSelector } from 'react-redux'

import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'

import Aides from './components/Aides'
import TitresRestaurant from './components/TitresRestaurant'

export default function SalariéSimulationGoals() {
	const engine = useEngine()
	const vueMensuelle = useSelector(targetUnitSelector) === '€/mois'
	// Avec un 13e mois, la vue mensuelle montre le net d'un mois habituel
	// plutôt que la moyenne sur 12 mois.
	const moisHabituel =
		vueMensuelle &&
		engine.evaluate({
			'est applicable':
				'salarié . rémunération . net . à payer avant impôt . mois habituel',
		}).nodeValue === true

	return (
		<SimulationGoals>
			<PeriodSwitch />
			<SimulationGoal dottedName="salarié . coût total employeur" />
			<Aides />

			<SimulationGoal dottedName="salarié . contrat . salaire brut" />
			<SimulationGoal
				small
				dottedName="salarié . contrat . salaire brut . équivalent temps plein"
			/>
			<Condition expression="salarié . rémunération . brut != salarié . contrat . salaire brut">
				<SimulationGoal small dottedName="salarié . rémunération . brut" />
			</Condition>
			<SimulationGoal
				dottedName={
					moisHabituel
						? 'salarié . rémunération . net . à payer avant impôt . mois habituel'
						: 'salarié . rémunération . net . à payer avant impôt'
				}
			/>
			<TitresRestaurant />
			<SimulationGoal
				dottedName={
					moisHabituel
						? 'salarié . rémunération . net . payé après impôt . mois habituel'
						: 'salarié . rémunération . net . payé après impôt'
				}
			/>
		</SimulationGoals>
	)
}
