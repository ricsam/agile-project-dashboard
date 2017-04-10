var sprints = [
	{
		name: 'Halvtidsrapport',
		delivery: 'En halvtidsrapport',
		due_date: '2017-3-5',
		tasks: [
			{ tags: ['meeting'], priority: 1, name: "Uppstart", delivery: "Starta upp projektet", allocated_time: 9, time_spent: 9, due_date: '2017-01-26', description: {}},
			{ tags: ['meeting'], priority: 1, name: "Föreslå vision, paket och deletapper", delivery: "Starta upp projektet", allocated_time: 9, time_spent: 9, due_date: '2017-01-26', description: {}},
			{ tags: ['meeting'], priority: 1, name: 'research', delivery: 'Dokuemnt med information', due_date: '2017-01-31', description: {}, sub_tasks: [
				{ priority: 1, name: "ha satt er in i företagets verksamhet", delivery: "Dokument", allocated_time: 5, time_spent: 5, description: {}},
				{ priority: 1, name: "ha satt er in i frågeställningsområdet", delivery: "Dokument", allocated_time: 5, time_spent: 5, description: {}}
			]},
			{ priority: 1, name: "Hitta info om aspekter och kriterier som värderar dessa mot varandra", delivery: "xyz", due_date: '2017-01-31', description: {}, sub_tasks: [
				{ priority: 1, name: "Om Mänskliga rättigheter", delivery: "Allmänt om aspekten, källor som motiverar om det är en viktig eller oviktig aspekt.", allocated_time: 5, time_spent: 5, description: {}},
				{ priority: 1, name: "Om Farliga gifter", delivery: "Allmänt om aspekten, källor som motiverar om det är en viktig eller oviktig aspekt.", allocated_time: 4, time_spent: 4, description: {}},
				{ priority: 1, name: "Om Produktion", delivery: "Allmänt om aspekten, källor som motiverar om det är en viktig eller oviktig aspekt.", allocated_time: 4, time_spent: 4, description: {}},
				{ priority: 1, name: "Om Arbetsförhållande", delivery: "Allmänt om aspekten, källor som motiverar om det är en viktig eller oviktig aspekt.", allocated_time: 4, time_spent: 4, description: {}},
			]},
			{ tags: ['meeting'], priority: 1, name: "Skriva utkast", delivery: "Dokument", allocated_time: 3, time_spent: 3, due_date: '2017-2-10', description: {}},
			{ tags: ['meeting'], priority: 1, name: "Skriva frågor", delivery: "Dokument", allocated_time: 3, time_spent: 3, due_date: '2017-2-11', description: {}},
			{ tags: ['meeting'], priority: 1, name: "sammanställa mötet", delivery: "Få en överblick över framtida arbete", allocated_time: 12, time_spent: 12, due_date: '2017-2-15', description: {}},
		]
	}
];


sprints.forEach((sprint) => {
	sprint.tasks.forEach((task) => {

	});
});

window.SETTINGS = ((() => {

	var settings = {
		'default_days_for_sprint_due_date': 30,
		'default_days_for_task_due_date': 7,
		'override_allocated_time': {
			tags: ['meeting'],
			allocated_time: 18
		},
		'append_tasks_to_unspent_time': {
			tags: ['meeting'],
			tasks: [{
				priority: 1,
				name: "loggbok",
				delivery: "loggboksinlägg",
				allocated_time: 3,
				time_spent: 0, description: {}}
			]
		},
		'time_span_dashboard_backlog': 30
	}


	return {
		get: function (what) {
			return settings[what];
		},
		set: function (what, val) {
			settings[what] = val;
		}
	}
})())


