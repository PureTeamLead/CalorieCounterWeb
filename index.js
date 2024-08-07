const dailyCalorieBudget = document.getElementById('budget-input')
const entryDropdown = document.getElementById('entry-dropdown')
const addEntryBtn = document.getElementById('addEntry')
const calculateBtn = document.getElementById('calculate-btn')
const clearBtn = document.getElementById('clear-btn')
const results = document.getElementById('output')
let isError = false

function cleanInput(input) {
	const regex = /[+-\s]/g
	return input.replace(regex, '')
}

function isInputInvalid(input) {
	const regex = /\d+e\d/i
	return input.match(regex)
}

function addEntry() {
	const targetInputContainer = document.querySelector(
		`.${entryDropdown.value} .input-container`
	)
	const entryNumber =
		targetInputContainer.querySelectorAll('input[type="text"]').length + 1
	const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`
	targetInputContainer.insertAdjacentHTML('beforeend', HTMLString)
}

function getCaloriesFromInputs(list) {
	let calories = 0
	for (const item of list) {
		const correctValue = cleanInput(item.value)
		const invalidInputMatch = isInputInvalid(correctValue)

		if (invalidInputMatch) {
			window.alert(`Invalid input: ${correctValue}`)
			isError = true
			return null
		}
		calories += Number(correctValue)
	}
	return calories
}

//e - default event -> page reloading after submit button click
function calculateCalories(e) {
	e.preventDefault()
	isError = false
	//possible bug
	const breakfastNumberInputs = document.querySelectorAll(
		'.breakfast .input-container input[type="number"]'
	)

	const lunchNumberInputs = document.querySelectorAll(
		'.lunch .input-container input[type="number"]'
	)

	const dinnerNumberInputs = document.querySelectorAll(
		'.dinner .input-container input[type="number"]'
	)

	const snacksNumberInputs = document.querySelectorAll(
		'.snacks .input-container input[type="number"]'
	)

	const exerciseNumberInputs = document.querySelectorAll(
		'.exercise .input-container input[type = "number"]'
	)

	const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs)
	const lunchCalories = getCaloriesFromInputs(lunchNumberInputs)
	const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs)
	const snacksCalories = getCaloriesFromInputs(snacksNumberInputs)
	const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs)
	const budgetCalories = getCaloriesFromInputs([dailyCalorieBudget])

	if (isError) {
		return
	}

	const consumedCalories =
		breakfastCalories + lunchCalories + dinnerCalories + snacksCalories

	const remainingCalories = budgetCalories - consumedCalories + exerciseCalories
	const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit'

	output.innerHTML = `
	<span class = '${surplusOrDeficit.toLowerCase()}'>${Math.abs(
		remainingCalories
	)} Calorie ${surplusOrDeficit}</span>
	<hr>
	<span>${budgetCalories} Calories Budgeted</span>
	<span>${consumedCalories} Calories Consumed</span>
	<span>${exerciseCalories} Calories Burned</span>
	`

	results.classList.remove('hide')
}

function clearForm() {
	dailyCalorieBudget.value = ''
	const containers = Array.from(
		document.querySelectorAll('fieldset .input-container')
	)

	for (const input of containers) {
		input.innerHTML = ''
	}

	results.innerHTML = ''
	results.classList.add('hide')
}

addEntryBtn.addEventListener('click', addEntry)
calculateBtn.addEventListener('click', calculateCalories)
clearBtn.addEventListener('click', clearForm)
