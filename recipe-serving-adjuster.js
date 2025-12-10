// Recipe Serving Adjuster - JavaScript
/*
Recipe Serving Adjuster
By Kim Mai Nguyen
Date: December 2, 2025
---------------------------------------
Description:
  A web app to adjust recipe ingredient quantities based on desired serving sizes.
Features:
  - Input original and target servings.
  - Add ingredients with name, quantity, and unit.
  - Calculate scaled ingredient quantities.
  - Remove ingredients by clicking on them.
  - Tabbed interface for scaled results and summary.
-----------------------

*/
(() => {
	// Elements
	const nameInput = document.getElementById('ingredient-name');
	const qtyInput = document.getElementById('ingredient-qty');
	const unitSelect = document.getElementById('ingredient-unit');
	const addBtn = document.getElementById('add-ingredient-btn');
	const ingredientItems = document.getElementById('ingredient-items');
	const calculateBtn = document.getElementById('calculate-btn');
	const outputEl = document.getElementById('tab-output');
	const originalServingsInput = document.getElementById('original-servings');
	const targetServingsInput = document.getElementById('target-servings');
	const tabs = Array.from(document.querySelectorAll('.tab'));

	// State
	let ingredients = [];
	let activeTab = 'scaled'; // 'scaled' or 'summary'

	// Helpers
	function formatNumber(n){
		if (isNaN(n)) return n;
		if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
		return String(parseFloat(n.toFixed(2)));
	}

	function setActiveTab(name){
		activeTab = name;
		tabs.forEach(t => {
			const tabName = t.textContent.trim().toLowerCase().startsWith('scaled') ? 'scaled' : 'summary';
			if (tabName === name) t.classList.add('active'); else t.classList.remove('active');
		});
		renderOutput();
	}

	// Render ingredient list
	function renderIngredientList(){
		ingredientItems.innerHTML = '';
		if (ingredients.length === 0){
			const p = document.createElement('p');
			p.className = 'muted';
			p.textContent = 'No ingredients yet — add one above.';
			ingredientItems.appendChild(p);
			return;
		}

		ingredients.forEach((ing, idx) => {
			const div = document.createElement('div');
			div.className = 'ingredient-item';
			div.dataset.index = String(idx);

			const label = document.createElement('span');
			label.textContent = `${formatNumber(ing.qty)} ${ing.unit} ${ing.name}`;

			const removeMark = document.createElement('span');
			removeMark.className = 'remove-mark';
			removeMark.textContent = 'X';

			div.appendChild(label);
			div.appendChild(removeMark);

			// Click to remove (clicking anywhere on the item removes it)
			div.addEventListener('click', () => {
				if (!confirm(`Remove '${ing.name}' from the list?`)) return;
				ingredients.splice(idx, 1);
				renderIngredientList();
			});

			ingredientItems.appendChild(div);
		});
	}

	// Render output depending on active tab
	function renderOutput(){
		outputEl.innerHTML = '';
		const orig = parseFloat(originalServingsInput.value);
		const targ = parseFloat(targetServingsInput.value);

		if (isNaN(orig) || isNaN(targ) || orig <= 0){
			const p = document.createElement('p');
			p.className = 'muted';
			p.textContent = 'Please enter a valid original and target serving size (original must be > 0).';
			outputEl.appendChild(p);
			return;
		}

		const scale = targ / orig;

		if (activeTab === 'scaled'){
			const header = document.createElement('div');
			header.innerHTML = `<strong>Scale factor:</strong> ${formatNumber(scale)} (target ${targ} / original ${orig})`;
			outputEl.appendChild(header);

			if (ingredients.length === 0){
				const p = document.createElement('p');
				p.className = 'muted';
				p.textContent = 'No ingredients to scale. Add ingredients and click Calculate.';
				outputEl.appendChild(p);
				return;
			}

			const ul = document.createElement('ul');
			ul.className = 'scaled-list';
			ingredients.forEach(ing => {
				const li = document.createElement('li');
				const newQty = ing.qty * scale;
				li.textContent = `${formatNumber(newQty)} ${ing.unit} ${ing.name} (was ${formatNumber(ing.qty)} ${ing.unit})`;
				ul.appendChild(li);
			});
			outputEl.appendChild(ul);
		} else {
			// summary
			const summary = document.createElement('div');
			summary.innerHTML = `
				<p><strong>Original servings:</strong> ${formatNumber(orig)}</p>
				<p><strong>Target servings:</strong> ${formatNumber(targ)}</p>
				<p><strong>Scale factor:</strong> ${formatNumber(scale)}</p>
				<p><strong>Ingredients:</strong> ${ingredients.length}</p>
			`;
			outputEl.appendChild(summary);
		}
	}

	// Add ingredient handler
	addBtn.addEventListener('click', (e) => {
		e.preventDefault();
		const name = nameInput.value.trim();
		const qty = parseFloat(qtyInput.value);
		const unit = unitSelect.value;

		if (!name){ alert('Please enter an ingredient name.'); nameInput.focus(); return; }
		if (isNaN(qty) || qty <= 0){ alert('Please enter a valid quantity (> 0).'); qtyInput.focus(); return; }

		ingredients.push({ name, qty, unit });
		renderIngredientList();

		// clear inputs
		nameInput.value = '';
		qtyInput.value = '';
		unitSelect.selectedIndex = 0;
		nameInput.focus();
	});

	// Calculate button
	calculateBtn.addEventListener('click', (e) => {
		e.preventDefault();
		// validate servings
		const orig = parseFloat(originalServingsInput.value);
		const targ = parseFloat(targetServingsInput.value);
		if (isNaN(orig) || orig <= 0){ alert('Original servings must be a number greater than 0.'); originalServingsInput.focus(); return; }
		if (isNaN(targ) || targ <= 0){ alert('Target servings must be a number greater than 0.'); targetServingsInput.focus(); return; }

		// Switch to scaled tab and render
		setActiveTab('scaled');
	});

	// Tab clicks
	tabs.forEach(t => {
		t.addEventListener('click', () => {
			const tabName = t.textContent.trim().toLowerCase().startsWith('scaled') ? 'scaled' : 'summary';
			setActiveTab(tabName);
		});
	});

	// initial render
	renderIngredientList();
	setActiveTab('scaled');

})();