window.DataHandler = ((() => {

	var local = window.localStorage;

	function randomName(offset = 0) {
		let date = new Date((new Date()).getTime() + offset);
		return (
			+ (date.getFullYear()).toString()
			+ '-' + ('0' + (date.getMonth()+1)).slice(-2))
			+ '-' + ('0' + date.getDate()).slice(-2)
			+ "@" + (date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1"));
	}

	function getDate(strdate) {
		// 2017-03-12@22:38:05
		let in_date = strdate.split('@'),
			idf = in_date[0].split('-').map((d) => { return Number(d) }),
			date = new Date();


		date.setFullYear(idf[0], idf[1] + 1, idf[2]);

		if ( in_date.length === 1 ) {
			return date;
		}
		let itf = in_date[1].split(':').map((d) => { return Number(d) - 1; });

		date.setHours(...itf);

		return date;

	}

	function getIndex(...args) {
		let lvls = [
			{
				varname: 'sprint_index',
				base: 'sprints'
			},
			{
				varname: 'task_index',
				base: 'tasks'
			},
			{
				varname: 'subtask_index',
				base: 'sub_tasks'
			}
		];

		let ret = {};

		let base = this;
		args.forEach((arg, i) => {

			if (ret === -1) { return };

			let level = lvls[i];
			base = base[level.base];

			let res_index = base.findIndex((ob) => { return ob.name === arg })

			if (res_index < 0) {
				console.log('Could not find the ' + level.varname + ' of ' + arg);
				ret = -1;
				return;
			}

			ret[level.varname] = res_index;

			base = base[res_index];

		});

		return ret;
	}

	function addTask(sprint_name, data) {

		let {sprint_index} = getIndex.call(this, sprint_name);

		if ( sprint_index < 0) {
			console.log('Could not find the sprint: ' + sprint_name);
			return;
		}

		if ( ! data.hasOwnProperty('name') ) {
			data.name = randomName();
		}
		if ( ! data.hasOwnProperty('sub_tasks') ) {
			data.sub_tasks = [];
		}

		this.sprints[sprint_index].tasks.push(data);

		return this.sprints;

	}

	function addSprint(data) {

		if (! data.hasOwnProperty('tasks')) {
			data.tasks = [];
		}
		if ( ! data.hasOwnProperty('name') ) {
			data.name = randomName();
		}

		this.sprints.push(data);

		return this.sprints;
	}


	function addSubTask(sprint_name, task_name, data) {

		let {sprint_index, task_index} = getIndex.call(this, sprint_name, task_name);

		if ( ! data.hasOwnProperty('name') ) {
			data.name = randomName();
		}

		this.sprints[sprint_index].tasks[task_index].sub_tasks.push(data);

		return this.sprints;
	}


	function updateSubTask(...args) {

		let data = args.slice(-1)[0],
			names = args.slice(0, -1);

		let {sprint_index, task_index, subtask_index} = getIndex.apply(this, names);

		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				this.sprints[sprint_index].tasks[task_index].sub_tasks[subtask_index][key] = data[key];
			}
		}

		return this.sprints;

	}

	function updateTask(...args) {

		let data = args.slice(-1)[0],
			names = args.slice(0, -1);

		let {sprint_index, task_index} = getIndex.apply(this, names);

		for (let key in data) {
			if (data.hasOwnProperty(key) && key !== 'sub_tasks') {
				this.sprints[sprint_index].tasks[task_index][key] = data[key];
			}
		}		

		return this.sprints;
	}

	function updateSprint(sprint_name, data) {
		let {sprint_index} = getIndex.call(this, sprint_name);

		for (let key in data) {
			if (data.hasOwnProperty(key) && key !== 'tasks') {
				this.sprints[sprint_index][key] = data[key];
			}
		}

		return this.sprints;
	}

	function CU_function(func_mapping) {

		return function (what, ...args) {
			var data, sprint;

			switch (what) {
				case 'sprint':
					updateStorage(func_mapping.sprint)(...args);
					break;
				case 'task':
					updateStorage(func_mapping.task)(...args);
					break;
				case 'subtask':
					updateStorage(func_mapping.subtask)(...args);
					break;
				case 'import':
					setStorageData(...args);
					break;

			}

		}
	}

	function readSprint(sprint_name) {

		let {sprint_index} = getIndex.call(this, sprint_name);

		if (sprint_index < 0) {
			return null;
		}

		return this.sprints[sprint_index];
	}

	function readTask(sprint_name, task_name) {
		let {sprint_index} = getIndex.call(this, sprint_name);

		if (sprint_index < 0) {
			return null;
		}

		let task_index = this.sprints[sprint_index].tasks.findIndex((task) => { return task.name === task_name; });

		if (task_index < 0) {
			return null;
		}


		return this.sprints[sprint_index].tasks[task_index];
	}

	function omit(obj, omitKey) {
		return Object.keys(obj).reduce((result, key) => {
			if(key !== omitKey) {
				result[key] = obj[key];
			}
			return result;
		}, {});
	}

	function getBacklog(sprints) {
		let result = [];
		sprints.forEach((sprint) => {

			let b_sprint = Object.assign({}, omit(sprint, 'tasks'), {sprint: sprint.name, type: 'sprint'});

			result.push(b_sprint);

			sprint.tasks.forEach((task) => {

				let b_task = Object.assign({}, omit(task, 'sub_tasks'), {sprint: b_sprint.sprint, type: 'task'});
				result.push(b_task);

				task.sub_tasks.forEach((sub_task) => {
					result.push(Object.assign({}, sub_task, {parent_task: b_task.name, sprint: b_task.sprint, due_date: b_task.due_date, type: 'sub_task'}));
				});
			});
		});

		return result.sort(function (a, b) {
			let a_date = getDate(a.due_date),
				b_date = getDate(b.due_date);

			return b_date - a_date;
		}).map((ob, index) => {
			ob.index = index + 1;
			return ob;
			// ob.time_used = ob.allocated_time - ob.time_spent
		});

	}

	function READ(what, ...args) {

		switch (what) {
			case 'sprint':
				return readSprint.apply(getStorageData(), args);
				break;
			case 'task':
				return readTask.apply(getStorageData(), args);
				break;
			case 'all':
				return getStorageData().sprints;
				break;
			case 'backlog':
				return getBacklog(getStorageData().sprints);
				break;
		}

	}

	function CREATE(...args) {

		CU_function({
			sprint: addSprint,
			task: addTask,
			subtask: addSubTask
		}).apply(null, args);

	}
	function UPDATE(...args) {
		CU_function({
			sprint: updateSprint,
			task: updateTask,
			subtask: updateSubTask
		}).apply(null, args);
	}

	function DELETE(what) {

	}



	function updateStorage(func) {
		return (...args) => {
			setStorageData(func.apply(getStorageData(), args));
		}
	}

	function validate(sprints) {
		sprints.forEach((sprint, si) => {
			if ( ! sprint.hasOwnProperty('name') ) {
				sprints[si].name = randomName();
			}
			if ( ! sprint.hasOwnProperty('tasks') ) {
				sprints[si].tasks = [];
			}

			if ( ! sprint.hasOwnProperty('allocated_time') ) {
				sprints[si].allocated_time = 0;
			}

			if ( ! sprint.hasOwnProperty('due_date') ) {
				sprints[si].due_date = randomName(1000 * 3600 * 24 * SETTINGS.get('default_days_for_sprint_due_date'));
			}
			if ( ! sprint.hasOwnProperty('completed') ) {
				sprints[si].completed = getDate(sprints[si].due_date) > new Date();
			}

			sprint.tasks.forEach((task, ti) => {

				if ( ! task.hasOwnProperty('name') ) {
					sprints[si].tasks[ti].name = randomName();
				}
				if ( ! task.hasOwnProperty('sub_tasks') ) {
					sprints[si].tasks[ti].sub_tasks = [];
				}
				if ( ! task.hasOwnProperty('allocated_time') ) {
					sprints[si].tasks[ti].allocated_time = 0;
				}
				if ( ! task.hasOwnProperty('time_spent') ) {
					sprints[si].tasks[ti].time_spent = 0;
				}				
				if ( ! task.hasOwnProperty('due_date') ) {
					sprints[si].tasks[ti].due_date = randomName(1000 * 3600 * 24 * SETTINGS.get('default_days_for_task_due_date'));
				}
				if ( ! task.hasOwnProperty('completed') ) {
					sprints[si].tasks[ti].completed = getDate(sprints[si].tasks[ti].due_date) >= new Date();
				}
				task.sub_tasks.forEach((sub_task, sti) => {
					if ( ! sub_task.hasOwnProperty('name') ) {
						sprints[si].tasks[ti].sub_tasks[sti].name = randomName();
					}

					if ( ! sub_task.hasOwnProperty('time_spent') ) {
						sprints[si].tasks[ti].sub_tasks[sti].time_spent = 0;
					}

					if ( ! sub_task.hasOwnProperty('completed') ) {
						sprints[si].tasks[ti].sub_tasks[sti].completed = sprints[si].tasks[ti].completed;
					}
				});

			});
		});



		return sprints;
	}

	function setStorageData(sprints) {

		sprints = validate(sprints);

		local.setItem('backlog', JSON.stringify(sprints));
	}
	function getStorageData() {
		if (! localStorage.getItem('backlog')) {
			setStorageData([]);
		}
		return {
			sprints: JSON.parse(local.getItem('backlog'))
		};
	}


	return {
		CREATE: CREATE,
		READ: READ,
		UPDATE: UPDATE,
		DELETE: DELETE
	};

})());




