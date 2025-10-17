// Mock data + comprehensive admin dashboard interactions
(function() {
	// --- Mock Data ---
	let mockOrders = [
		{
			id: 1234,
			status: 'completed',
			createdAt: new Date(Date.now() - 1000 * 60 * 2),
			items: [
				{ name: 'Butter Chicken', quantity: 1, price: 220 }
			],
			notes: 'Less spicy',
			total: 220,
			customer: 'Rahul'
		},
		{
			id: 1235,
			status: 'in-progress',
			createdAt: new Date(Date.now() - 1000 * 60 * 5),
			items: [
				{ name: 'Veg Biryani', quantity: 1, price: 180 }
			],
			notes: '',
			total: 180,
			customer: 'Aisha'
		},
		{
			id: 1236,
			status: 'pending',
			createdAt: new Date(Date.now() - 1000 * 60 * 8),
			items: [
				{ name: 'Paneer Tikka', quantity: 1, price: 200 }
			],
			notes: 'Extra mint chutney',
			total: 200,
			customer: 'Vikram'
		},
		{
			id: 1237,
			status: 'completed',
			createdAt: new Date(Date.now() - 1000 * 60 * 10),
			items: [
				{ name: 'Masala Dosa', quantity: 1, price: 120 }
			],
			notes: '',
			total: 120,
			customer: 'Sneha'
		},
		{
			id: 1238,
			status: 'cancelled',
			createdAt: new Date(Date.now() - 1000 * 60 * 15),
			items: [
				{ name: 'Chicken Roll', quantity: 1, price: 90 }
			],
			notes: 'Cancel, changed mind',
			total: 90,
			customer: 'Neeraj'
		}
	];

	let mockMenu = [
		{ name: 'Butter Chicken', price: 220, available: true, category: 'meals', stock: 8 },
		{ name: 'Veg Biryani', price: 180, available: true, category: 'meals', stock: 5 },
		{ name: 'Paneer Tikka', price: 200, available: false, category: 'meals', stock: 2 },
		{ name: 'Masala Dosa', price: 120, available: true, category: 'meals', stock: 11 },
		{ name: 'Chicken Roll', price: 90, available: false, category: 'snacks', stock: 1 },
		{ name: 'Cold Coffee', price: 70, available: true, category: 'drinks', stock: 14 }
	];

	let mockFeedback = [
		{ id: 1, rating: 5, comment: 'Loved the dosa!', status: 'unread', when: '5m ago', by: 'Sana' },
		{ id: 2, rating: 4, comment: 'Great biryani.', status: 'responded', when: '1h ago', by: 'Ravi' },
		{ id: 3, rating: 3, comment: 'Cold coffee was okay.', status: 'unread', when: '1d ago', by: 'Priya' }
	];

	// --- Utilities ---
	const PAGE_SIZE = 6;
	let ordersCurrentPage = 1;

	function timeAgo(date) {
		const diff = Math.floor((Date.now() - date.getTime()) / 1000);
		if (diff < 60) return `${diff}s ago`;
		const m = Math.floor(diff / 60);
		if (m < 60) return `${m}m ago`;
		const h = Math.floor(m / 60);
		if (h < 24) return `${h}h ago`;
		return `${Math.floor(h / 24)}d ago`;
	}

	function showToast(message) {
		const toastEl = document.getElementById('adminToast');
		const body = document.getElementById('adminToastBody');
		if (!toastEl || !body) return;
		body.textContent = message;
		const toast = new bootstrap.Toast(toastEl);
		toast.show();
	}

	function badgeClass(status) {
		switch(status) {
			case 'completed': return 'bg-success';
			case 'in-progress': return 'bg-warning text-dark';
			case 'pending': return 'bg-info text-dark';
			case 'cancelled': return 'bg-danger';
			default: return 'bg-secondary';
		}
	}

	// --- Orders ---
	function filterOrders({ status, q, datePreset, start, end }) {
		return mockOrders
			.filter(o => status === 'all' || o.status === status)
			.filter(o => !q || String(o.id).includes(q) || o.items.some(it => it.name.toLowerCase().includes(q)))
			.filter(o => {
				if (datePreset === 'today') {
					const now = new Date();
					const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
					return o.createdAt >= startOfDay;
				}
				if (datePreset === 'week') {
					const now = new Date();
					const day = now.getDay();
					const diff = now.getDate() - day + (day === 0 ? -6 : 1);
					const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
					return o.createdAt >= startOfWeek;
				}
				if (datePreset === 'custom' && start && end) {
					return o.createdAt >= start && o.createdAt <= end;
				}
				return true;
			});
	}

	function renderOrdersList(orders) {
		const list = document.getElementById('ordersList');
		if (!list) return;
		list.innerHTML = '';
		orders.forEach(o => {
			const row = document.createElement('div');
			row.className = 'list-group-item bg-transparent text-white d-flex justify-content-between align-items-center py-3 border-secondary';
			row.draggable = false;
			row.innerHTML = `
				<div>
					<strong>#${o.id}</strong> • ${o.items.map(i=>i.name).join(', ')}
					<span class="badge ${badgeClass(o.status)} ms-2 text-uppercase">${o.status}</span>
				</div>
				<div class="d-flex align-items-center gap-2">
					<span class="text-muted small">${timeAgo(o.createdAt)}</span>
					<span class="fw-semibold">₹${o.total}</span>
					<div class="btn-group btn-group-sm" role="group">
						<button class="btn btn-outline-light" data-action="details" data-id="${o.id}"><i class="fas fa-eye"></i></button>
						<button class="btn btn-outline-light" data-action="pending" data-id="${o.id}">P</button>
						<button class="btn btn-outline-light" data-action="progress" data-id="${o.id}">PR</button>
						<button class="btn btn-outline-light" data-action="complete" data-id="${o.id}"><i class="fas fa-check"></i></button>
					</div>
				</div>`;
			list.appendChild(row);
		});

		// actions
		list.querySelectorAll('button[data-action]').forEach(btn => {
			btn.addEventListener('click', function() {
				const id = Number(this.getAttribute('data-id'));
				const action = this.getAttribute('data-action');
				const order = mockOrders.find(o => o.id === id);
				if (!order) return;
				if (action === 'details') return openOrderDetails(order);
				if (action === 'pending') order.status = 'pending';
				if (action === 'progress') order.status = 'in-progress';
				if (action === 'complete') order.status = 'completed';
				showToast(`Order #${id} set to ${order.status}`);
				renderAll();
			});
		});
	}

	function paginateOrders(all, page) {
		const start = (page - 1) * PAGE_SIZE;
		return all.slice(start, start + PAGE_SIZE);
	}

	function renderOrdersPagination(totalCount) {
		const ul = document.getElementById('ordersPagination');
		if (!ul) return;
		ul.innerHTML = '';
		const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
		for (let p = 1; p <= totalPages; p++) {
			const li = document.createElement('li');
			li.className = `page-item ${p === ordersCurrentPage ? 'active' : ''}`;
			li.innerHTML = `<a class="page-link" href="#">${p}</a>`;
			li.addEventListener('click', function(e){ e.preventDefault(); ordersCurrentPage = p; renderAll(); });
			ul.appendChild(li);
		}
	}

	function openOrderDetails(order) {
		const body = document.getElementById('orderDetailsBody');
		if (!body) return;
		body.innerHTML = `
			<div class="mb-2"><strong>Order #${order.id}</strong></div>
			<div class="text-muted small mb-2">${timeAgo(order.createdAt)} • ${order.customer || 'Customer'}</div>
			<ul class="list-group list-group-flush mb-3">${order.items.map(it => `
				<li class="list-group-item bg-transparent text-white d-flex justify-content-between">
					<span>${it.name} × ${it.quantity}</span>
					<span>₹${(it.price * it.quantity)}</span>
				</li>`).join('')}
			</ul>
			${order.notes ? `<div class="mb-2"><em>Notes:</em> ${order.notes}</div>` : ''}
			<div class="fw-bold">Total: ₹${order.total}</div>
		`;
		const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
		modal.show();
	}

	// --- CSV Export ---
	function exportOrdersCsv(orders) {
		const headers = ['id','status','createdAt','items','total','customer','notes'];
		const rows = orders.map(o => [
			o.id,
			o.status,
			o.createdAt.toISOString(),
			o.items.map(i=>`${i.name} x${i.quantity}`).join('; '),
			o.total,
			o.customer || '',
			o.notes || ''
		]);
		const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'orders.csv';
		a.click();
		URL.revokeObjectURL(url);
		showToast('Exported orders to CSV');
	}

	// --- Menu ---
	function renderLowStock() {
		const list = document.getElementById('lowStockList');
		if (!list) return;
		list.innerHTML = '';
		const low = mockMenu.filter(m => m.stock <= 3);
		if (low.length === 0) {
			const empty = document.createElement('div');
			empty.className = 'list-group-item bg-transparent text-white border-secondary';
			empty.textContent = 'All good! No low-stock items.';
			list.appendChild(empty);
			return;
		}
		low.forEach(m => {
			const row = document.createElement('div');
			row.className = 'list-group-item bg-transparent text-white d-flex justify-content-between align-items-center py-2 border-secondary';
			row.innerHTML = `<span>${m.name}</span><span class="badge bg-danger">Stock: ${m.stock}</span>`;
			list.appendChild(row);
		});
	}

	function renderMenu(filterAvailability, searchTerm, category) {
		const list = document.getElementById('menuList');
		if (!list) return;
		list.innerHTML = '';
		const q = (searchTerm || '').toLowerCase();
		const filtered = mockMenu
			.filter(m => filterAvailability === 'all' || (filterAvailability === 'available' ? m.available : !m.available))
			.filter(m => category === 'all' || m.category === category)
			.filter(m => !q || m.name.toLowerCase().includes(q));
		filtered.forEach((m, idx) => {
			const row = document.createElement('div');
			row.className = 'list-group-item bg-transparent text-white d-flex justify-content-between align-items-center py-2 border-secondary';
			row.setAttribute('data-index', idx);
			row.draggable = true;
			row.innerHTML = `
				<div class="d-flex align-items-center gap-2">
					<input type="checkbox" class="form-check-input" data-bulk-index="${idx}">
					<span>${m.name}</span>
					<span class="badge ${m.available ? 'bg-success' : 'bg-secondary'}">${m.available ? 'Available' : 'Unavailable'}</span>
					<span class="badge bg-dark">${m.category}</span>
					<span class="badge ${m.stock <= 3 ? 'bg-danger' : 'bg-info'}">Stock: ${m.stock}</span>
				</div>
				<div class="d-flex align-items-center gap-2">
					<strong>₹${m.price}</strong>
					<button class="btn btn-outline-light btn-sm" data-edit-index="${idx}"><i class="fas fa-pen"></i></button>
					<button class="btn btn-outline-light btn-sm" data-delete-index="${idx}"><i class="fas fa-trash"></i></button>
				</div>`;
			list.appendChild(row);
		});

		// Edit/Delete
		list.querySelectorAll('[data-edit-index]').forEach(btn => btn.addEventListener('click', openMenuEdit));
		list.querySelectorAll('[data-delete-index]').forEach(btn => btn.addEventListener('click', deleteMenuItem));

		// Drag & Drop
		list.querySelectorAll('.list-group-item').forEach(row => {
			row.addEventListener('dragstart', (e) => {
				e.dataTransfer.setData('text/plain', row.getAttribute('data-index'));
			});
			row.addEventListener('dragover', (e) => e.preventDefault());
			row.addEventListener('drop', (e) => {
				e.preventDefault();
				const from = Number(e.dataTransfer.getData('text/plain'));
				const to = Number(row.getAttribute('data-index'));
				if (isNaN(from) || isNaN(to) || from === to) return;
				const item = filtered.splice(from,1)[0];
				filtered.splice(to,0,item);
				// Persist back to mockMenu by rebuilding based on filters would be complex;
				// For demo simplicity, reorder entire mockMenu by names order:
				mockMenu = filtered.concat(mockMenu.filter(m => !filtered.includes(m)));
				renderAll();
			});
		});
	}

	function openMenuEdit(e) {
		const idx = Number(e.currentTarget.getAttribute('data-edit-index'));
		const item = mockMenu[idx];
		if (!item) return;
		const title = document.getElementById('menuItemModalTitle');
		const nameEl = document.getElementById('menuItemName');
		const priceEl = document.getElementById('menuItemPrice');
		const catEl = document.getElementById('menuItemCategory');
		const availEl = document.getElementById('menuItemAvailable');
		const indexEl = document.getElementById('menuItemIndex');
		if (!title || !nameEl || !priceEl || !catEl || !availEl || !indexEl) return;
		title.textContent = 'Edit Menu Item';
		nameEl.value = item.name;
		priceEl.value = item.price;
		catEl.value = item.category;
		availEl.checked = item.available;
		indexEl.value = idx;
		new bootstrap.Modal(document.getElementById('menuItemModal')).show();
	}

	function deleteMenuItem(e) {
		const idx = Number(e.currentTarget.getAttribute('data-delete-index'));
		mockMenu.splice(idx,1);
		showToast('Item deleted');
		renderAll();
	}

	// --- Feedback ---
	function renderFeedback(filter) {
		const list = document.getElementById('feedbackList');
		if (!list) return;
		list.innerHTML = '';
		const items = mockFeedback.filter(f => filter === 'all' || f.status === filter);
		items.forEach(f => {
			const row = document.createElement('div');
			row.className = 'list-group-item bg-transparent text-white d-flex justify-content-between align-items-start py-2 border-secondary';
			row.innerHTML = `
				<div>
					<div class="mb-1">
						${'★'.repeat(f.rating)}${'☆'.repeat(5-f.rating)}
						<span class="badge ${f.status==='responded'?'bg-success':'bg-warning text-dark'} ms-2">${f.status}</span>
					</div>
					<div class="small text-muted">${f.by} • ${f.when}</div>
					<div>${f.comment}</div>
				</div>
				<div class="d-flex flex-column gap-2">
					<button class="btn btn-outline-light btn-sm" data-fb="read" data-id="${f.id}">Mark as Read</button>
					<button class="btn btn-outline-light btn-sm" data-fb="respond" data-id="${f.id}">Responded</button>
				</div>`;
			list.appendChild(row);
		});
		list.querySelectorAll('[data-fb]').forEach(btn => btn.addEventListener('click', function(){
			const id = Number(this.getAttribute('data-id'));
			const type = this.getAttribute('data-fb');
			const f = mockFeedback.find(x => x.id === id);
			if (!f) return;
			f.status = type === 'respond' ? 'responded' : 'unread';
			showToast(type === 'respond' ? 'Marked as responded' : 'Marked as read');
			renderAll();
		}));
	}

	// --- Charts ---
	let salesChart, popularChart, statusChart;
	function upsertCharts() {
		const salesCtx = document.getElementById('salesChart');
		const popularCtx = document.getElementById('popularChart');
		const statusCtx = document.getElementById('statusChart');
		if (salesCtx) {
			const period = (document.getElementById('salesPeriod')||{}).value || 'daily';
			const metric = (document.getElementById('salesMetric')||{}).value || 'orders';
			const labels = period === 'daily' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : ['W1','W2','W3','W4','W5'];
			const data = labels.map(()=> Math.floor(Math.random()* (metric==='revenue'?2000:metric==='items'?80:50)) + (metric==='revenue'?500:metric==='items'?10:5));
			if (salesChart) salesChart.destroy();
			salesChart = new Chart(salesCtx, { type:'line', data:{ labels, datasets:[{ label: metric, data, borderColor:'#ff6b35', backgroundColor:'rgba(255,107,53,0.2)', tension:0.3 }] }, options:{ plugins:{ legend:{ labels:{ color:'#fff' } } }, scales:{ x:{ ticks:{ color:'#ccc' } }, y:{ ticks:{ color:'#ccc' } } } } });
		}
		if (popularCtx) {
			const grouped = mockOrders.flatMap(o=>o.items).reduce((acc,it)=>{ acc[it.name]=(acc[it.name]||0)+it.quantity; return acc; },{});
			const labels = Object.keys(grouped);
			const data = Object.values(grouped);
			if (popularChart) popularChart.destroy();
			popularChart = new Chart(popularCtx, { type:'doughnut', data:{ labels, datasets:[{ data, backgroundColor:['#ff6b35','#36a2eb','#cc65fe','#ffce56','#2ecc71','#e74c3c'] }] }, options:{ plugins:{ legend:{ labels:{ color:'#fff' } } } } });
		}
		if (statusCtx) {
			const counts = mockOrders.reduce((acc,o)=>{ acc[o.status]=(acc[o.status]||0)+1; return acc; },{});
			const labels = Object.keys(counts);
			const data = Object.values(counts);
			if (statusChart) statusChart.destroy();
			statusChart = new Chart(statusCtx, { type:'pie', data:{ labels, datasets:[{ data, backgroundColor:['#198754','#ffc107','#0dcaf0','#dc3545','#6c757d'] }] }, options:{ plugins:{ legend:{ labels:{ color:'#fff' } } } } });
		}
	}

	// --- Theme ---
	function applyTheme(light) {
		const label = document.querySelector('label[for="themeToggle"]');
		if (light) {
			document.body.classList.add('bg-white','text-dark');
			label && (label.textContent = 'Dark');
		} else {
			document.body.classList.remove('bg-white','text-dark');
			label && (label.textContent = 'Light');
		}
	}

	// --- Render All ---
	function renderAll() {
		// Orders filters
		const statusSel = document.getElementById('orderStatusFilter');
		const qInput = document.getElementById('orderSearch');
		const preset = document.getElementById('orderDatePreset');
		const sd = document.getElementById('orderStartDate');
		const ed = document.getElementById('orderEndDate');
		const status = statusSel ? statusSel.value : 'all';
		const q = (qInput ? qInput.value : '').toLowerCase();
		let start = null, end = null;
		const datePreset = preset ? preset.value : 'all';
		if (datePreset === 'custom' && sd && ed && sd.value && ed.value) {
			start = new Date(sd.value);
			end = new Date(ed.value);
		}
		const filtered = filterOrders({ status, q, datePreset, start, end });
		renderOrdersPagination(filtered.length);
		const pageOrders = paginateOrders(filtered, ordersCurrentPage);
		renderOrdersList(pageOrders);

		// Menu
		const availSel = document.getElementById('availabilityFilter');
		const catSel = document.getElementById('categoryFilter');
		const menuQ = document.getElementById('menuSearch');
		renderMenu(availSel ? availSel.value : 'all', menuQ ? menuQ.value : '', catSel ? catSel.value : 'all');

		renderLowStock();
		upsertCharts();
		renderFeedback((document.getElementById('feedbackFilter')||{}).value || 'all');
	}

	// --- Event Wiring ---
	document.addEventListener('DOMContentLoaded', function() {
		// Initial draws
		renderAll();

		// Orders filters
		['orderStatusFilter','orderSearch','orderDatePreset','orderStartDate','orderEndDate'].forEach(id => {
			const el = document.getElementById(id);
			if (!el) return;
			el.addEventListener('change', function(){
				if (id === 'orderDatePreset') {
					const preset = this.value;
					const sd = document.getElementById('orderStartDate');
					const ed = document.getElementById('orderEndDate');
					if (preset === 'custom') {
						sd && sd.classList.remove('d-none');
						ed && ed.classList.remove('d-none');
					} else {
						sd && sd.classList.add('d-none');
						ed && ed.classList.add('d-none');
					}
				}
				ordersCurrentPage = 1;
				renderAll();
			});
			if (id === 'orderSearch') el.addEventListener('input', () => { ordersCurrentPage = 1; renderAll(); });
		});

		// Export
		const exportBtn = document.getElementById('exportCsvBtn');
		exportBtn && exportBtn.addEventListener('click', function(){
			const status = (document.getElementById('orderStatusFilter')||{}).value || 'all';
			const q = (document.getElementById('orderSearch')||{}).value || '';
			const datePreset = (document.getElementById('orderDatePreset')||{}).value || 'all';
			const sd = document.getElementById('orderStartDate');
			const ed = document.getElementById('orderEndDate');
			exportOrdersCsv(filterOrders({ status, q: q.toLowerCase(), datePreset, start: sd && sd.value ? new Date(sd.value): null, end: ed && ed.value ? new Date(ed.value) : null }));
		});

		// Menu filters
		['availabilityFilter','menuSearch','categoryFilter'].forEach(id => {
			const el = document.getElementById(id);
			if (!el) return;
			const evt = id === 'menuSearch' ? 'input' : 'change';
			el.addEventListener(evt, renderAll);
		});

		// Add / Bulk update
		const addBtn = document.getElementById('addMenuItemBtn');
		addBtn && addBtn.addEventListener('click', function(){
			const title = document.getElementById('menuItemModalTitle');
			const indexEl = document.getElementById('menuItemIndex');
			const nameEl = document.getElementById('menuItemName');
			const priceEl = document.getElementById('menuItemPrice');
			const catEl = document.getElementById('menuItemCategory');
			const availEl = document.getElementById('menuItemAvailable');
			if (!title || !indexEl || !nameEl || !priceEl || !catEl || !availEl) return;
			title.textContent = 'Add Menu Item';
			indexEl.value = '';
			nameEl.value = '';
			priceEl.value = '';
			catEl.value = 'meals';
			availEl.checked = true;
			new bootstrap.Modal(document.getElementById('menuItemModal')).show();
		});

		const menuForm = document.getElementById('menuItemForm');
		menuForm && menuForm.addEventListener('submit', function(e){
			e.preventDefault();
			const idx = Number(document.getElementById('menuItemIndex').value);
			const name = document.getElementById('menuItemName').value.trim();
			const price = Number(document.getElementById('menuItemPrice').value);
			const category = document.getElementById('menuItemCategory').value;
			const available = document.getElementById('menuItemAvailable').checked;
			if (!name || isNaN(price)) return;
			if (Number.isInteger(idx)) {
				if (mockMenu[idx]) {
					mockMenu[idx].name = name; mockMenu[idx].price = price; mockMenu[idx].category = category; mockMenu[idx].available = available;
				}
			} else {
				mockMenu.push({ name, price, category, available, stock: 10 });
			}
			showToast('Menu saved');
			bootstrap.Modal.getInstance(document.getElementById('menuItemModal')).hide();
			renderAll();
		});

		const bulkAvailBtn = document.getElementById('bulkAvailabilityBtn');
		bulkAvailBtn && bulkAvailBtn.addEventListener('click', function(){
			const indices = Array.from(document.querySelectorAll('[data-bulk-index]:checked')).map(chk => Number(chk.getAttribute('data-bulk-index')));
			mockMenu.forEach((m,i)=>{ if(indices.includes(i)) m.available = !m.available; });
			showToast('Toggled availability for selected');
			renderAll();
		});
		const bulkPriceBtn = document.getElementById('bulkPriceBtn');
		bulkPriceBtn && bulkPriceBtn.addEventListener('click', function(){
			const delta = prompt('Enter price delta (e.g., 10 or -5):','0');
			const n = Number(delta);
			if (isNaN(n)) return;
			const indices = Array.from(document.querySelectorAll('[data-bulk-index]:checked')).map(chk => Number(chk.getAttribute('data-bulk-index')));
			mockMenu.forEach((m,i)=>{ if(indices.includes(i)) m.price = Math.max(0, m.price + n); });
			showToast('Updated prices for selected');
			renderAll();
		});

		// Low stock restock
		const restockBtn = document.getElementById('restockAllBtn');
		restockBtn && restockBtn.addEventListener('click', function(){
			mockMenu.forEach(m => { if (m.stock <= 3) m.stock += 10; });
			showToast('Mock restocked low items');
			renderAll();
		});

		// Feedback filter
		const fbFilter = document.getElementById('feedbackFilter');
		fbFilter && fbFilter.addEventListener('change', renderAll);

		// Theme toggle
		const theme = document.getElementById('themeToggle');
		theme && theme.addEventListener('change', function(){ applyTheme(this.checked); });

		// Quick actions
		const markAllComplete = document.getElementById('markAllComplete');
		markAllComplete && markAllComplete.addEventListener('click', function() {
			mockOrders.forEach(o => o.status = 'completed');
			showToast('All orders completed');
			renderAll();
		});

		const toggleAvailability = document.getElementById('toggleAvailability');
		toggleAvailability && toggleAvailability.addEventListener('click', function() {
			mockMenu.forEach(m => m.available = !m.available);
			showToast('Toggled availability for all');
			renderAll();
		});

		// Sales controls
		['salesPeriod','salesMetric'].forEach(id => {
			const el = document.getElementById(id);
			el && el.addEventListener('change', upsertCharts);
		});

		// Mock notifications: new order every ~30s
		setInterval(function(){
			if (Math.random() < 0.5) return;
			const baseId = Math.max(...mockOrders.map(o=>o.id));
			const item = mockMenu[Math.floor(Math.random()*mockMenu.length)];
			const order = { id: baseId+1, status:'pending', createdAt:new Date(), items:[{name:item.name, quantity:1, price:item.price}], notes:'', total:item.price, customer:'Guest' };
			mockOrders.unshift(order);
			showToast(`New order #${order.id} added`);
			renderAll();
		}, 30000);

		// Low stock alert poll
		setInterval(function(){
			const low = mockMenu.filter(m => m.stock <= 3);
			if (low.length) showToast(`${low.length} low-stock item(s)`);
		}, 45000);
	});
})();