$(() => {

	window.tags_engine = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: []
	});
	tags_engine.initialize();

	/**
	 * Typeahead
	 */
	var elt = $('.tags-input');
	elt.tagsinput({
	  typeaheadjs: {
		name: 'tags',
		displayKey: 'name',
		valueKey: 'name',
		source: tags_engine.ttAdapter()
	  }
	});

	// HACK: overrule hardcoded display inline-block of typeahead.js
	$(".twitter-typeahead").css('display', 'inline');

	function clearForm(form) {
		form.find('input,textarea').val('');
	}

	
	$('form#add-task-form').submit((ev) => {
		ev.preventDefault();
		let form = $(ev.currentTarget);
		let form_data = {};
		let sprint = form.find('.sprint-selection .value').text();
		form_data.name = form.find('#task-name').val();
		form_data.due_date = form.find('#task-due_date').val();
		form_data.delivery = form.find('#task-delivery').val();
		form_data.description = form.find('#task-desc').val();
		form_data.priority = form.find('#task-prio').val();
		form_data.allocated_time = form.find('#task-allocation').val();


		if (form_data.due_date !== '' && form_data.name !== '' && form_data.allocation !== '' && sprint !== 'Choose one...') {
			DataHandler.CREATE('task', sprint, form_data);
			clearForm(form);
		}
	});
	$('form#add-sprint-form').submit((ev) => {
		ev.preventDefault();
		let form = $(ev.currentTarget);
		let form_data = {};
		form_data.name = form.find('#sprint-name').val();
		form_data.due_date = form.find('#sprint-due_date').val();
		form_data.delivery = form.find('#sprint-delivery').val();
		form_data.description = form.find('#sprint-desc').val();
		form_data.priority = form.find('#sprint-prio').val();
		form_data.allocated_time = form.find('#sprint-allocation').val();
		form_data.tags = form.find('.tags-input').tagsinput('items');


		if (form_data.due_date !== '' && form_data.name !== '' && form_data.allocation !== '') {
			DataHandler.CREATE('sprint', form_data);
			clearForm(form);
		}
	});
	$('form#add-subtask-form').submit((ev) => {
		ev.preventDefault();
		let form = $(ev.currentTarget);
		let form_data = {};
		let sprint = form.find('.sprint-selection .value').text();
		let task = form.find('.task-selection .value').text();

		form_data.name = form.find('#subtask-name').val();
		form_data.delivery = form.find('#subtask-delivery').val();
		form_data.description = form.find('#subtask-desc').val();
		form_data.priority = form.find('#subtask-prio').val();
		form_data.allocated_time = form.find('#subtask-allocation').val();
		form_data.tags = form.find('.tags-input').tagsinput('items');


		if (form_data.name !== '' && form_data.allocation !== '') {
			DataHandler.CREATE('subtask', sprint, task);
			clearForm(form);
		}
	});


	const dd_items_wrapper = (items) => {
		return items.map((ob) => {return $(`<li><a href="#">${ob.name}</a></li>`)})
	}
	let dd_items = dd_items_wrapper(DataHandler.READ('all'));
	$('.sprint-selection .dropdown-menu').append(dd_items);


	// DataHandler.READ('backlog').filter()

	// let dd_items = DataHandler.READ('all').map((ob) => {return $(`<li><a href="#">${ob.name}</a></li>`)})
	// $('form#add-task-form .sprint-selection .dropdown-menu').append(dd_items);

	$(document).on('click', '.dropdown li a', (ev) => {
		ev.preventDefault();
		let val_el = $(ev.currentTarget).parent().parent().parent().find('.value')
		val_el.html(
			ev.currentTarget.innerText
		);
	});
	$('#add-subtask-form .sprint-selection li a').click((ev) => {

		let dd_items = dd_items_wrapper(DataHandler.READ('backlog').filter((ob) => {
			return ob.type === 'task' && ev.currentTarget.innerText === ob.sprint;
		}));
		$('#add-subtask-form .task-selection .dropdown-menu').append(dd_items);

	});

	function format ( d ) {
		// `d` is the original data object for the row
		let child;
		switch (d.type) {
			case 'sprint':
				child = 'task',
				break;
			case 'task'
				child = 'sub_task';
				break;
		}

		let children = [];
		if (child) {
			children = DataHandler.READ('backlog').filter((row) => {
				if (child === 'task') {
					return row.type === 'task' && row.sprint === d.name;
				} else if (child === 'task') {
					return row.type = 'sub_task' && row.parent_task = d.name
				}
			});
		}
		return `
		<h3 class="page-header">${d.name}</h3>
		<p>${d.description}</p>
		<h3 class="page-header">Children</h3>
		${children.forEach((el) => {})}
		`;
	}

	let backlog = $('#backlog').DataTable({
		responsive: true,
		data: [{
			index: 1,
			name: 'somesprint',
			sprint: 'somesprint',
			allocated_time: '8',
			time_spent: '8',
			due_date: '2017-03-4',
			delivery: '123',
			description: 'something'
		}],
		columns: [
			{
				className: 'expand-col text-center',
				oderable: false,
				data: null,
				defaultContent: '<a href="#"><i class="fa fa-minus-square-o fa-fw"></i><i class="fa fa-plus-square-o fa-fw"></i></a>'
			},
			{data: 'index'},
			{data: 'name'},
			{data: 'allocated_time'},
			{data: 'time_spent'},
			{data: 'due_date'}
		],
		order: [[1, 'asc']]
	});


	$(document).on('click', '#backlog .expand-col', (ev) => {
		ev.preventDefault();
		let tr = $(ev.currentTarget).closest('tr');
		let row = backlog.row(tr);
		if ( row.child.isShown() ) {
			// This row is already open - close it
			row.child.hide();
			tr.removeClass('shown');
		}
		else {
			// Open this row
			row.child( format(row.data()) ).show();
			tr.addClass('shown');
		}
	});


	// TEST();

	// DataHandler.CREATE('import', sprints);

	DataHandler.READ('backlog');


	// $('form#add-task-form').submit();
});

var tds = [
	{
		desc: "CREATE testing",
		test: function () {
			DataHandler.CREATE('sprint', {name: 'somesprint', data: 'here', due_date: '2017-03-12'});
			DataHandler.CREATE('task', 'somesprint', {name: 'sometask', moredata: '123', due_date: '2017-03-12'});
			return localStorage.getItem('backlog');
		},
		expect: `[{"name":"somesprint","data":"here","due_date":"2017-03-12","tasks":[{"name":"sometask","moredata":"123","due_date":"2017-03-12","sub_tasks":[],"completed":true}],"completed":true}]`
	},
	{
		desc: "UPDATE testing of task",
		test: function () {

			DataHandler.UPDATE('task', 'somesprint', 'sometask', {data: 'haha'});
			return localStorage.getItem('backlog');
		},
		expect: `[{"name":"somesprint","data":"here","due_date":"2017-03-12","tasks":[{"name":"sometask","moredata":"123","due_date":"2017-03-12","sub_tasks":[],"completed":true,"data":"haha"}],"completed":true}]`
	},
	{
		desc: "UPDATE testing of sprint",
		test: function () {
			DataHandler.UPDATE('sprint', 'somesprint', {data: 'newdata :D'})
			return localStorage.getItem('backlog');
		},
		expect: `[{"name":"somesprint","data":"newdata :D","due_date":"2017-03-12","tasks":[{"name":"sometask","moredata":"123","due_date":"2017-03-12","sub_tasks":[],"completed":true,"data":"haha"}],"completed":true}]`
	},
	{
		desc: "READ testing of sprint",
		test: function () {
			return JSON.stringify(DataHandler.READ('sprint', 'somesprint'));
		},
		expect: `{"name":"somesprint","data":"newdata :D","due_date":"2017-03-12","tasks":[{"name":"sometask","moredata":"123","due_date":"2017-03-12","sub_tasks":[],"completed":true,"data":"haha"}],"completed":true}`
	},
	{
		desc: 'READ testing of task',
		test: function () {
			return JSON.stringify(DataHandler.READ('task', 'somesprint', 'sometask'));
		},
		expect: `{"name":"sometask","moredata":"123","due_date":"2017-03-12","sub_tasks":[],"completed":true,"data":"haha"}`
	},
	{
		desc: 'CREATE subtask',
		test: function () {
			DataHandler.CREATE('subtask', 'somesprint', 'sometask', {data: 123, name: 'somesubtask'});
			return localStorage.getItem('backlog');
		},
		expect: `[{"name":"somesprint","data":"newdata :D","due_date":"2017-03-12","tasks":[{"name":"sometask","moredata":"123","due_date":"2017-03-12","sub_tasks":[{"data":123,"name":"somesubtask","completed":true}],"completed":true,"data":"haha"}],"completed":true}]`
	},
	{
		desc: 'UPDATE subtask',
		test: function () {
			DataHandler.UPDATE('subtask', 'somesprint', 'sometask', 'somesubtask', {thenewaddeddata: 'LOOK IT IS NEW'})
			return localStorage.getItem('backlog');
		},
		expect: `[{"name":"somesprint","data":"newdata :D","due_date":"2017-03-12","tasks":[{"name":"sometask","moredata":"123","due_date":"2017-03-12","sub_tasks":[{"data":123,"name":"somesubtask","completed":true,"thenewaddeddata":"LOOK IT IS NEW"}],"completed":true,"data":"haha"}],"completed":true}]`
	}
];

function TEST() {
	localStorage.clear();

	tds.forEach((td, index) => {
		test = td.test();
		expect = td.expect;
		res = test === expect;
		console.log('RUNNING:', index + 1, '@', td.desc);
		console.log(`%c RESULT: ${res ? 'success' : 'failure'}`, `background: ${res ? '#B4DA55' : 'red'}`);
		if (! res) {
			console.log(test);
			console.log(' !== ');
			console.log(expect);
		}
		console.log('\n');
	}); 

	localStorage.clear();

}


function TICK() {
	let sprints = DataHandler.READ('all'),
		update = false;

	sprints.forEach((sprint, si) => {

		let status = getDate(sprints[si].due_date) > new Date();
		if (sprints[si].completed !== status) {
			update = true;
			sprints[si].completed = status;
		}

		sprint.tasks.forEach((task, ti) => {

			let status = getDate(sprints[si].tasks[ti].due_date) >= new Date();
			if (sprints[si].tasks[ti].completed !== status) {
				update = true;
				sprints[si].tasks[ti].completed = status;
			}

			task.sub_tasks.forEach((sub_task, sti) => {
				let status = sprints[si].tasks[ti].completed;
				if (sprints[si].tasks[ti].sub_tasks[sti].completed !== status) {
					update = true;
					sprints[si].tasks[ti].sub_tasks[sti].completed = status;
				}
			});

		});
	});

	if (status) {
		DataHandler.CREATE('import', sprints);
	}



}

setInterval(TICK, 1000 * 60 * 5);


